import {rooms} from "../models/models.js";
import {broadcastRoomUpdate, broadcastToRoom} from "../utils/utils.js";

export function handleResumeSong(ws, {instance_id}) {
    const room = rooms[instance_id];
    if (!room) return;

    room.isPlaying = true;
    if (room.currentPosition === 0) {
        room.startedAt = Date.now();
    }
    room.lastUpdate = Date.now();
    room.currentPosition = room.currentPosition + (Date.now() - room.lastUpdate) / 1000;
    broadcastRoomUpdate(ws, instance_id);
}
