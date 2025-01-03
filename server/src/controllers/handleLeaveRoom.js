import {rooms} from "../models/models.js";
import {wss_clients} from "../servers/ws-server.js";
import {broadcastRoomUpdate} from "../utils/utils.js";

export function handleLeaveRoom(ws, {instance_id, user_id}) {
    const room = rooms[instance_id];
    if (!room) return;

    room.users = room.users.filter((user) => user.user_id !== user_id);
    wss_clients[instance_id] = wss_clients[instance_id].filter((client) => client !== ws);
    broadcastRoomUpdate(ws, instance_id);
}