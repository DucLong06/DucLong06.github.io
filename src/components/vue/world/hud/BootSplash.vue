<script setup lang="ts">
/**
 * BootSplash.vue — Full-screen ignite splash (port of prototype `.boot`).
 * Fades 0.8s starting ~0.5s after the scene reports `ready`, then unmounts.
 */
import { inject, computed, ref, watch } from 'vue';
import { WORLD_STORE_KEY } from '../state/world-store';

const store = inject(WORLD_STORE_KEY)!;
const igniting = computed(() => store.data.chrome[store.state.lang].igniting);

const hide = ref(false);
const gone = ref(false);

watch(
  () => store.state.ready,
  (ready) => {
    if (!ready) return;
    // Hold briefly so the ignite shockwaves are visible behind the splash.
    setTimeout(() => { hide.value = true; }, 500);
    setTimeout(() => { gone.value = true; }, 500 + 850);
  },
  { immediate: true },
);
</script>

<template>
  <div v-if="!gone" class="boot" :class="{ hide }" aria-hidden="true">
    <div class="bcore"></div>
    <div class="btxt">{{ igniting }}</div>
  </div>
</template>
