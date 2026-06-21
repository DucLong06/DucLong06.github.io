<script setup lang="ts">
/** LangToggle.vue — EN/VI switch (port of prototype `.lang`). Persists via store. */
import { inject } from 'vue';
import { WORLD_STORE_KEY } from '../state/world-store';

const store = inject(WORLD_STORE_KEY)!;
</script>

<template>
  <div class="lang" role="group" aria-label="Language">
    <button :class="{ on: store.state.lang === 'en' }" @click="store.setLang('en')">EN</button>
    <button :class="{ on: store.state.lang === 'vi' }" @click="store.setLang('vi')">VI</button>
  </div>
</template>
