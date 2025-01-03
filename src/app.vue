<template>
  <div class="page">
    <div class="background">
    </div>
    <div class="content">
      <MusicPlayer
          :song="store.room?.currentTrack || null"
          :isPlaying="store.room?.isPlaying || false"
          :progress="progress"
          :onVolumeChange="onVolumeChange"
          @pause="pause"
          @play="play"
          @next="next"
          @prev="prev"
      />
      <button class="menu-toggle" @click="toggleMenu">☰</button>
      <PlaylistMenu
          :isOpen="isMenuOpen"
          :songs="store.room?.playlist || []"
          @close="toggleMenu"
          @remove="removeSong"
          @add="openPopup"
      />
      <AddSongPopup
          :isOpen="isPopupOpen"
          @close="closePopup"
          @add="addSong"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import MusicPlayer from "./components/MusicPlayer.vue";
import PlaylistMenu from "./components/PlaylistMenu.vue";
import AddSongPopup from "./components/AddSongPopup.vue";
import {store} from "./services/store.ts";
import {Track} from "./models/models.ts";

const trackCache = ref<Record<string, string>>({});

const isMenuOpen = ref(false);
const audio = ref(
    {
      audio: new Audio(),
      url: '',
      blobUrl: '',
    }
);
const progress = ref(0);


const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const removeSong = (song: Track) => {
  if (!song) {
    return;
  }
  store.api?.removeFromPlaylist(song.id);
};

const isPopupOpen = ref(false);
const openPopup = () => {
  isPopupOpen.value = true;
};
const closePopup = () => {
  isPopupOpen.value = false;
};

const addSong = (songUrl: string) => {
  store.api?.addToPlaylist(songUrl);
};

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key.toLowerCase() === 'n') {
    openPopup();
  }
};

const updateProgress = (currentAudio: HTMLAudioElement) => {
  progress.value = currentAudio.currentTime / currentAudio.duration * 100;
};

const onVolumeChange = (volume: number) => {
  audio.value.audio.volume = volume / 100;
};

const play = () => {
  store.api?.resumeSong();
};

const pause = () => {
  store.api?.pauseSong();
};

const next = () => {
  store.api?.nextSong();
};

const prev = () => {
  store.api?.prevSong();
};

async function preloadTrack(url: string): Promise<string> {
  if (trackCache.value[url]) {
    return trackCache.value[url];
  }
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    trackCache.value[url] = blobUrl;
    return blobUrl;
  } catch (e) {
    console.error("Failed to preload track:", url, e);
    return url;
  }
}

async function preloadNextTrack() {
  if (!store.room || !store.room.playlist || !store.room.currentTrack) return;

  const playlist = store.room.playlist;
  const currentUrl = store.room.currentTrack.url;

  const currentIndex = playlist.findIndex(t => t.url === currentUrl);
  if (currentIndex === -1) return;

  const nextIndex = currentIndex + 1;
  if (nextIndex < playlist.length) {
    const nextTrack = playlist[nextIndex];
    await preloadTrack(nextTrack.url);
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown);

  const intervalId = setInterval(() => {
    updateProgress(audio.value.audio);
  }, 1000);

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeyDown);
    clearInterval(intervalId);
  });
});

watch(() => store.api, (api) => {
  if (api) {
    registerEvents();
  }
});

function registerEvents() {
  store.api?.on('room_update', async (payload) => {
    if (!store.api) return;
    store.setRoom(payload);

    if (!store.room || !store.room.currentTrack) {
      audio.value.audio.pause();
      return;
    }

    if (store.api && store.api.isDev) {
      store.room.playlist.map((track) => {
        track.url = track.url.replace('.proxy/', '');
      })
      store.room.currentTrack.url = store.room.currentTrack.url.replace('.proxy/', '');
    }

    if (!audio.value.url || audio.value.url !== store.room.currentTrack.url) {
      audio.value.url = store.room.currentTrack.url;

      const blobUrl = trackCache.value[audio.value.url] || await preloadTrack(audio.value.url);
      console.log('blobUrl', blobUrl);
      audio.value.blobUrl = blobUrl;

      audio.value.audio.src = blobUrl;
      audio.value.audio.load();
    }

    if (store.room.isPlaying) {
      if (audio.value.audio.paused) {
        const currentTime = store.room.currentPosition + (Date.now() - store.room.lastUpdate) / 1000 || 0;
        audio.value.audio.currentTime = Math.max(currentTime, 0);
        audio.value.audio.play();
        updateProgress(audio.value.audio);
      }
    } else {
      const currentTime = store.room.currentPosition || 0;
      audio.value.audio.currentTime = Math.max(currentTime, 0);
      updateProgress(audio.value.audio);
      audio.value.audio.pause();
    }

    preloadNextTrack();
  });
}

</script>


<style scoped>
.page {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000;
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background-image: url("./assets/light-gray-anime-background.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.menu-toggle {
  background-color: #272727;
  padding: 1rem;
  position: absolute;
  top: 0;
  left: 0;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  border-radius: 0 0 25% 0;
  font-weight: bold;
}

.content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
}

@media (max-width: 300px) {
  .content {
    display: none;
  }
}
</style>
