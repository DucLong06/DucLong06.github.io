/**
 * use-nvim-nav.ts — Core state machine for the neovim shell: buffer navigation,
 * vim mode, command/telescope/terminal/float overlays, global keybindings,
 * history (?s=) sync for deep-links + back/forward, and the EN/VI lang switch.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { NvimData } from '../../../lib/nvim/nvim-data-types';
import type { NvimApi, NvimMode } from './nvim-context';
import { buildCmdMap, buildTeleItems, isReadme, readmeKey, SECTIONS } from './sections-config';

const MAX_BUFFERS = 8;

/** id → URL ?s= param. `readme:<key>` collapses to just `<key>`. */
function toParam(id: string): string {
  return isReadme(id) ? readmeKey(id) : id;
}

export function useNvimNav(data: NvimData): NvimApi {
  const projects = data.projects;
  const cmdMap = useMemo(() => buildCmdMap(projects), [projects]);
  const teleItems = useMemo(() => buildTeleItems(data), [data]);

  /** Resolve a ?s= param (or command target) to a real buffer id. */
  const resolveParam = useCallback(
    (s: string | null): string => {
      if (!s) return 'dashboard';
      if (SECTIONS[s]) return s;
      if (isReadme(s)) return s;
      if (projects.some((p) => p.key === s)) return `readme:${s}`;
      return cmdMap[s] ?? 'dashboard';
    },
    [projects, cmdMap],
  );

  const initial = useMemo(() => {
    if (typeof window === 'undefined') return 'dashboard';
    return resolveParam(new URLSearchParams(window.location.search).get('s'));
  }, [resolveParam]);

  const [current, setCurrent] = useState(initial);
  const [mode, setMode] = useState<NvimMode>('NORMAL');
  const [openBuffers, setOpenBuffers] = useState<string[]>(
    initial === 'dashboard' ? ['dashboard'] : ['dashboard', initial],
  );
  const [telescopeOpen, setTelescopeOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [floatKey, setFloatKey] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const skipPush = useRef(false); // true when a popstate drives the change
  const firstSync = useRef(true); // first history write replaces instead of pushes

  const go = useCallback((id: string) => {
    setCurrent(id);
    setOpenBuffers((bufs) => {
      if (bufs.includes(id)) return bufs;
      const next = [...bufs, id];
      return next.length > MAX_BUFFERS ? next.slice(next.length - MAX_BUFFERS) : next;
    });
    setMode('NORMAL');
    setTelescopeOpen(false);
    setCommandOpen(false);
    setSidebarOpen(false);
  }, []);

  // Sync current → history (?s=) so buffers are shareable + back/forward works.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (skipPush.current) {
      skipPush.current = false;
      return;
    }
    const url = new URL(window.location.href);
    if (current === 'dashboard') url.searchParams.delete('s');
    else url.searchParams.set('s', toParam(current));
    if (firstSync.current) {
      firstSync.current = false;
      window.history.replaceState({ s: current }, '', url);
    } else {
      window.history.pushState({ s: current }, '', url);
    }
  }, [current]);

  useEffect(() => {
    const onPop = () => {
      skipPush.current = true;
      go(resolveParam(new URLSearchParams(window.location.search).get('s')));
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [go, resolveParam]);

  const closeBuffer = useCallback(
    (id: string) => {
      const next = openBuffers.filter((b) => b !== id);
      const safe = next.length ? next : ['dashboard'];
      setOpenBuffers(safe);
      if (id === current) setCurrent(safe[safe.length - 1]);
    },
    [openBuffers, current],
  );

  const openTelescope = useCallback(() => { setTelescopeOpen(true); setMode('COMMAND'); }, []);
  const closeTelescope = useCallback(() => { setTelescopeOpen(false); setMode('NORMAL'); }, []);
  const openCommand = useCallback(() => { setCommandOpen(true); setMode('COMMAND'); }, []);
  const closeCommand = useCallback(() => { setCommandOpen(false); setMode('NORMAL'); }, []);
  const toggleTerminal = useCallback((force?: boolean) => {
    setTerminalOpen((on) => (force === undefined ? !on : force));
  }, []);
  const openFloat = useCallback((key: string) => setFloatKey(key), []);
  const closeFloat = useCallback(() => setFloatKey(null), []);
  const toggleSidebar = useCallback((force?: boolean) => {
    setSidebarOpen((on) => (force === undefined ? !on : force));
  }, []);

  const switchLang = useCallback(() => {
    const param = current === 'dashboard' ? '' : `?s=${toParam(current)}`;
    window.location.assign(data.altLangUrl + param);
  }, [current, data.altLangUrl]);

  const runCmd = useCallback(
    (raw: string): boolean => {
      const v = raw.trim().replace(/^:/, '').toLowerCase();
      if (!v) return false;
      if (v === 'term' || v === 'terminal') { toggleTerminal(true); return true; }
      if (v === 'find' || v === 'f') { openTelescope(); return true; }
      if (v === 'lang') { switchLang(); return true; }
      if (v === 'q' || v === 'quit') {
        if (terminalOpen) toggleTerminal(false);
        else if (floatKey) closeFloat();
        else if (telescopeOpen) closeTelescope();
        else if (current !== 'dashboard') go('dashboard');
        return true;
      }
      const target = cmdMap[v];
      if (target) { go(target); return true; }
      return false;
    },
    [cmdMap, current, floatKey, terminalOpen, telescopeOpen, go, toggleTerminal, openTelescope, closeTelescope, closeFloat, switchLang],
  );

  // ── global keybindings ──────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      const typing = el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
      if (typing || commandOpen || telescopeOpen) return;
      // While a float is open, swallow all keys except q / Esc (which close it).
      if (floatKey) {
        if (e.key === 'q' || e.key === 'Escape') closeFloat();
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') { e.preventDefault(); openTelescope(); }
        return;
      }
      switch (e.key) {
        case ':': e.preventDefault(); openCommand(); break;
        case 'f': case '/': e.preventDefault(); openTelescope(); break;
        case 't': toggleTerminal(); break;
        case 'a': go('about'); break;
        case 'p': go('projects'); break;
        case 'r': go('papers'); break;
        case 's': go('skills'); break;
        case '3': go('island'); break;
        case 'q':
          if (floatKey) closeFloat();
          else if (terminalOpen) toggleTerminal(false);
          else if (current === 'island') go('dashboard');
          break;
        case 'Escape':
          closeFloat();
          if (current === 'island') go('dashboard');
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [commandOpen, telescopeOpen, floatKey, terminalOpen, current, go, openCommand, openTelescope, toggleTerminal, closeFloat]);

  return {
    data, projects, current, mode, openBuffers, cmdMap, teleItems,
    telescopeOpen, terminalOpen, commandOpen, floatKey, sidebarOpen,
    go, closeBuffer, setMode, openTelescope, closeTelescope, toggleTerminal,
    openCommand, closeCommand, runCmd, openFloat, closeFloat, toggleSidebar, switchLang,
  };
}
