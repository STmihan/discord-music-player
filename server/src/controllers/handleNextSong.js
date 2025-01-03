import {broadcastRoomUpdate} from "../utils/utils.js";
import {rooms} from "../models/models.js";

export function handleNextSong(ws, {instance_id}) {
    const room = rooms[instance_id];
    if (!room) return;

    room.currentPosition = 0;
    const currentTrackIndex = room.playlist.findIndex((track) => track.id === room.currentTrack.id);
    room.currentTrack = currentTrackIndex === room.playlist.length - 1 ? room.playlist[0] : room.playlist[currentTrackIndex + 1];
    room.isPlaying = true;
    room.startedAt = Date.now();
    room.lastUpdate = Date.now();
    broadcastRoomUpdate(ws, instance_id);
}