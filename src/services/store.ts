import WebSocketAPI from "./api.ts";
import {reactive} from "vue";
import {Room} from "../models/models.ts";

export interface Store {
    api: WebSocketAPI | undefined;
    setAPI(api: WebSocketAPI): void;
    
    room: Room | undefined;
    setRoom(room: Room): void;
}

export const store: Store = reactive({
    api: undefined,
    setAPI(api: WebSocketAPI) {
        store.api = api;
    },
    room: undefined,
    setRoom(room: Room) {
        store.room = room;
    }
})