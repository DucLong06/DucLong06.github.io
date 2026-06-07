/**
 * WorkplaceCards.tsx — The post-transition cards as REAL DOM via drei
 * `<Scroll html>`, overlaid on the settled grid and faded up keyed to scroll.
 *
 * Two pieces, both mounted inside <ScrollControls>:
 *   1. <Scroll html> with the shared CardsContent (registers each card element).
 *   2. A tiny useFrame driver that reads scroll.offset and writes a staggered
 *      opacity/translateY per card — zero allocations, damped by ScrollControls.
 *
 * The reduced-motion path does NOT use this component; CoreScene renders
 * CardsContent as a static visible overlay instead (Phase 07 bypass).
 */
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Scroll, useScroll } from '@react-three/drei';
import type { SceneData } from '../../../../lib/scene/scene-data-types';
import { CARDS } from '../core-config';
import { CardsContent } from './CardsContent';

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

interface Props {
  data: SceneData;
}

export function WorkplaceCards({ data }: Props) {
  const cards = useRef<(HTMLElement | null)[]>([]);
  const prevP = useRef<number[]>([]);
  const scroll = useScroll();

  useFrame(() => {
    const o = scroll.offset;
    const els = cards.current;
    for (let i = 0; i < els.length; i++) {
      const el = els[i];
      if (!el) continue;
      // Each card starts a touch later than the previous → staggered reveal.
      const p = clamp01((o - (CARDS.fadeStart + i * CARDS.stagger)) / CARDS.fadeLen);
      // Only touch the DOM (and alloc strings) when the value actually moves.
      if (Math.abs(p - (prevP.current[i] ?? -1)) < 0.001) continue;
      prevP.current[i] = p;
      el.style.opacity = String(p);
      el.style.transform = `translateY(${(1 - p) * 26}px)`;
    }
  });

  return (
    <Scroll html>
      <CardsContent
        data={data}
        rootClass="core-cards--scroll"
        registerCard={(el, i) => {
          cards.current[i] = el;
        }}
      />
    </Scroll>
  );
}
