use crate::{
    agent::{Agent, AgentID},
    entity::{Entity, EntityType},
    unit::{Unit, UnitID},
    Config, Connection, World,
};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Serialize, Deserialize, Debug, Default)]
pub struct GameState {
    #[serde(skip_serializing)]
    pub tick: u32,
    pub agents: HashMap<AgentID, Agent>,
    pub unit_state: HashMap<UnitID, Unit>,
    pub entities: Vec<Entity>,
    pub world: World,
    pub config: Config,
    pub connection: Connection,
}

impl GameState {
    pub fn expire_entity_at_coordinates(&mut self, coordinates: [u8; 2]) {
        let mut i = 0;
        while i < self.entities.len() {
            let entity = &self.entities[i];
            if entity.x == coordinates[0] && entity.y == coordinates[1] {
                self.entities.remove(i);
                break;
            } else {
                i += 1;
            }
        }
    }

    pub fn update_entity_state_at_coordinates(&mut self, new_state: Entity, coordinates: [u8; 2]) {
        let mut i = 0;
        while i < self.entities.len() {
            if self.entities[i].x == coordinates[0] && self.entities[i].y == coordinates[1] {
                self.entities[i].update_state(&new_state);
                break;
            } else {
                i += 1;
            }
        }
    }

    pub fn add_entity(&mut self, entity: Entity) {
        self.entities.push(entity);
    }

    pub fn update_unit_state(&mut self, new_state: Unit) {
        if self.unit_state.contains_key(&new_state.unit_id) {
            let unit = self.unit_state.get_mut(&new_state.unit_id).unwrap();
            unit.update_state(new_state);
        }
    }

    pub fn get_unit_ids_for_agent(&self, agent_id: &AgentID) -> Option<&Vec<UnitID>> {
        if self.agents.contains_key(agent_id) {
            return Some(&self.agents.get(agent_id).unwrap().unit_ids);
        }
        None
    }

    pub fn get_bomb_for_unit(&self, unit_id: &UnitID) -> Option<&Entity> {
        for entity in self.entities.iter() {
            if entity.r#type == EntityType::Bomb && entity.owner_unit_id == Some(unit_id.clone()) {
                return Some(&entity);
            }
        }
        None
    }
}
