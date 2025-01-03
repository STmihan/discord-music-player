import {rooms} from "../models/models.js";
import {handleNextSong} from "../controllers/handleNextSong.js";

export function runUpdater() {
    setInterval(() => {
        for (const roomsKey in rooms) {
            updateRooms(roomsKey);
        }
    }, 1000);
}

function updateRooms(instance_id) {
    const room = rooms[instance_id];
    if (!room) return;

    if (!room.isPlaying) {
        return;
    }

    const trackShouldChange = room.currentPosition + (Date.now() - room.lastUpdate) / 1000 >= room.currentTrack.duration + 1;
    if (trackShouldChange) {
        handleNextSong(null, {instance_id});
    }
}
