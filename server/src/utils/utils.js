import {wss_clients} from "../servers/ws-server.js";
import {rooms} from "../models/models.js";

export function broadcastToRoom(wss, instance_id, message) {
    console.log(`Broadcasting to room ${instance_id}`);
    wss_clients[instance_id].forEach((client) => {
        client.send(JSON.stringify(message));
    });
}

export function broadcastRoomUpdate(wss, instance_id) {
    console.log(`Broadcasting room update for room ${instance_id}`);
    const message = {type: 'room_update', payload: rooms[instance_id]};
    wss_clients[instance_id].forEach((client) => {
        client.send(JSON.stringify(message));
    });
}

export function ytUrlRemoveListParams(url) {
    // remove list= parameter from youtube url
    const urlObj = new URL(url);
    urlObj.searchParams.delete('list');
    return urlObj.toString();
}
