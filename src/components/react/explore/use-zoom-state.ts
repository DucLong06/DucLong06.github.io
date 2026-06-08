/**
 * use-zoom-state.ts — Tiny FSM for the hub ⇄ focused camera/detail flow.
 * Two modes: 'hub' (overview) and 'focused' (a wedge selected). Selecting a wedge
 * from focused jumps directly to it (no forced return to center). Reducer + React
 * state — no XState (KISS, <5 states).
 */
import { useReducer } from 'react';
import type { WedgeId } from './wedges-config';

export interface ZoomState {
  mode: 'hub' | 'focused';
  wedgeId: WedgeId | null;
}

type Action =
  | { type: 'focus'; wedgeId: WedgeId }
  | { type: 'toHub' };

function reducer(state: ZoomState, action: Action): ZoomState {
  switch (action.type) {
    case 'focus':
      return { mode: 'focused', wedgeId: action.wedgeId };
    case 'toHub':
      return { mode: 'hub', wedgeId: null };
    default:
      return state;
  }
}

export function useZoomState() {
  const [state, dispatch] = useReducer(reducer, { mode: 'hub', wedgeId: null });
  return {
    state,
    focus: (wedgeId: WedgeId) => dispatch({ type: 'focus', wedgeId }),
    toHub: () => dispatch({ type: 'toHub' }),
  };
}
