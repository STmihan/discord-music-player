import {createApp} from 'vue'
import './style.css'
import App from './app.vue'
import {setupDiscordSDK} from "./services/discord.ts";
import WebSocketAPI from "./services/api.ts";
import {store} from "./services/store.ts";


async function setup() {
    try {
        const {discordSDK, auth} = await setupDiscordSDK();
        console.log('Discord SDK is ready');
        const serverUrl = `wss://${window.location.hostname}/.proxy/ws`;
        console.log('Connecting to WebSocket server:', serverUrl);
        store.setAPI(new WebSocketAPI(serverUrl, discordSDK.instanceId, auth.user.id, auth.user.username));
    } catch (e) {
        console.error('Failed to setup Discord SDK:', e);
        const serverUrl = `wss://${window.location.hostname}/ws`;
        store.setAPI(new WebSocketAPI(serverUrl, "123", "123", "stmihan", true));
    }
}

setup();
createApp(App).mount('#app')
