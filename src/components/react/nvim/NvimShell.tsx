/**
 * NvimShell.tsx — Root island for the Neovim/LazyVim portfolio UI. Owns the
 * window-manager grid (bufferline / neo-tree + editor / statusline + cmdline),
 * provides the nav state machine via context, and toggles `html.nvim-active`
 * so the SSR'd 2D fallback (#classic-site) is hidden while JS drives the shell.
 */
import { useEffect } from 'react';
import { NvimContext } from './nvim-context';
import { useNvimNav } from './use-nvim-nav';
import { BufferLine } from './BufferLine';
import { NeoTree } from './NeoTree';
import { Editor } from './Editor';
import { Terminal } from './Terminal';
import { Telescope } from './Telescope';
import { FloatDetail } from './FloatDetail';
import { StatusLine } from './StatusLine';
import { CommandLine } from './CommandLine';
import { IslandBuffer } from './IslandBuffer';
import type { NvimData } from '../../../lib/nvim/nvim-data-types';

export default function NvimShell({ data }: { data: NvimData }) {
  const api = useNvimNav(data);
  const { current, terminalOpen, sidebarOpen, toggleSidebar } = api;
  const island = current === 'island';

  useEffect(() => {
    document.documentElement.classList.add('nvim-active');
    return () => document.documentElement.classList.remove('nvim-active');
  }, []);

  return (
    <NvimContext.Provider value={api}>
      <div className={`nvim-shell${sidebarOpen ? ' sidebar-open' : ''}`} aria-label="Neovim portfolio" lang={data.lang}>
        <div className="win">
          <BufferLine />
          <div className="mid">
            <NeoTree />
            {sidebarOpen && <div className="nv-scrim" onClick={() => toggleSidebar(false)} aria-hidden="true" />}
            <div className="panel main">
              {island ? (
                <IslandBuffer />
              ) : (
                <>
                  <Editor />
                  {terminalOpen && <Terminal />}
                </>
              )}
              <Telescope />
              <FloatDetail />
            </div>
          </div>
          <div className="bottom">
            <StatusLine />
            <CommandLine />
          </div>
        </div>
      </div>
    </NvimContext.Provider>
  );
}
