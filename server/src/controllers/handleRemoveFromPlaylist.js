import {rooms} from "../models/models.js";
import {broadcastRoomUpdate, broadcastToRoom} from "../utils/utils.js";

export function handleRemoveFromPlaylist(ws, {instance_id, track_id}) {
    const room = rooms[instance_id];
    if (!room) return;

    room.playlist = room.playlist.filter((track) => track.id !== track_id);
    if (room.currentTrack.id === track_id) {
        room.currentTrack = room.playlist[0] || null;
        room.currentPosition = 0;
    }
    broadcastRoomUpdate(ws, instance_id);
}