#include "game_state.hpp"

#include <string>
#include <iostream>

using easywsclient::WebSocket;
using nlohmann::json;

std::string GameState::_connection_string;
        
WebSocket::pointer GameState::connection = NULL; 

void (*GameState::_tick_callback)(const int, const json&) = NULL;

json GameState::_state;


void GameState::_handle_message(const std::string& message)
{

    DEBUG2("message", message);
    json data = json::parse(message);
    // DEBUG(data.dump(4));
    _on_data(data);
}

void GameState::set_game_tick_callback(void (*generate_agent_action_callback)(const int, const json&))
{
    _tick_callback = generate_agent_action_callback;
}

WebSocket::pointer GameState::connect(const std::string& connection_string) 
{
    _connection_string = connection_string;
    do {
        connection = WebSocket::from_url(_connection_string);
    } while (connection == NULL);
    return connection;
}

void GameState::_send(const json& pocket)
{
    connection->send(pocket.dump());
}

void GameState::send_move(const std::string& move, const std::string& unit_id) 
{
    if (move == "up" || move == "down" || move == "left" || move == "right") 
    {
        json packet = {{"type", "move"}, {"move", move}, {"unit_id", unit_id}};
        _send(packet);
    }
}

void GameState::send_bomb(const std::string& unit_id) 
{
    json packet = {{"type", "bomb"}, {"unit_id", unit_id}};
    _send(packet);
}

void GameState::send_detonate(int x, int y, const std::string& unit_id) 
{
    json packet = {{"type", "detonate"}, {"coordinates", {x, y}}, {"unit_id", unit_id}};
    _send(packet);
}


void GameState::handle_messages()
{
    while (connection->getReadyState() != WebSocket::CLOSED) 
    {
        connection->poll();
        connection->dispatch(*_handle_message);
    }
    std::cerr << "Connection with server closed" << std::endl;
    if (connection != NULL) 
    {
        delete connection;
    }
}

void GameState::_on_data(const json& data) 
{
    std::string data_type = data["type"].get<std::string>();

    if (data_type == "info") 
    {
        // no operation
    }
    else if (data_type == "game_state")
    {
        json payload = data["payload"];
        _on_game_state(payload);
    }
    else if (data_type == "tick")
    {
        json payload = data["payload"];
        _on_game_tick(payload);
    }
    else if (data_type == "endgame_state")
    {
        json payload = data["payload"];
        std::string winning_agent_id = payload["winning_agent_id"];
        std::cout << "Game over. Winner: Agent " << winning_agent_id << std::endl;
    }
    else
    {
        std::cout << "unknown packet \"" << data_type << "\": " << data.dump() << std::endl;
    }
}

void GameState::_on_game_state(const json& game_state)
{
    _state = game_state;
}

void GameState::_on_game_tick(const json& game_tick)
{
    DEBUG("**** _on_game_tick start");
    json events = game_tick["events"];
    for (auto& event: events) 
    {
        // DEBUG(event);
        std::string event_type = event["type"];
        // DEBUG(event_type);
        if (event_type == "entity_spawned")
        {
            _on_entity_spawned(event);
        }
        else if (event_type == "entity_expired")
        {
            _on_entity_expired(event);
        }
        else if (event_type == "unit_state") 
        {
            json payload = event["data"];
            _on_unit_state(payload);
        }
        else if (event_type == "entity_state")
        {
            int x = event["coordinates"][0], y = event["coordinates"][1];
            json updated_entity = event["updated_entity"];
            _on_entity_state(x, y, updated_entity);
        }
        else if (event_type == "unit")
        {
            json unit_action = event["data"];
            _on_unit_action(unit_action);
        }
        else 
        {
            std::cerr << "unknown event type " << event_type << ": " << event.dump() << std::endl;
        }
    }
    if (_tick_callback != NULL) 
    {
        int tick_number = game_tick["tick"];
        _tick_callback(tick_number, _state);
    }
    DEBUG("**** _on_game_tick end");
}

void GameState::_on_entity_spawned(const json& spawn_event)
{
    DEBUG("*** _on_entity_spawned start");
    json spawn_payload = spawn_event["data"];
    _state["entities"].push_back(spawn_payload);
    DEBUG("*** _on_entity_spawned end");
}

void GameState::_on_entity_expired(const json& expire_event)
{
    DEBUG("*** _on_entity_expired start");
    json expire_payload = expire_event["data"];
    int x = expire_payload[0], y = expire_payload[1];
    json entities;
    for (auto& entity: _state["entities"]) 
    {
        if (entity["x"] != x || entity["y"] != y) 
        {
            entities.push_back(entity);
        }
    }
    _state["entities"] = entities;
    DEBUG("*** _on_entity_expired end");
}

void GameState::_on_unit_state(const json& unit_state)
{
    DEBUG("*** _on_unit_state start");
    std::string unit_id = unit_state["unit_id"];
    _state["unit_state"][unit_id] = unit_state;
    DEBUG("*** _on_unit_state end");
}

void GameState::_on_entity_state(int x, int y, const json& updated_entity)
{
    DEBUG("*** _on_unit_state start");
    for (auto& entity: _state["entities"])
    {
        if (entity["x"] == x && entity["y"] == y) 
        {
            entity = updated_entity;
        }
    }
    DEBUG("*** _on_unit_state end");
}

void GameState::_on_unit_action(const json& action_packet)
{
    DEBUG("*** _on_unit_action start");
    std::string unit_id = action_packet["unit_id"];
    json unit = _state["unit_state"][unit_id];
    json coordinates = unit["coordinates"];
    std::string action_type = action_packet["type"];
    if (action_type == "move")
    {
        std::string move = action_packet["move"];
        if (move == "up" || move == "down" || move == "left" || move == "right") 
        {
            json new_coordinates = _get_new_unit_coordinates(coordinates, move);
            _state["unit_state"][unit_id]["coordinates"] = new_coordinates;
        }
    }
    else if (action_type == "bomb")
    {
        // no - op since this is redundant info
    }
    else if (action_type == "detonate")
    {
        // no - op since this is redundant info
    }
    else 
    {
        std::cerr << "Unhandled agent action recieved: {" << action_type << std::endl;
    }
    DEBUG("*** _on_unit_action end");
}

json GameState::_get_new_unit_coordinates(const json& coordinates, const json move_action)
{
    DEBUG("*** _get_new_unit_coordinates start");
    json res = coordinates;
    if (move_action == "up")
    {
        res[1] = int(res[1]) + 1;
    }
    else if (move_action == "down")
    {
        res[1] = int(res[1]) - 1;
    }
    else if (move_action == "right")
    {
        res[0] = int(res[0]) + 1;
    }
    else if (move_action == "left")
    {
        res[0] = int(res[0]) - 1;
    }
    DEBUG("*** _get_new_unit_coordinates end");
    return res;
}
