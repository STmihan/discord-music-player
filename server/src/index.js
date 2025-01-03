import dotenv from "dotenv";
import {startWebSocketServer, wss} from "./servers/ws-server.js";
import {startHttpServer} from "./servers/http-server.js";

dotenv.config({path: "../.env"});

const port = process.env.NODE_ENV === 'production' ? process.env.PORT : 3001;
const app = startHttpServer();
startWebSocketServer();

const server = app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
    console.log(`WebSocket server listening at ws://localhost:${port}/ws`);
});

server.on('upgrade', (request, socket, head) => {
    console.log('Upgrading to WebSocket connection');
    if (request.url === '/ws') { // Ensure the correct WebSocket path
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});
