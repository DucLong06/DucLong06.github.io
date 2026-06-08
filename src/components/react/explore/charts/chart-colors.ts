/**
 * chart-colors.ts — Neon palette spread for chart segments (cyan → magenta),
 * matching the donut-hub wedge colors. Cycles if more segments than colors.
 */
export const CHART_COLORS = [
  '#34e2ff',
  '#49b6ff',
  '#7d8cff',
  '#b06af0',
  '#e155c2',
  '#ff4d9d',
  '#ff7a6b',
] as const;

export function chartColor(i: number): string {
  return CHART_COLORS[i % CHART_COLORS.length];
}
