export default class WebSocketAPI {
    private socket: WebSocket;
    private eventHandlers: { [type: string]: ((payload: any) => void)[] } = {};
    private readonly instance_id: string;
    private readonly user_id: string;
    private readonly username: string;
    readonly isDev: boolean;

    constructor(serverUrl: string, instance_id: string, user_id: string, username: string, isDev: boolean = false) {
        this.socket = new WebSocket(serverUrl);
        this.instance_id = instance_id;
        this.user_id = user_id;
        this.username = username;
        this.isDev = isDev;

        this.socket.onopen = () => {
            console.log('WebSocket connection established');
            this.joinRoom();
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const { type, payload } = data;
            console.log("RECV\n", JSON.stringify(type));

            if (this.eventHandlers[type]) {
                this.eventHandlers[type].forEach((handler) => handler(payload));
            }
        };

        this.socket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    private sendMessage(type: string, payload: any) {
        if (this.socket.readyState === WebSocket.OPEN) {
            console.log("SEND\n", JSON.stringify({ type }))
            this.socket.send(JSON.stringify({ type, payload }));
        } else {
            console.error('WebSocket is not open');
        }
    }

    private joinRoom() {
        this.sendMessage('join_room', {
            instance_id: this.instance_id,
            user_id: this.user_id,
            username: this.username,
        });
    }

    pauseSong() {
        this.sendMessage('pause_song', { instance_id: this.instance_id });
    }

    resumeSong() {
        this.sendMessage('resume_song', { instance_id: this.instance_id });
    }

    addToPlaylist(track_url: string) {
        this.sendMessage('add_to_playlist', {
            instance_id: this.instance_id,
            track_url,
        });
    }

    removeFromPlaylist(track_id: string) {
        this.sendMessage('remove_from_playlist', { instance_id: this.instance_id, track_id });
    }
    
    prevSong() {
        this.sendMessage('prev_song', { instance_id: this.instance_id });
    }
    
    nextSong() {
        this.sendMessage('next_song', { instance_id: this.instance_id });
    }

    on(eventType: string, handler: (payload: any) => void) {
        if (!this.eventHandlers[eventType]) {
            this.eventHandlers[eventType] = [];
        }
        this.eventHandlers[eventType].push(handler);
    }
}
