import {WebSocketServer} from "ws";
import {handleJoinRoom} from "../controllers/handleJoinRoom.js";
import {handleLeaveRoom} from "../controllers/handleLeaveRoom.js";
import {handlePauseSong} from "../controllers/handlePauseSong.js";
import {handleResumeSong} from "../controllers/handleResumeSong.js";
import {handleAddToPlaylist} from "../controllers/handleAddToPlaylist.js";
import {handleRemoveFromPlaylist} from "../controllers/handleRemoveFromPlaylist.js";
import {handleNextSong} from "../controllers/handleNextSong.js";
import {handlePreviousSong} from "../controllers/handlePreviousSong.js";
import {runUpdater} from "../services/roomUpdater.js";

export const wss = new WebSocketServer({noServer: true});
export const wss_clients = {};

const handlers = {
    'join_room': handleJoinRoom,
    'leave_room': handleLeaveRoom,
    'pause_song': handlePauseSong,
    'resume_song': handleResumeSong,
    'add_to_playlist': handleAddToPlaylist,
    'remove_from_playlist': handleRemoveFromPlaylist,
    'next_song': handleNextSong,
    'prev_song': handlePreviousSong,
}

export function startWebSocketServer() {
    console.log('Starting WebSocket server');
    wss.on('connection', (ws) => {
        console.log('Client connected');

        ws.on('message', (message) => {
            const data = JSON.parse(message);
            const {type, payload} = data;
            console.log(type, JSON.stringify(payload));

            if (!handlers[type]) {
                ws.send(JSON.stringify({error: 'Unknown message type'}));
                return;
            }

            handlers[type](ws, payload);
        });

        ws.on('close', () => {
            console.log('Client disconnected');
        });
    })
    runUpdater();
}
