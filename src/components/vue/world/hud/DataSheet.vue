<script setup lang="ts">
/**
 * DataSheet.vue — Right-side data sheet (port of prototype `.cardR` +
 * `renderAsideBlocks`). Renders the active station's aside blocks for the
 * current language. Hidden < 1180px via world.css.
 */
import { inject, computed } from 'vue';
import { WORLD_STORE_KEY } from '../state/world-store';

const store = inject(WORLD_STORE_KEY)!;
const aside = computed(() => store.aside());
const show = computed(() => !!aside.value && !!store.state.activeId);
</script>

<template>
  <aside class="card cardR" :class="{ show }" aria-live="polite">
    <template v-if="aside">
      <div class="aside-h"><span class="cdot"></span>{{ aside.heading }}</div>
      <div v-for="(b, i) in aside.blocks" :key="i" class="asec">
        <div class="asec-t">{{ b.title }}</div>

        <div v-if="b.kind === 'timeline'" class="timeline">
          <div v-for="(it, j) in b.items" :key="j" class="tlrow">
            <span class="tldot"></span>
            <div>
              <div class="tlh">{{ it.h }}</div>
              <div class="tls">{{ it.s }}</div>
            </div>
          </div>
        </div>

        <template v-else-if="b.kind === 'rows'">
          <div v-for="(it, j) in b.items" :key="j" class="drow">
            <span>{{ it.k }}</span><b>{{ it.v }}</b>
          </div>
        </template>

        <template v-else-if="b.kind === 'list'">
          <div v-for="(it, j) in b.items" :key="j" class="lrow">
            <div class="lrh">{{ it.h }}</div>
            <div class="lrs">{{ it.s }}</div>
          </div>
        </template>

        <div v-else-if="b.kind === 'tags'" class="atags">
          <span v-for="(x, j) in b.items" :key="j">{{ x }}</span>
        </div>
      </div>
    </template>
  </aside>
</template>
