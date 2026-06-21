<script setup lang="ts">
/**
 * QuantumWorldIsland.vue — Top-level orchestrator for the Quantum World island.
 *
 * Mounted as a `client:only="vue"` Astro island. Intentionally light: it decides
 * device capability, lazy-loads the heavy Three.js host only when enabled, and
 * toggles `html.scene-3d-active` so the SSR'd 2D site (#classic-site) is hidden
 * while the 3D world runs. On 'fallback'/'pending' it renders nothing and the
 * server-rendered 2D site remains the experience (SEO + a11y + no-JS safe).
 */
import { computed, watchEffect, defineAsyncComponent } from 'vue';
import type { WorldData } from '../../../lib/scene/world-data-types';
import { useSceneCapability } from './use-scene-capability';

// Self-host fonts (no Google CDN). Space Grotesk = display, JetBrains Mono = data.
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource-variable/jetbrains-mono';
import './world.css';

const props = defineProps<{ data: WorldData }>();

const { capability } = useSceneCapability();
const active = computed(() => capability.value === 'enabled');

// Heavy host (scene + HUD) is split out of the initial island chunk.
const QuantumWorld = defineAsyncComponent(() => import('./QuantumWorld.vue'));

// Hide / reveal the 2D site by toggling a root class the global CSS reacts to.
watchEffect((onCleanup) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.toggle('scene-3d-active', active.value);
  onCleanup(() => root.classList.remove('scene-3d-active'));
});
</script>

<template>
  <div v-if="active" class="quantum-world-root" :aria-label="props.data.stations.length + ' stations'">
    <QuantumWorld :data="props.data" />
  </div>
</template>
