import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Siren,
  Sparkles,
  History,
  X,
  AlertCircle,
  ShieldCheck,
  Flame,
  Skull,
  Zap,
  Users,
  HardHat,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { Card, SectionTitle, SeverityBadge } from '@/components/ui';
import { incidents, incidentByZone, responseTimeBuckets, type Incident } from '@/data/mock';
import { sevColor } from '@/lib/theme';

const typeIcon: Record<Incident['type'], typeof Flame> = {
  Gas: Flame,
  'Permit Conflict': ShieldCheck,
  PPE: HardHat,
  Fall: AlertCircle,
  Fire: Flame,
  Electrical: Zap,
};

export function Incidents() {
  const [sel, setSel] = useState<Incident | null>(incidents[0] ?? null);
  const similar = sel
    ? incidents.filter((i) => i.id !== sel.id && (i.type === sel.type || i.zone === sel.zone)).slice(0, 3)
    : [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <SectionTitle title="Incidents by Zone" subtitle="Last 90 days" icon={<Siren size={16} />} />
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incidentByZone} margin={{ top: 4, right: 6, left: -22, bottom: 0 }}>
                <CartesianGrid stroke="rgba(120,160,200,0.08)" vertical={false} />
                <XAxis dataKey="zone" tick={{ fill: '#7c8ca0', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#7c8ca0', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(11,17,24,0.95)',
                    border: '1px solid rgba(120,160,200,0.2)',
                    borderRadius: 12,
                    color: '#e6edf6',
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {incidentByZone.map((d, i) => (
                    <Cell key={i} fill={d.count >= 8 ? '#ff3b3b' : d.count >= 6 ? '#ff7a1a' : '#3aa0ff'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <SectionTitle title="Response Time" subtitle="Minutes to acknowledge" icon={<History size={16} />} />
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={responseTimeBuckets} margin={{ top: 4, right: 6, left: -22, bottom: 0 }}>
                <CartesianGrid stroke="rgba(120,160,200,0.08)" vertical={false} />
                <XAxis dataKey="bucket" tick={{ fill: '#7c8ca0', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#7c8ca0', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(11,17,24,0.95)',
                    border: '1px solid rgba(120,160,200,0.2)',
                    borderRadius: 12,
                    color: '#e6edf6',
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="v" radius={[4, 4, 0, 0]} fill="#3fd0a0" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <SectionTitle title="Pattern Summary" subtitle="Recurring themes" icon={<Sparkles size={16} />} />
          <div className="space-y-2.5">
            <Pattern color="#ff7a1a" title="Gas-related events" desc="9 of 14 incidents involve skipped retests" />
            <Pattern color="#ff3b3b" title="Permit conflicts" desc="Lifting + isolation overlap recurs in Zone D" />
            <Pattern color="#3aa0ff" title="PPE gaps" desc="Self-certified checks fail in 60% of cases" />
            <Pattern color="#ffc24b" title="Handover risk" desc="Incidents cluster around shift change" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
        <Card className="p-4">
          <SectionTitle title="Incident History" subtitle="Select to inspect" icon={<Siren size={16} />} />
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {incidents.map((inc, i) => {
              const Icon = typeIcon[inc.type] || AlertCircle;
              const active = sel?.id === inc.id;
              return (
                <motion.button
                  key={inc.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => setSel(inc)}
                  className={`w-full text-left flex items-center gap-3 p-3 rounded-xl border transition-all focus-ring ${
                    active
                      ? 'bg-sky-500/10 border-sky-400/40'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div
                    className="grid place-items-center h-9 w-9 rounded-lg border shrink-0"
                    style={{
                      background: `${sevColor[inc.severity]}22`,
                      borderColor: `${sevColor[inc.severity]}55`,
                      color: sevColor[inc.severity],
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-100 truncate">{inc.title}</div>
                    <div className="text-[10px] text-slate-400">
                      {inc.date} · Zone {inc.zone} · {inc.outcome}
                    </div>
                  </div>
                  <SeverityBadge severity={inc.severity} />
                </motion.button>
              );
            })}
          </div>
        </Card>

        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {sel && (
              <motion.div
                key={sel.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-400">{sel.id} · {sel.date}</div>
                      <h3 className="text-base font-bold text-slate-100 mt-0.5">{sel.title}</h3>
                    </div>
                    <SeverityBadge severity={sel.severity} />
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">{sel.summary}</p>

                  <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 mb-3">
                    <div className="flex items-center gap-1.5 text-red-200 text-[11px] font-semibold mb-1">
                      <AlertCircle size={12} /> Root cause
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{sel.rootCause}</p>
                  </div>
                  <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3">
                    <div className="flex items-center gap-1.5 text-emerald-200 text-[11px] font-semibold mb-1">
                      <ShieldCheck size={12} /> Prevention
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{sel.prevention}</p>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <Card className="p-4">
            <SectionTitle title="Similar Incidents" subtitle="Matched by type/zone" icon={<History size={16} />} />
            {similar.length === 0 && <p className="text-xs text-slate-500">No similar incidents.</p>}
            <div className="space-y-2">
              {similar.map((s) => (
                <div key={s.id} className="rounded-lg bg-white/5 border border-white/10 p-2.5">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-medium text-slate-200 truncate">{s.title}</span>
                    <SeverityBadge severity={s.severity} />
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {s.date} · Zone {s.zone}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <SectionTitle title="AI Cause Summary" subtitle="Generated explanation" icon={<Sparkles size={16} />} />
            <div className="rounded-xl bg-gradient-to-br from-sky-500/10 to-emerald-500/5 border border-sky-400/20 p-3">
              <p className="text-[11px] text-slate-200 leading-relaxed">
                Based on {incidents.length} historical records, the likely cause is a{' '}
                <span className="text-sky-300 font-medium">skipped gas retest after a ventilation or wind change</span>,
                compounded by permit overlap. Recommended prevention: enforce continuous gas telemetry and an
                automated permit-conflict matrix that blocks simultaneous hot work + lifting over incomplete
                isolation.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Pattern({ color, title, desc }: { color: string; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white/5 border border-white/10">
      <span className="mt-1 h-2 w-2 rounded-full shrink-0" style={{ background: color }} />
      <div>
        <div className="text-xs font-medium text-slate-200">{title}</div>
        <div className="text-[10px] text-slate-400">{desc}</div>
      </div>
    </div>
  );
}
