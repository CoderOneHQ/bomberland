use crate::{
    agent::AgentID,
    entity::{Entity, EntityType},
    packets::{ActionPacket, ActionPacketType},
};
use rand::{
    distributions::{Distribution, Standard},
    Rng,
};
use serde::{Deserialize, Serialize};
/// Possible unit identifiers.
#[derive(Serialize, Deserialize, Debug, Hash, Eq, PartialEq, Clone)]
pub enum UnitID {
    #[serde(rename = "c")]
    C,
    #[serde(rename = "d")]
    D,
    #[serde(rename = "e")]
    E,
    #[serde(rename = "f")]
    F,
    #[serde(rename = "g")]
    G,
    #[serde(rename = "h")]
    H,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum Direction {
    #[serde(rename = "up")]
    Up,
    #[serde(rename = "down")]
    Down,
    #[serde(rename = "left")]
    Left,
    #[serde(rename = "right")]
    Right,
}

impl Distribution<Direction> for Standard {
    fn sample<R: Rng + ?Sized>(&self, rng: &mut R) -> Direction {
        match rng.gen_range(0..=3) {
            // rand 0.8
            0 => Direction::Up,
            1 => Direction::Down,
            2 => Direction::Left,
            _ => Direction::Right,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Inventory {
    /// Number of bombs available to place (i.e. ammunition)
    bombs: u8,
}

impl Default for Inventory {
    fn default() -> Self {
        Self { bombs: 0 }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Unit {
    /// [X, Y] location.
    pub coordinates: [u8; 2],
    /// Health points.
    pub hp: i8,
    /// Items owned by unit.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub inventory: Option<Inventory>,
    /// Diameter of blast range for bombs placed by this unit
    pub blast_diameter: u8,
    /// This unit's identifier.
    pub unit_id: UnitID,
    /// The agent to which this unit belongs.
    pub agent_id: AgentID,
    /// Latest tick number after which this unit is no longer invulnerable (inclusive).
    pub invulnerability: u16,
}

impl Unit {
    pub fn move_into_direction(&mut self, direction: Direction) {
        match direction {
            Direction::Up => {
                self.coordinates[1] += 1;
            }
            Direction::Down => {
                self.coordinates[1] -= 1;
            }
            Direction::Left => {
                self.coordinates[0] -= 1;
            }
            Direction::Right => {
                self.coordinates[0] += 1;
            }
        }
    }

    pub fn has_bomb(&self) -> bool {
        self.inventory.is_some() && self.inventory.as_ref().unwrap().bombs > 0
    }

    pub fn is_alive(&self) -> bool {
        self.hp > 0
    }

    pub fn create_place_bomb_action(&self) -> ActionPacket {
        ActionPacket {
            r#type: ActionPacketType::Bomb,
            unit_id: Some(self.unit_id.clone()),
            coordinates: None,
            r#move: None,
        }
    }

    pub fn create_detonate_bomb_action(&self, entity: &Entity) -> ActionPacket {
        if entity.r#type != EntityType::Bomb {
            panic!("Tried to detonate an entity that wasn't bomb!");
        }

        ActionPacket {
            r#type: ActionPacketType::Bomb,
            unit_id: Some(self.unit_id.clone()),
            coordinates: Some([entity.x, entity.y]),
            r#move: None,
        }
    }

    pub fn create_move_action(&self, direction: Direction) -> ActionPacket {
        ActionPacket {
            r#type: ActionPacketType::Move,
            unit_id: Some(self.unit_id.clone()),
            coordinates: None,
            r#move: Some(direction),
        }
    }

    pub fn update_state(&mut self, new_state: Unit) {
        if self.unit_id == new_state.unit_id {
            self.coordinates = new_state.coordinates;
            self.hp = new_state.hp;
            self.inventory = new_state.inventory;
            self.blast_diameter = new_state.blast_diameter;
            self.agent_id = new_state.agent_id;
            self.invulnerability = new_state.invulnerability;
        } else {
            panic!(
                "Attempted to update unit '{:?}' with data from unit '{:?}'",
                self.unit_id, new_state.unit_id
            );
        }
    }
}
