//! Protocol-conformance tests for the Rust starter kit.
//!
//! These deserialize representative engine packets into the kit's typed structs to guard
//! against wire-protocol drift — the shapes here mirror the engine's canonical JSON schema
//! (engine/bomberland-engine/src/runtime-validation/validation.schema.json). If the engine
//! renames or adds a field, the corresponding assertion here should fail.

use crate::agent::AgentID;
use crate::entity::EntityType;
use crate::packets::{ServerPacket, ServerPacketPayload, ServerPacketType};
use crate::unit::UnitID;
use std::{env, fs};

/// An `info` packet, broadcast by the engine while waiting for players to connect.
const INFO_PACKET: &str = r#"{"type": "info", "payload": {"message": "Waiting for agents to connect"}}"#;

/// A `tick` packet exercising the event shapes: entity spawn, unit-state update, unit action.
const TICK_PACKET: &str = r#"
{
  "type": "tick",
  "payload": {
    "tick": 23,
    "events": [
      {"type": "entity_spawned", "data": {"created": 23, "x": 7, "y": 3, "type": "a", "expires": 63, "hp": 1}},
      {"type": "unit_state", "data": {"coordinates": [1, 1], "hp": 2, "inventory": {"bombs": 2}, "blast_diameter": 3, "unit_id": "c", "agent_id": "a", "invulnerable": 0, "stunned": 0}},
      {"type": "unit", "agent_id": "a", "data": {"type": "move", "move": "right", "unit_id": "c"}}
    ]
  }
}
"#;

/// A game_state payload matching the current engine contract: units carry `stunned` and
/// `invulnerable`, a bomb entity is owned via `unit_id`/`agent_id`.
const GAME_STATE_PACKET: &str = r#"
{
  "type": "game_state",
  "payload": {
    "game_id": "test",
    "tick": 5,
    "agents": {
      "a": {"agent_id": "a", "unit_ids": ["c"]},
      "b": {"agent_id": "b", "unit_ids": ["d"]}
    },
    "unit_state": {
      "c": {"coordinates": [1, 1], "hp": 3, "inventory": {"bombs": 2}, "blast_diameter": 3, "unit_id": "c", "agent_id": "a", "invulnerable": 0, "stunned": 0},
      "d": {"coordinates": [3, 3], "hp": 3, "inventory": {"bombs": 3}, "blast_diameter": 3, "unit_id": "d", "agent_id": "b", "invulnerable": 0, "stunned": 7}
    },
    "entities": [
      {"created": 4, "x": 1, "y": 1, "type": "b", "unit_id": "c", "agent_id": "a", "expires": 40, "blast_diameter": 3},
      {"created": 4, "x": 7, "y": 7, "type": "fp", "expires": 50, "hp": 1}
    ],
    "world": {"width": 15, "height": 15},
    "config": {"tick_rate_hz": 10, "game_duration_ticks": 300, "fire_spawn_interval_ticks": 5},
    "connection": {"id": 1, "role": "agent", "agent_id": "a"}
  }
}
"#;

fn parse_game_state(json: &str) -> crate::game_state::GameState {
    let packet: ServerPacket = serde_json::from_str(json).expect("game_state packet should parse");
    assert!(matches!(packet.r#type, ServerPacketType::GameState));
    match packet.payload {
        ServerPacketPayload::GameState(state) => state,
        other => panic!("expected GameState payload, got {:?}", other),
    }
}

#[test]
fn info_packet_parses_without_error() {
    // Regression: the engine broadcasts `info` packets while waiting for players. If the
    // ServerPacketType enum lacks this variant, the agent panics on connect.
    let packet: ServerPacket = serde_json::from_str(INFO_PACKET).expect("info packet should parse");
    assert!(matches!(packet.r#type, ServerPacketType::Info));
}

#[test]
fn tick_packet_parses_without_error() {
    let packet: ServerPacket = serde_json::from_str(TICK_PACKET).expect("tick packet should parse");
    assert!(matches!(packet.r#type, ServerPacketType::Tick));
}

/// Compiles a validator pinned to the engine's `ServerPacket` union. The schema path comes from
/// BOMBERLAND_SCHEMA_PATH (CI points it at the engine's canonical schema) and defaults to the
/// bundled copy for local runs and standalone clones.
fn compile_server_packet_schema() -> jsonschema::JSONSchema {
    let path = env::var("BOMBERLAND_SCHEMA_PATH").unwrap_or_else(|_| "validation.schema.json".to_string());
    let text = fs::read_to_string(&path).unwrap_or_else(|e| panic!("could not read schema at {}: {}", path, e));
    let doc: serde_json::Value = serde_json::from_str(&text).expect("schema should be valid JSON");
    // The document root only holds `definitions` (no constraints), so pin validation to the
    // ServerPacket union while keeping the sibling definitions resolvable for internal $refs.
    let root = serde_json::json!({
        "$ref": "#/definitions/ServerPacket",
        "definitions": doc["definitions"].clone(),
    });
    jsonschema::JSONSchema::compile(&root).expect("engine schema should compile")
}

#[test]
fn fixtures_conform_to_engine_server_packet_schema() {
    let schema = compile_server_packet_schema();
    for (name, fixture) in [
        ("game_state", GAME_STATE_PACKET),
        ("info", INFO_PACKET),
        ("tick", TICK_PACKET),
    ] {
        let instance: serde_json::Value =
            serde_json::from_str(fixture).unwrap_or_else(|e| panic!("fixture `{}` invalid JSON: {}", name, e));
        // Collect errors into owned strings so nothing borrows `instance` past this statement.
        let validation: Result<(), Vec<String>> = schema
            .validate(&instance)
            .map_err(|errors| errors.map(|e| format!("  - {} (at {})", e, e.instance_path)).collect());
        if let Err(details) = validation {
            panic!(
                "fixture `{}` does not conform to the engine ServerPacket schema:\n{}",
                name,
                details.join("\n")
            );
        }
    }
}

#[test]
fn unit_state_includes_stunned() {
    let state = parse_game_state(GAME_STATE_PACKET);
    let unit_d = state
        .unit_state
        .get(&UnitID::D)
        .expect("unit d should exist");
    assert_eq!(unit_d.stunned, 7, "stunned must be deserialized from the wire");
    assert_eq!(unit_d.invulnerable, 0);
}

#[test]
fn bomb_is_owned_via_unit_id() {
    // Regression: the engine renamed the bomb owner field from `owner_unit_id` to `unit_id`.
    // get_bomb_for_unit must find unit c's bomb; if the field is stale it returns None.
    let state = parse_game_state(GAME_STATE_PACKET);
    let bomb = state
        .get_bomb_for_unit(&UnitID::C)
        .expect("unit c's bomb should be found via unit_id");
    assert_eq!(bomb.r#type, EntityType::Bomb);
    assert_eq!([bomb.x, bomb.y], [1, 1]);
    assert_eq!(bomb.agent_id, Some(AgentID::A));
}

#[test]
fn detonate_action_serializes_as_detonate() {
    // Regression: create_detonate_bomb_action previously sent type "bomb" instead of "detonate".
    let state = parse_game_state(GAME_STATE_PACKET);
    let unit_c = state.unit_state.get(&UnitID::C).unwrap();
    let bomb = state.get_bomb_for_unit(&UnitID::C).unwrap();
    let action = unit_c.create_detonate_bomb_action(bomb);
    let json = serde_json::to_string(&action).expect("action should serialize");
    assert!(
        json.contains("\"type\":\"detonate\""),
        "detonate action must use type \"detonate\", got: {}",
        json
    );
    assert!(json.contains("\"coordinates\":[1,1]"));
}
