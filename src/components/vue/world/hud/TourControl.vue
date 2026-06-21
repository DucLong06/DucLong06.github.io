<script setup lang="ts">
/** TourControl.vue — prev / play-pause / next (port of prototype `.tour`). */
import { inject, computed } from 'vue';
import { WORLD_STORE_KEY } from '../state/world-store';

const store = inject(WORLD_STORE_KEY)!;
const chrome = computed(() => store.data.chrome[store.state.lang]);
</script>

<template>
  <div class="tour" role="group" aria-label="Tour controls">
    <button class="tnav" aria-label="Previous" @click="store.prev()">‹</button>
    <button
      class="tourbtn"
      :class="{ touring: store.state.touring }"
      @click="store.toggleTour()"
    >
      <span class="tour-icon" aria-hidden="true">{{ store.state.touring ? '⏸' : '▶' }}</span>
      <span class="tdot" aria-hidden="true"></span>
      <span>{{ store.state.touring ? chrome.touring : chrome.paused }}</span>
    </button>
    <button class="tnav" aria-label="Next" @click="store.next()">›</button>
  </div>
</template>
