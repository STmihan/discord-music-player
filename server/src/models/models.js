export const rooms = {}

export class Room {
    constructor(instance_id) {
        this.instance_id = instance_id;
        this.users = [];
        this.playlist = [];
        this.currentTrack = null;
        this.startedAt = null;
        this.lastUpdate = null;
        this.currentPosition = 0;
        this.isPlaying = false;
    }
}

export class Track {
    constructor(hash, name, url, duration) {
        this.id = hash + Date.now();
        this.name = name;
        this.url = url;
        this.duration = duration;
    }
}

export class User {
    constructor(userId, username) {
        this.useId = userId;
        this.username = username;
    }
}
