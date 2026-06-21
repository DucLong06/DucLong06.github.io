<script setup lang="ts">
/**
 * InfoCard.vue — Left info card (port of prototype `.card` + `renderCard`).
 *
 * Mirrors the prototype's 180ms "hide → swap → show" so the card fades out
 * before its content changes (avoids a flash of mixed-station content). Charts
 * mount imperatively via <ChartMount> against the freshly-rendered DOM.
 */
import { inject, ref, computed, watch, nextTick } from 'vue';
import { WORLD_STORE_KEY } from '../state/world-store';
import type { Lang } from '../../../../lib/scene/world-data-types';
import ChartMount from '../charts/ChartMount.vue';

const store = inject(WORLD_STORE_KEY)!;
const SWAP_MS = 180;

const show = ref(false);
const dispId = ref<string | null>(null);
const dispLang = ref<Lang>(store.state.lang);

const station = computed(() =>
  dispId.value ? store.data.stations.find((s) => s.id === dispId.value) ?? null : null);
const panel = computed(() => (station.value ? station.value.panel[dispLang.value] : null));
const charts = computed(() => (station.value ? station.value.charts[dispLang.value] : []));
const contact = store.data.contact;
const total = store.data.stations.length;
const num = computed(() => {
  const i = store.state.pills.findIndex((p) => p.id === dispId.value);
  return String(i + 1).padStart(2, '0');
});

// Hide → swap → show whenever the active station OR language changes.
watch(
  [() => store.state.activeId, () => store.state.lang],
  ([id]) => {
    show.value = false;
    if (!id) return; // depart: stay hidden, keep last content mounted
    window.setTimeout(() => {
      dispId.value = id as string;
      dispLang.value = store.state.lang;
      nextTick(() => { show.value = true; });
    }, SWAP_MS);
  },
  { immediate: true },
);
</script>

<template>
  <section class="card" :class="{ show }" aria-live="polite">
    <template v-if="panel">
      <div class="chead">
        <span class="ckick"><span class="cdot"></span>{{ panel.kicker }}</span>
        <span class="cnum">{{ num }}<i>/0{{ total }}</i></span>
      </div>
      <h2 class="ctitle">{{ panel.title }}</h2>
      <p class="crole">{{ panel.role }}</p>

      <div v-if="panel.loc" class="cloc">
        <span class="pin">◈</span>{{ panel.loc }} ·
        <a :href="contact.github" target="_blank" rel="noopener">github.com/{{ contact.handle }}</a>
      </div>

      <div class="cbody">
        <!-- copy is authored HTML (contains <strong>); rendered as markup -->
        <p v-for="(html, i) in panel.body" :key="i" v-html="html"></p>
      </div>

      <div v-if="panel.badges.length" class="cbadges">
        <span v-for="(b, i) in panel.badges" :key="i" class="cbadge">{{ b }}</span>
      </div>

      <div v-for="(spec, i) in charts" :key="dispId + '-' + i" class="vis" :class="{ wide: spec.wide }">
        <div class="vhead">
          <span>{{ spec.title }}</span>
          <b v-if="spec.live" class="dotlive" :class="{ gold: spec.gold }">{{ spec.live }}</b>
        </div>
        <ChartMount :type="spec.type" :data="spec.data" />
      </div>

      <div v-if="panel.links" class="clinks">
        <a class="cbtn primary" :href="`mailto:${contact.email}`">{{ contact.email }}</a>
        <a class="cbtn" :href="contact.github" target="_blank" rel="noopener">GitHub</a>
        <a class="cbtn" :href="contact.linkedin" target="_blank" rel="noopener">LinkedIn</a>
      </div>
    </template>
  </section>
</template>
