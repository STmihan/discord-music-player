import {broadcastRoomUpdate} from "../utils/utils.js";
import {rooms} from "../models/models.js";

export function handlePreviousSong(ws, {instance_id}) {
    const room = rooms[instance_id];
    if (!room) return;

    room.currentPosition = 0;
    const currentTrackIndex = room.playlist.findIndex((track) => track.id === room.currentTrack.id);
    room.currentTrack = room.playlist[currentTrackIndex - 1] || room.playlist[currentTrackIndex];
    room.isPlaying = true;
    broadcastRoomUpdate(ws, instance_id);
}
