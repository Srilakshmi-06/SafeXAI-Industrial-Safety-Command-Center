import type { Severity } from '@/data/mock';

export const sevText: Record<Severity, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  info: 'Info',
};

export const sevColor: Record<Severity, string> = {
  critical: '#ff3b3b',
  high: '#ff7a1a',
  medium: '#ffc24b',
  low: '#3fd0a0',
  info: '#3aa0ff',
};

export const sevBg: Record<Severity, string> = {
  critical: 'bg-red-500/15 text-red-300 border-red-500/30',
  high: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  medium: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
  low: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  info: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
};

export const sevGlow: Record<Severity, string> = {
  critical: 'shadow-glow-red',
  high: 'shadow-glow-amber',
  medium: 'shadow-glow-amber',
  low: 'shadow-glow-green',
  info: 'shadow-glow',
};

export function riskToColor(score: number): string {
  if (score >= 80) return '#ff3b3b';
  if (score >= 65) return '#ff7a1a';
  if (score >= 40) return '#ffc24b';
  return '#3fd0a0';
}
