use crate::unit::UnitID;
use serde::{Deserialize, Serialize};

/// Possible agent identifiers.
#[derive(Serialize, Deserialize, Debug, Hash, Eq, PartialEq, Clone)]
pub enum AgentID {
    #[serde(rename = "a")]
    A,
    #[serde(rename = "b")]
    B,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Agent {
    /// Agent identifier.
    pub agent_id: AgentID,
    /// List of unit IDs belonging to this agent.
    pub unit_ids: Vec<UnitID>,
}
