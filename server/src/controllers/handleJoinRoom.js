import {Room, rooms, User} from "../models/models.js";
import {wss_clients} from "../servers/ws-server.js";
import {broadcastRoomUpdate} from "../utils/utils.js";

export function handleJoinRoom(ws, { instance_id, user_id, username }) {
    if (!rooms[instance_id]) {
        rooms[instance_id] = new Room(instance_id);
    }
    if (!wss_clients[instance_id]) {
        wss_clients[instance_id] = [];
    }
    const user = new User(user_id, username);
    rooms[instance_id].users.push(user);
    wss_clients[instance_id].push(ws);
    broadcastRoomUpdate(ws, instance_id);
}

