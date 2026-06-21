<script setup lang="ts">
/** SceneHint.vue — Bottom interaction hint (port of prototype `.hint`). */
import { inject, computed } from 'vue';
import { WORLD_STORE_KEY } from '../state/world-store';

const store = inject(WORLD_STORE_KEY)!;
const hint = computed(() => store.data.chrome[store.state.lang].hint);
</script>

<template>
  <div class="hint">{{ hint }}</div>
</template>
