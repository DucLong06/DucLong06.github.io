<script setup lang="ts">
/** NavPills.vue — Centered station rail (port of prototype `.pills`). */
import { inject } from 'vue';
import { WORLD_STORE_KEY } from '../state/world-store';

const store = inject(WORLD_STORE_KEY)!;
</script>

<template>
  <nav class="pills" aria-label="Stations">
    <button
      v-for="p in store.state.pills"
      :key="p.id"
      class="pill"
      :class="{ active: store.state.activeId === p.id }"
      @click="store.goToId(p.id)"
    >
      <span class="pdot" aria-hidden="true"></span>{{ p.label }}
    </button>
  </nav>
</template>
