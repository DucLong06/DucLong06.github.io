/**
 * world-store.ts — Reactive seam between the imperative Three.js scene and the
 * Vue HUD. Replaces the prototype's `window.WORLD` global + `world:*` CustomEvents.
 *
 * Data flow is strictly one-way on each side to avoid cycles:
 *   HUD  → store actions → `api.*`         (goTo / next / prev / toggleTour / stop)
 *   scene → store `_on*`  → reactive state  (_onDepart / _onArrive / _onTourState)
 *
 * Provided via Vue inject so there is exactly one store per island mount (no
 * cross-instance global state, HMR-safe).
 */
import { reactive, type InjectionKey } from 'vue';
import type { Lang, WorldData, WorldStation, Panel, Aside, ChartSpec } from '../../../../lib/scene/world-data-types';

/** Controller handle the scene exposes; store actions call into it. */
export interface WorldApi {
  goTo(index: number, opts?: { dur?: number }): void;
  goToId(id: string, opts?: { dur?: number }): void;
  next(): void;
  prev(): void;
  startTour(): void;
  stopTour(): void;
  toggleTour(): void;
}

const LANG_KEY = 'hdl_lang'; // keep prototype key for continuity

export interface WorldStore {
  readonly data: WorldData;
  state: {
    ready: boolean;
    lang: Lang;
    activeId: string | null;
    touring: boolean;
    transitioning: boolean;
    hovered: number | null;
    pills: { id: string; label: string }[];
  };
  // HUD → scene
  setLang(lang: Lang): void;
  goTo(index: number): void;
  goToId(id: string): void;
  next(): void;
  prev(): void;
  toggleTour(): void;
  stop(): void;
  // scene → store
  bindApi(api: WorldApi): void;
  setReady(v: boolean): void;
  _onDepart(): void;
  _onArrive(id: string): void;
  _onTourState(touring: boolean): void;
  // getters
  activeStation(): WorldStation | null;
  panel(): Panel | null;
  aside(): Aside | null;
  charts(): ChartSpec[];
}

function readLang(): Lang {
  try {
    return (localStorage.getItem(LANG_KEY) as Lang) === 'vi' ? 'vi' : 'en';
  } catch {
    return 'en';
  }
}

export function createWorldStore(data: WorldData): WorldStore {
  let api: WorldApi | null = null;

  // Pills: first word of each station's kicker (matches prototype nav build).
  const pills = data.stations.map((s) => ({
    id: s.id,
    label: s.panel.en.kicker.split(' ')[0],
  }));

  const state = reactive<WorldStore['state']>({
    ready: false,
    lang: readLang(),
    activeId: null,
    touring: true,
    transitioning: false,
    hovered: null,
    pills,
  });

  const stationById = (id: string | null) =>
    id ? data.stations.find((s) => s.id === id) ?? null : null;

  const store: WorldStore = {
    data,
    state,

    setLang(lang) {
      state.lang = lang;
      try { localStorage.setItem(LANG_KEY, lang); } catch { /* ignore */ }
      if (typeof document !== 'undefined') document.documentElement.lang = lang;
    },
    goTo(index) { api?.stopTour(); api?.goTo(index); },
    goToId(id) { api?.stopTour(); api?.goToId(id); },
    next() { api?.stopTour(); api?.next(); },
    prev() { api?.stopTour(); api?.prev(); },
    toggleTour() { api?.toggleTour(); },
    stop() { api?.stopTour(); },

    bindApi(a) { api = a; },
    setReady(v) { state.ready = v; },
    _onDepart() { state.activeId = null; state.transitioning = true; },
    _onArrive(id) { state.activeId = id; state.transitioning = false; },
    _onTourState(touring) { state.touring = touring; },

    activeStation() { return stationById(state.activeId); },
    panel() {
      const st = stationById(state.activeId);
      return st ? st.panel[state.lang] : null;
    },
    aside() {
      const st = stationById(state.activeId);
      return st ? st.aside[state.lang] : null;
    },
    charts() {
      const st = stationById(state.activeId);
      return st ? st.charts[state.lang] : [];
    },
  };

  return store;
}

export const WORLD_STORE_KEY: InjectionKey<WorldStore> = Symbol('world-store');
