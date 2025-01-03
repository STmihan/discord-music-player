import crypto from "node:crypto";
import fs from "node:fs";
import {ytUrlRemoveListParams} from "../utils/utils.js";
import youtubedl from "youtube-dl-exec";
import SpottyDL from 'spottydl'
import {Track} from "../models/models.js";

const audioHandlers = {
    'youtube': downloadYoutube,
    'spotify': downloadSpotify,
}

const metadataHandlers = {
    'youtube': downloadYoutubeMetadata,
    'spotify': downloadSpotifyMetadata,
}

function getTrackType(url) {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        return 'youtube';
    }
    if (url.includes('spotify.com')) {
        return 'spotify';
    }
    return null;
}

export async function downloadTrack(url) {
    if (!url) {
        return null;
    }

    try {
        console.log(`Downloading track from ${url}`);
        const type = getTrackType(url);
        const hash = crypto
            .createHash('sha256')
            .update(url)
            .digest('hex');
        const fileName = `./data/${hash}.mp3`;

        if (fs.existsSync(fileName)) {
            console.log(`Track already exists at ${fileName}`);
            const {duration, title} = await downloadMetadata(url, type);
            const newUrl = fileName.replace('./data/', '/.proxy/static/');
            return new Track(hash, title, newUrl, duration);
        } else {
            console.log(`Downloading track to ${fileName}`);
            await downloadAudioFile(url, fileName, type);
            const {duration, title} = await downloadMetadata(url, type);
            const newUrl = fileName.replace('./data/', '/.proxy/static/');
            console.log(`Track downloaded to ${fileName}`);
            return new Track(hash, title, newUrl, duration);
        }
    } catch (error) {
        console.error('Failed to download track', error);
        return null;
    }
}

async function downloadAudioFile(url, filename, type) {
    const handler = audioHandlers[type];
    if (!handler) {
        return null;
    }

    return handler(url, filename);
}

async function downloadMetadata(url, type) {
    const handler = metadataHandlers[type];
    if (!handler) {
        return null;
    }

    return handler(url);
}

async function downloadYoutube(url, fileName) {
    const inPlaylist = url.includes('list=');
    if (inPlaylist) {
        url = ytUrlRemoveListParams(url);
    }
    await youtubedl(url, {
        output: fileName,
        format: 'bestaudio/best',
        extractAudio: true,
        audioFormat: 'mp3',
    });
}

async function downloadYoutubeMetadata(url) {
    const inPlaylist = url.includes('list=');
    if (inPlaylist) {
        url = ytUrlRemoveListParams(url);
    }
    const {duration, title} = await youtubedl(url, {
        dumpJson: true,
    });

    return {duration, title};
}

async function downloadSpotify(url, fileName) {
    const track = await SpottyDL.getTrack(url)
    console.log('Spotify track:', track)
    if (track.id) {
        console.log(`Downloading track from ${track.id}`);
        const ytUrl = "https://music.youtube.com/watch?v=" + track.id;
        console.log(`Downloading track to ${fileName}`);
        await youtubedl(ytUrl, {
            output: fileName,
            format: 'bestaudio/best',
            extractAudio: true,
            audioFormat: 'mp3',
        });
    } else {
        throw new Error('Failed to get track: ' + track)
    }
}

async function downloadSpotifyMetadata(url) {
    const track = await SpottyDL.getTrack(url)
    console.log('Spotify track:', track)
    if (track.id) {
        const ytUrl = "https://music.youtube.com/watch?v=" + track.id;
        const {duration} = await youtubedl(ytUrl, {
            dumpJson: true,
        })
        const title = `${track.artist} - ${track.title}`
        return {duration, title};
    } else {
        throw new Error('Failed to get track')
    }
}
