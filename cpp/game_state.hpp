//***************************************************************************************************************
//  
//  Author:  J.F.Bogusz
//  Version: 0.1.1
//  Link:    https://github.com/jfbogusz/bomberland/tree/master/C++
//
//***************************************************************************************************************

#ifndef _GAME_STATE_HCC
#define _GAME_STATE_HCC

#include "easywsclient/easywsclient.hpp"
#include "nlohmann/json.hpp"

using easywsclient::WebSocket;
using nlohmann::json;

// #define _TEST_
#ifdef _TEST_
#define TEST(x, y) {std::cout << "TEST |" << x << "|" << y << "|" << std::endl;}
#else
#define TEST(x, y) {}
#endif /* _TEST_ */

// #define _DEBUG_
#ifdef _DEBUG_
#define DEBUG(x) {std::cerr << (x) << std::endl;}
#define DEBUG2(x, y) {std::cerr << (x) << ": " << (y) << std::endl;}
#else
#define DEBUG(x) {}
#define DEBUG2(x, y) {}
#endif /* _DEBUG_ */

class GameState 
{
    private:
        static std::string _connection_string;
        
        static WebSocket::pointer connection;

        static void (*_tick_callback)(const int, const json&);

        static json _state;

    public:

        static void set_game_tick_callback(void (*generate_agent_action_callback)(const int, const json&));

        static WebSocket::pointer connect(const std::string& connection_string);

        static void send_move(const std::string& move, const std::string& unit_id);

        static void send_bomb(const std::string& unit_id);

        static void send_detonate(int x, int y, const std::string& unit_id);

        static void handle_messages();
    
     private:

        static void _send(const json& pocket);

        static void _on_data(const json& data);

        static void _on_game_state(const json& game_state);

        static void _on_game_tick(const json& game_tick);

        static void _on_entity_spawned(const json& spawn_event);

        static void _on_entity_expired(const json& expire_event);

        static void _on_unit_state(const json& unit_state);

        static void _on_entity_state(int x, int y, const json& updated_entity);

        static void _on_unit_action(const json& action_packet);

        static json _get_new_unit_coordinates(const json& coordinates, const json move_action);

        static void _handle_message(const std::string& message);    
};

#endif /* _GAME_STATE_HCC */