<template>
  <div class="block" :class="{ collapsed: isCollapsed }">
    <div class="header">
      <button class="collapse-toggle" @click="toggleCollapse">
        <img src="../assets/expand.svg" alt="expand"/>
      </button>
      <h2>
        {{ song ? song.name : "No song selected" }}
      </h2>
    </div>
    <div class="content" v-if="song">
      <div class="timeline-block">
        <div class="timeline">
          <div class="progress" :style="{ width: progress + '%' }"></div>
        </div>
      </div>
      <div class="bottom-block">
        <button class="back-button" @click="prevTrack">
          <img src="../assets/play-forward.svg" alt="back"/>
        </button>
        <button class="play-button" @click="togglePlay">
          <img
              class="play-button-img"
              src="../assets/play.svg"
              alt="play"
              :style="{ display: isPlaying ? 'none' : 'block' }"
          />
          <img
              src="../assets/pause.svg"
              alt="play"
              ref="pauseImgRef"
              :style="{ display: isPlaying ? 'block' : 'none' }"
          />
        </button>
        <button class="forward-button" @click="nextTrack">
          <img src="../assets/play-forward.svg" alt="forward"/>
        </button>
      </div>
    </div>
    <div class="volume-slider" v-if="song">
      <img src="../assets/volume.svg" alt="volume" class="volume-icon"/>
      <input
          type="range"
          min="0"
          max="100"
          v-model="volume"
          @input="adjustVolume"
          class="slider"
      />
    </div>
  </div>

</template>


<script setup lang="ts">

import {onMounted, ref} from "vue";
import {Track} from "../models/models.ts";

const {song, isPlaying, onVolumeChange} = defineProps<{
  isPlaying: boolean;
  song: Track | null;
  progress: number;
  onVolumeChange: (volume: number) => void;
}>();
const emit = defineEmits<{
  (e: "play"): void;
  (e: "pause"): void;
  (e: "next"): void;
  (e: "prev"): void;
}>();

const isCollapsed = ref(false);
const volume = ref(parseInt(localStorage.getItem("volume") || "50"));

const togglePlay = () => {
  if (isPlaying) {
    emit("pause");
  } else {
    emit("play");
  }
};

const nextTrack = () => {
  emit("next");
};

const prevTrack = () => {
  emit("prev");
};

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

const adjustVolume = () => {
  localStorage.setItem("volume", volume.value.toString());
  onVolumeChange(volume.value);
};

onMounted(() => {
  adjustVolume();
});

</script>

<style scoped>
.volume-slider {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  opacity: 1;
  transition: opacity 0.3s;
  padding: 1rem;
}

.collapsed .volume-slider  {
  opacity: 0;
}

.slider {
  -webkit-appearance: none;
  appearance: none;
  width: 150px;
  height: 8px;
  background: #444;
  border-radius: 5px;
  outline: none;
  transition: opacity 0.2s;
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
}

.volume-icon {
  margin-top: 0.5rem;
  margin-right: 1rem;
  margin-left: 0.5rem;
  width: 32px;
  height: 32px;
}


button {
  border: none;
  background-color: transparent;
  cursor: pointer;
}

.block {
  width: 500px;
  border-radius: 2rem;
  background-color: #272727;
  padding: 1rem;
  position: fixed;
  left: 50%;
  bottom: 25%;
  transform: translateX(-50%);
  max-height: 1000px;
  transition: max-height 0.3s ease, bottom 0.3s ease;
}

.block.collapsed {
  max-height: 90px;
  bottom: 0.3rem;
}

.content {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: auto;
  max-height: 1000px;
  opacity: 1;
  transition: max-height 0.3s ease, opacity 0.3s ease;
}

.collapsed .content {
  max-height: 0;
  opacity: 0;
}

.header {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  color: #fff;
  padding: 1rem;
  text-align: center;
}

.collapsed .header > h2 {
  max-height: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.timeline-block {
  color: #fff;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
}

.timeline-block h2 {
  width: 80%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.timeline {
  position: relative;
  height: 10px;
  width: 100%;
  background-color: #444;
  border-radius: 5px;
  overflow: hidden;
  margin-top: 1rem;
}

.progress {
  position: absolute;
  height: 100%;
  background-color: #fff;
  transition: width 0.3s ease;
}

.bottom-block {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 2rem 2rem 2rem;
  opacity: 1;
}

.back-button img {
  width: 64px;
  height: 64px;
  transform: rotate(180deg);
}

.forward-button img {
  width: 64px;
  height: 64px;
}

.play-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #fff;
  margin-right: 3rem;
  margin-left: 3rem;
}

.play-button-img {
  transform: translateX(6px);
}

.play-button img {
  width: 64px;
  height: 64px;
}

.collapse-toggle {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.collapse-toggle img {
  width: 32px;
  height: 32px;
}

@media (max-width: 1200px) {
  .block {
    transform: translateX(0);
    right: 1rem;
    left: auto;
    bottom: 2rem;
  }
}

@media (max-width: 880px) {
  .block {
    width: 90%;
    bottom: 10%;
    left: auto;
    right: auto;
  }

  .back-button img,
  .forward-button img {
    width: 50px;
    height: 50px;
  }

  .play-button {
    width: 60px;
    height: 60px;
    margin-right: 1rem;
    margin-left: 1rem;
  }

  .play-button img {
    width: 32px;
    height: 32px;
  }
}
</style>


