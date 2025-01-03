<template>
  <div class="overlay" v-if="isOpen" @click="onBackgroundClick">
    <div class="popup" @click.stop>
      <button class="close-button" @click="closePopup">✕</button>
      <h2>Add a new song</h2>
      <input
          type="text"
          v-model="newSong"
          @keyup.enter="addNewSong"
          placeholder="Enter song name"
          ref="inputRef"
      />
      <button class="add-button" @click="addNewSong">Add song</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, onBeforeUnmount, watch} from "vue";

const {isOpen} = defineProps<{
  isOpen: boolean;
}>();
const emit = defineEmits<{
  (e: "close"): void;
  (e: "add", songName: string): void;
}>();

const newSong = ref("");
const inputRef = ref<HTMLInputElement | null>(null);

const closePopup = () => {
  emit("close");
};

const onBackgroundClick = () => {
  closePopup();
};

const addNewSong = () => {
  if (newSong.value.trim()) {
    emit("add", newSong.value.trim());
    newSong.value = "";
    closePopup();
  }
};

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && isOpen) {
    closePopup();
  }
};

watch(
    () => isOpen,
    (newVal) => {
      if (newVal && inputRef.value) {
        setTimeout(() => {
          inputRef.value?.focus();
        }, 0);
      }
    }
);

onMounted(() => {
  window.addEventListener("keydown", onKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeyDown);
});
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.popup {
  background: #272727;
  padding: 2rem;
  border-radius: 1.5rem;
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
  text-align: center;
  color: #fff;
}

.popup h2 {
  font-size: 1.5rem;
  margin: 0;
}

input {
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
}

input::placeholder {
  color: #bbb;
}

.add-button {
  padding: 0.75rem 1.5rem;
  background-color: #fff;
  color: #272727;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-button:hover {
  background-color: #e0e0e0;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
}

.close-button:hover {
  color: #ff4d4d;
}
</style>
