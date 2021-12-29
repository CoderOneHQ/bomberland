use crate::{
    entity::Entity,
    game_state::GameState,
    unit::{Direction, UnitID},
};
use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Serialize, Deserialize, Debug)]
pub struct EventsPayload {
    pub events: Vec<Event>,
}

#[derive(Serialize, Deserialize, Debug)]
pub enum ServerPacketType {
    #[serde(rename = "game_state")]
    GameState,
    #[serde(rename = "tick")]
    Tick,
    #[serde(rename = "endgame_state")]
    EndGameState,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(untagged)]
pub enum ServerPacketPayload {
    GameState(GameState),
    Events(EventsPayload),
    EndGameState(Value),
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ServerPacket {
    pub r#type: ServerPacketType,
    pub payload: ServerPacketPayload,
}

#[derive(Serialize, Deserialize, Debug)]
pub enum EventType {
    #[serde(rename = "unit")]
    Unit,
    #[serde(rename = "unit_state")]
    UnitState,
    #[serde(rename = "entity_expired")]
    EntityExpired,
    #[serde(rename = "entity_spawned")]
    EntitySpawned,
    #[serde(rename = "entity_state")]
    EntityState,
}

/// Events are pretty awkwardly defined types,
/// having inconsistent field properties
/// and having data be both a JSON object and array
#[derive(Serialize, Deserialize, Debug)]
pub struct Event {
    pub r#type: EventType,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<Value>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub coordinates: Option<[u8; 2]>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub updated_entity: Option<Entity>,
}

#[derive(Serialize, Deserialize, Debug)]
pub enum ActionPacketType {
    #[serde(rename = "bomb")]
    Bomb,
    #[serde(rename = "move")]
    Move,
    #[serde(rename = "detonate")]
    Detonate,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ActionPacket {
    #[serde(rename = "type")]
    pub r#type: ActionPacketType,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub unit_id: Option<UnitID>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub coordinates: Option<[u8; 2]>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub r#move: Option<Direction>,
}
