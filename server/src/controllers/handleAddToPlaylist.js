import {rooms} from "../models/models.js";
import {broadcastRoomUpdate} from "../utils/utils.js";
import {downloadTrack} from "../services/trackDownloader.js";

export async function handleAddToPlaylist(ws, {instance_id, track_url}) {
    const room = rooms[instance_id];
    if (!room) return;

    const track = await downloadTrack(track_url);
    if (!track) return;
    room.playlist.push(track);
    if (!room.currentTrack) {
        room.currentTrack = track;
    }
    broadcastRoomUpdate(ws, instance_id);
}
