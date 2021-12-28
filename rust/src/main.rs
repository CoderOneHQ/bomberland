use serde::{Deserialize, Serialize};
use std::env;

/// Information on the world map.
#[derive(Serialize, Deserialize, Debug)]
pub struct World {
    /// Number of cells horizontally (Default: 15)
    pub width: u8,
    /// Number of cells vertically (Default: 15)
    pub height: u8,
}

impl Default for World {
    fn default() -> Self {
        Self {
            width: 15,
            height: 15,
        }
    }
}

/// Configuration settings for the game environment
#[derive(Serialize, Deserialize, Debug)]
pub struct Config {
    /// Number of ticks per second
    pub tick_rate_hz: u8,
    /// Number of ticks before end game fire starts
    pub game_duration_ticks: u16,
    /// Number of ticks between each end-game fire spawn
    pub fire_spawn_interval_ticks: u8,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            tick_rate_hz: 10,
            game_duration_ticks: 1800,
            fire_spawn_interval_ticks: 15,
        }
    }
}

/// Possible roles for a connection.
#[derive(Serialize, Deserialize, Debug)]
pub enum Role {
    #[serde(rename = "agent")]
    Agent,
    #[serde(rename = "spectator")]
    Spectator,
    #[serde(rename = "admin")]
    Admin,
}

impl Default for Role {
    fn default() -> Role {
        Role::Agent
    }
}

pub mod agent;

/// Information about your agent's connection with the game server.
#[derive(Serialize, Deserialize, Debug, Default)]
pub struct Connection {
    /// Used for managing your agent's connection to tournament servers (can be ignored).
    pub id: u8,
    /// Either agent, spectator, or admin.
    pub role: Role,
    /// Whether you are Agent A or B.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub agent_id: Option<agent::AgentID>,
}

pub mod entity;
pub mod game_connection;
pub mod game_state;
pub mod packets;
pub mod unit;

fn main() -> () {
    let conn_string = env::var("GAME_CONNECTION_STRING").unwrap_or("ws://127.0.0.1:3000/?role=agent&agentId=agentA&name=RustAgent".to_owned());
    let mut conn = game_connection::GameConnection::new(
        &conn_string,
        if conn_string.contains("agentA") { agent::AgentID::A } else { agent::AgentID::B },
    );
    conn.start().expect(format!("Failed to connect to {}", conn_string).as_ref());
}
