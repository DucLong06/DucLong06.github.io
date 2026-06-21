<script setup lang="ts">
/**
 * QuantumWorld.vue — Host that composes the Three.js scene + the DOM HUD.
 *
 * Owns the single reactive store (provided to all HUD children), boots the
 * imperative scene on mount via `useQuantumWorld`, and disposes it on unmount
 * (clean WebGL teardown + HMR-safe). The HUD is plain Vue SFCs layered over the
 * fixed canvas; the scene talks to the HUD only through the store.
 */
import { ref, provide, computed, onMounted, onUnmounted } from 'vue';
import type { WorldData } from '../../../lib/scene/world-data-types';
import { createWorldStore, WORLD_STORE_KEY } from './state/world-store';
import { setSceneMode } from './use-scene-capability';
import { useQuantumWorld, type WorldController } from './scene/use-quantum-world';

import BrandMark from './hud/BrandMark.vue';
import NavPills from './hud/NavPills.vue';
import LangToggle from './hud/LangToggle.vue';
import TourControl from './hud/TourControl.vue';
import InfoCard from './hud/InfoCard.vue';
import DataSheet from './hud/DataSheet.vue';
import BootSplash from './hud/BootSplash.vue';
import SceneHint from './hud/SceneHint.vue';

import './charts/charts.css';

const props = defineProps<{ data: WorldData }>();

const store = createWorldStore(props.data);
provide(WORLD_STORE_KEY, store);

const chrome = computed(() => store.data.chrome[store.state.lang]);

const canvas = ref<HTMLCanvasElement | null>(null);
let controller: WorldController | null = null;

onMounted(() => {
  if (!canvas.value) return;
  // Apply persisted lang to <html> for a11y before the scene starts.
  store.setLang(store.state.lang);
  controller = useQuantumWorld(canvas.value, store);
  controller.start();
});

onUnmounted(() => {
  controller?.dispose();
  controller = null;
});

const goClassic = () => setSceneMode('2d');
</script>

<template>
  <canvas ref="canvas" class="world-canvas" aria-hidden="true"></canvas>
  <div class="vignette" aria-hidden="true"></div>

  <BrandMark />
  <NavPills />

  <div class="topright">
    <LangToggle />
    <button class="classic" type="button" @click="goClassic">
      <span>{{ chrome.classic }}</span>
    </button>
  </div>

  <InfoCard />
  <DataSheet />
  <TourControl />
  <SceneHint />
  <BootSplash />
</template>
