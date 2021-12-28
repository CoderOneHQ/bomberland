use crate::{
    agent::AgentID,
    entity::Entity,
    game_state::GameState,
    packets::{Event, EventType, ServerPacket, ServerPacketPayload, ServerPacketType},
    unit::{Direction, Unit, UnitID},
};
use anyhow::Result;
use std::net::TcpStream;
use tungstenite::{connect, stream::MaybeTlsStream, Message, WebSocket};
use url::Url;

pub struct GameConnection {
    socket: WebSocket<MaybeTlsStream<TcpStream>>,
    game_state: GameState,
    agent: AgentID,
}

impl GameConnection {
    pub fn new(url: &String, agent: AgentID) -> GameConnection {
        let (socket, _) = connect(Url::parse(url).unwrap()).expect("Can't connect");

        Self {
            socket,
            game_state: Default::default(),
            agent,
        }
    }

    fn on_unit_event(&mut self, event: Event) {
        if let Some(data) = event.data {
            let event_type: &str = data.get("type").unwrap().as_str().unwrap();
            let unit_id: UnitID =
                serde_json::from_str(&data.get("unit_id").unwrap().to_string()).unwrap();

            match event_type {
                "move" => {
                    if self.game_state.unit_state.contains_key(&unit_id) {
                        let unit = self.game_state.unit_state.get_mut(&unit_id).unwrap();
                        let direction: Direction =
                            serde_json::from_str(&data.get("move").unwrap().to_string()).unwrap();
                        unit.move_into_direction(direction);
                    }
                }
                // We don't need to update anything (?)
                "detonate" => {}
                "bomb" => {}
                _ => {}
            }
        }
    }

    fn on_unit_state_event(&mut self, event: Event) {
        if let Some(data) = event.data {
            let unit_state: Unit = serde_json::from_value(data).unwrap();
            self.game_state.update_unit_state(unit_state);
        }
    }

    fn on_entity_expired_event(&mut self, event: Event) {
        if let Some(data) = event.data {
            let coordinates: [u8; 2] = serde_json::from_value(data).unwrap();
            self.game_state.expire_entity_at_coordinates(coordinates);
        }
    }

    fn on_entity_spawned_event(&mut self, event: Event) {
        if let Some(data) = event.data {
            let entity: Entity = serde_json::from_value(data).unwrap();
            self.game_state.add_entity(entity);
        }
    }

    fn on_entity_state_event(&mut self, event: Event) {
        if let Some(updated_entity) = event.updated_entity {
            let coordinates: [u8; 2] = event.coordinates.unwrap();
            self.game_state
                .update_entity_state_at_coordinates(updated_entity, coordinates);
        }
    }

    fn on_tick(&mut self) {
        let mut action_packets = vec![];
        let unit_ids = self.game_state.get_unit_ids_for_agent(&self.agent);

        if unit_ids.is_some() {
            for unit_id in unit_ids.unwrap().iter() {
                let unit_opt = self.game_state.unit_state.get(&unit_id);

                if let Some(unit) = unit_opt {
                    if !unit.is_alive() {
                        continue;
                    }

                    if let Some(bomb) = self.game_state.get_bomb_for_unit(&unit.unit_id) {
                        action_packets.push(unit.create_detonate_bomb_action(&bomb));
                    } else if unit.has_bomb() {
                        action_packets.push(unit.create_place_bomb_action());
                    } else {
                        action_packets.push(unit.create_move_action(rand::random()));
                    }
                }
            }
        }

        for action_packet in action_packets.iter() {
            self.socket
                .write_message(Message::Text(
                    serde_json::to_string(action_packet).expect("Failed to serialize ActionPacket"),
                ))
                .expect("Failed to send ActionPacket");
        }
    }

    fn packet_handler(&mut self, server_packet: ServerPacket) -> bool {
        match server_packet.r#type {
            ServerPacketType::GameState => {
                if let ServerPacketPayload::GameState(state) = server_packet.payload {
                    self.game_state = state;
                }
            }
            ServerPacketType::Tick => {
                if let ServerPacketPayload::Events(events_payload) = server_packet.payload {
                    let events = events_payload.events;

                    for event in events.into_iter() {
                        match event.r#type {
                            EventType::Unit => {
                                self.on_unit_event(event);
                            }
                            EventType::UnitState => {
                                self.on_unit_state_event(event);
                            }
                            EventType::EntityExpired => {
                                self.on_entity_expired_event(event);
                            }
                            EventType::EntitySpawned => {
                                self.on_entity_spawned_event(event);
                            }
                            EventType::EntityState => {
                                self.on_entity_state_event(event);
                            }
                        }
                    }
                }
                self.on_tick();
            }
            ServerPacketType::EndGameState => {
                if let ServerPacketPayload::EndGameState(state) = server_packet.payload {
                    println!(
                        "endgame state {}",
                        serde_json::to_string_pretty(&state).unwrap()
                    );
                }
                return true;
            }
        }
        false
    }

    pub fn start(&mut self) -> Result<()> {
        'outer: loop {
            match self.socket.read_message()? {
                Message::Text(msg) => {
                    let server_packet: ServerPacket = serde_json::from_str(&msg)?;
                    let should_close = self.packet_handler(server_packet);
                    if should_close {
                        break 'outer;
                    }
                }
                _ => {}
            }
        }
        self.socket.close(None).expect("Failed to close socket");
        Ok(())
    }
}
