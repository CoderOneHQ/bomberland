use crate::unit::UnitID;
use serde::{Deserialize, Serialize};

/// Enum of possible entity types
#[derive(Serialize, Deserialize, Debug, Clone, Eq, PartialEq)]
pub enum EntityType {
    #[serde(rename = "a")]
    Ammunition,
    #[serde(rename = "b")]
    Bomb,
    #[serde(rename = "x")]
    Blast,
    #[serde(rename = "bp")]
    BlastPowerUp,
    #[serde(rename = "m")]
    MetalBlock,
    #[serde(rename = "o")]
    OreBlock,
    #[serde(rename = "w")]
    WoodenBlock,
}

/// Describes an entity (e.g. blocks, explosions) on the map.
#[derive(Serialize, Deserialize, Debug)]
pub struct Entity {
    /// Tick on which this entity was created (0 = part of the initial world rendering)
    pub created: u16,
    /// x-coordinate
    pub x: u8,
    /// y-coordinate
    pub y: u8,
    /// the type of entity
    pub r#type: EntityType,
    /// ID of the unit that owns this entity
    #[serde(skip_serializing_if = "Option::is_none")]
    pub owner_unit_id: Option<UnitID>,
    /// Tick on which this entity will perish from the map.
    /// E.g. a bomb placed with expires=74 will explode on tick 74.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub expires: Option<u16>,
    /// Health Points taken before entity perishes
    #[serde(skip_serializing_if = "Option::is_none")]
    pub hp: Option<i8>,
    /// Diameter of blast range (if this entity is a bomb)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub blast_diameter: Option<u8>,
}

impl Entity {
    pub fn update_state(&mut self, new_state: &Entity) {
        self.created = new_state.created;
        self.x = new_state.x;
        self.y = new_state.y;
        self.r#type = new_state.r#type.clone();
        self.owner_unit_id = new_state.owner_unit_id.clone();
        self.expires = new_state.expires;
        self.hp = new_state.hp;
        self.blast_diameter = new_state.blast_diameter;
    }
}
