<template>
  <div class="menu" :class="{ open: isOpen }">
    <ul class="song-list">
      <li v-for="(song, index) in songs" :key="index" class="song-item">
        <h3>{{ song.name }}</h3>
        <button class="delete-button" @click="$emit('remove', song)">✖</button>
      </li>
    </ul>
    <button class="add-button" @click="$emit('add')">Add Song</button>
  </div>
</template>


<script setup lang="ts">
import {Track} from "../models/models.ts";

const {songs, isOpen} = defineProps<{
  isOpen: boolean;
  songs: Track[];
}>();

defineEmits(['close', 'add', 'remove']);
</script>

<style scoped>
.menu {
  position: fixed;
  top: 10%;
  left: -300px;
  width: 300px;
  height: 80%;
  background-color: #272727;
  color: #fff;
  overflow: hidden;
  transition: left 0.3s ease;
  border-radius: 0 2rem 2rem 0;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.menu.open {
  left: 0;
}

.song-list {
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
  opacity: 0;
  overflow-y: auto;
  transition: opacity 0.3s ease;
}

.open .song-list {
  opacity: 1;
}

.song-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1rem;
  border-bottom: 1px solid #444;
}

.song-item h3 {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.delete-button {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 1.2rem;
}

.add-button {
  width: calc(100% - 2rem);
  margin: 1rem;
  padding: 0.5rem;
  border: none;
  border-radius: 5px;
  background-color: #fff;
  color: #272727;
  font-size: 1rem;
  cursor: pointer;
  align-self: center;
}

@media (max-width: 880px) {
  .menu {
    width: 100%;
    height: 90%;
    border-radius: 0;
    left: -100%;
    padding: 0;
  }

  .menu.open {
    left: 0;
  }
}
</style>

