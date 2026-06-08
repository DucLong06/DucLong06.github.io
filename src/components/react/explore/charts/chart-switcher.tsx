/**
 * chart-switcher.tsx — Segmented control to switch a panel's visualization type.
 * role="radiogroup" + roving aria-checked; arrow keys move selection (a11y).
 */
interface Option<T extends string> {
  value: T;
  label: string;
}

import { useRef } from 'react';

interface Props<T extends string> {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}

export default function ChartSwitcher<T extends string>({ label, options, value, onChange }: Props<T>) {
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(e: React.KeyboardEvent, idx: number) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const dir = e.key === 'ArrowRight' ? 1 : -1;
    const next = (idx + dir + options.length) % options.length;
    onChange(options[next].value);
    // Move DOM focus with the selection (roving tabindex → SR announces + Tab works).
    btnRefs.current[next]?.focus();
  }

  return (
    <div className="chart-switcher" role="radiogroup" aria-label={label}>
      {options.map((opt, idx) => {
        const checked = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            ref={(el) => { btnRefs.current[idx] = el; }}
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            className="chart-switcher__opt"
            data-active={checked}
            onClick={() => onChange(opt.value)}
            onKeyDown={(e) => onKeyDown(e, idx)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
