/**
 * nvim-context.tsx — Shared React context for the neovim shell. The provider
 * value (NvimApi) is produced by `use-nvim-nav` and consumed everywhere via
 * `useNvim()`, so chrome panels stay decoupled from the state machine.
 */
import { createContext, useContext } from 'react';
import type { NvimData, NvimProject } from '../../../lib/nvim/nvim-data-types';
import type { TeleItem } from './sections-config';

export type NvimMode = 'NORMAL' | 'COMMAND' | 'INSERT' | 'VISUAL';

export interface NvimApi {
  data: NvimData;
  projects: NvimProject[];
  current: string;
  mode: NvimMode;
  openBuffers: string[];
  cmdMap: Record<string, string>;
  teleItems: TeleItem[];
  telescopeOpen: boolean;
  terminalOpen: boolean;
  commandOpen: boolean;
  floatKey: string | null;
  sidebarOpen: boolean;
  go: (id: string) => void;
  closeBuffer: (id: string) => void;
  setMode: (m: NvimMode) => void;
  openTelescope: () => void;
  closeTelescope: () => void;
  toggleTerminal: (force?: boolean) => void;
  openCommand: () => void;
  closeCommand: () => void;
  /** Run a `:cmd` string (without the leading colon); returns true on a match. */
  runCmd: (v: string) => boolean;
  openFloat: (key: string) => void;
  closeFloat: () => void;
  toggleSidebar: (force?: boolean) => void;
  switchLang: () => void;
}

export const NvimContext = createContext<NvimApi | null>(null);

export function useNvim(): NvimApi {
  const ctx = useContext(NvimContext);
  if (!ctx) throw new Error('useNvim must be used within NvimContext provider');
  return ctx;
}
