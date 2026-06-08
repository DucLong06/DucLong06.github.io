/**
 * use-zoom-state.ts — FSM for the hub ⇄ slice cinematic dive.
 *
 * Four phases model the Prezi-style choreography so the scene can time the camera
 * legs and the stage payload:
 *   hub        — overview, pie idle-spins, user orbit allowed.
 *   diving     — camera flying the arc (oblique → slice). Payload not yet mounted.
 *   stage      — camera parked face-on over the slice. Payload sprouts, panel opens.
 *   retracting — camera flying back (slice → oblique). Payload retracts.
 *
 * Transitions: focus(id)→diving · arriveStage()→stage · toHub()→retracting (keeps
 * wedgeId so the slice animates home) · arriveHub()→hub. Reducer + React state, no
 * XState (KISS). Selecting a new slice while on stage re-enters diving for that id.
 */
import { useReducer } from 'react';
import type { WedgeId } from './wedges-config';

export type ZoomMode = 'hub' | 'diving' | 'stage' | 'retracting';

export interface ZoomState {
  mode: ZoomMode;
  wedgeId: WedgeId | null;
}

type Action =
  | { type: 'focus'; wedgeId: WedgeId }
  | { type: 'arriveStage' }
  | { type: 'toHub' }
  | { type: 'arriveHub' };

function reducer(state: ZoomState, action: Action): ZoomState {
  switch (action.type) {
    case 'focus':
      return { mode: 'diving', wedgeId: action.wedgeId };
    case 'arriveStage':
      // Ignore a stale arrival if we already left (e.g. user closed mid-dive).
      return state.mode === 'diving' ? { mode: 'stage', wedgeId: state.wedgeId } : state;
    case 'toHub':
      return { mode: 'retracting', wedgeId: state.wedgeId };
    case 'arriveHub':
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
    arriveStage: () => dispatch({ type: 'arriveStage' }),
    toHub: () => dispatch({ type: 'toHub' }),
    arriveHub: () => dispatch({ type: 'arriveHub' }),
  };
}
