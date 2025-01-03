export interface Room {
    users: User[];
    playlist: Track[];
    currentTrack: Track;
    startedAt: number;
    lastUpdate: number;
    currentPosition: number;
    isPlaying: boolean;
}

export interface Track {
    id: string;
    name: string;
    url: string;
    duration: number;
}

export interface User {
    userId: string;
    username: string;
}
