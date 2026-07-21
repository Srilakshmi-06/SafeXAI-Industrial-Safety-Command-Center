import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { sevBg, sevText } from '@/lib/theme';
import type { Severity } from '@/data/mock';

export function Card({
  children,
  className = '',
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`glass rounded-2xl shadow-card ${hover ? 'transition-all duration-300 hover:border-sky-400/30' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  title,
  subtitle,
  icon,
  right,
}: {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 mb-4">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="grid place-items-center h-9 w-9 rounded-xl bg-sky-500/10 text-sky-300 border border-sky-400/20">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-slate-100">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {right}
    </div>
  );
}

export function SeverityBadge({ severity, className = '' }: { severity: Severity; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${sevBg[severity]} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'currentColor' }} />
      {sevText[severity]}
    </span>
  );
}

export function Stat({
  label,
  value,
  unit,
  tone = 'default',
  icon,
}: {
  label: string;
  value: string | number;
  unit?: string;
  tone?: 'default' | 'red' | 'amber' | 'green' | 'sky';
  icon?: ReactNode;
}) {
  const tones: Record<string, string> = {
    default: 'text-slate-100',
    red: 'text-red-300',
    amber: 'text-orange-300',
    green: 'text-emerald-300',
    sky: 'text-sky-300',
  };
  return (
    <div className="flex items-center gap-3">
      {icon && (
        <div className="grid place-items-center h-10 w-10 rounded-xl bg-white/5 border border-white/10 text-slate-200">
          {icon}
        </div>
      )}
      <div>
        <div className={`text-2xl font-bold leading-none ${tones[tone]}`}>
          {value}
          {unit && <span className="text-sm font-medium text-slate-400 ml-1">{unit}</span>}
        </div>
        <div className="text-[11px] uppercase tracking-wider text-slate-400 mt-1">{label}</div>
      </div>
    </div>
  );
}

export function ProgressBar({ value, color = '#3aa0ff' }: { value: number; color?: string }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  );
}

export function Ring({
  value,
  size = 64,
  stroke = 7,
  color = '#3aa0ff',
  label,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  label?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (Math.min(100, Math.max(0, value)) / 100) * c;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: off }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-sm font-bold text-slate-100 leading-none">{Math.round(value)}</div>
        {label && <div className="text-[8px] uppercase tracking-wider text-slate-400 mt-0.5">{label}</div>}
      </div>
    </div>
  );
}

export function StatusDot({ tone = 'green' }: { tone?: 'green' | 'red' | 'amber' | 'sky' }) {
  const colors = { green: 'text-emerald-400', red: 'text-red-400', amber: 'text-orange-400', sky: 'text-sky-400' };
  return (
    <span className={`relative inline-block h-2 w-2 rounded-full bg-current ${colors[tone]} dot-pulse`} />
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton rounded-lg ${className}`} />;
}

export function Chip({
  children,
  active = false,
  onClick,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all focus-ring ${
        active
          ? 'bg-sky-500/20 border-sky-400/40 text-sky-200'
          : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
      }`}
    >
      {children}
    </button>
  );
}
