<script setup lang="ts">
/**
 * ChartMount.vue — Mounts an imperative chart renderer against a ref on mount
 * and tears it down on unmount. Keeps the SVG/DOM renderers (port of charts.js)
 * untouched while giving Vue lifecycle control over their rAF loops.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { RENDERERS, type ChartCleanup } from './renderers';
import { k8sTopo } from './k8s-topology';

const props = defineProps<{ type: string; data?: unknown }>();
const host = ref<HTMLDivElement | null>(null);
let cleanup: ChartCleanup = undefined;

onMounted(() => {
  if (!host.value) return;
  if (props.type === 'k8s') { k8sTopo(host.value); return; }
  const render = RENDERERS[props.type];
  if (render) cleanup = render(host.value, props.data);
});

onBeforeUnmount(() => {
  if (typeof cleanup === 'function') cleanup();
  if (host.value) host.value.innerHTML = '';
});
</script>

<template>
  <div ref="host" class="chart-mount"></div>
</template>
