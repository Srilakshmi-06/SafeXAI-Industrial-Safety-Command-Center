import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import {
  AlertTriangle,
  ShieldAlert,
  FileCheck2,
  Users,
  ShieldCheck,
  Timer,
  TrendingUp,
  Activity,
  ChevronRight,
  Flame,
  Wind,
  Skull,
  Zap,
  Users as UsersIcon,
  ShieldAlert as SA,
} from 'lucide-react';
import { Card, SectionTitle, Stat, SeverityBadge, ProgressBar, StatusDot } from '@/components/ui';
import {
  alerts,
  compoundRisks,
  compliance,
  riskTrend,
  incidentByType,
  zones,
  permits,
  cameraEvents,
  type Severity,
} from '@/data/mock';
import { sevColor } from '@/lib/theme';

const hazardIcon: Record<string, typeof Flame> = {
  'Hot Work + Rising Gas': Flame,
  'Confined Space + Low Oxygen': Skull,
  'Maintenance + Incomplete Isolation': Zap,
  'Shift Change + Reduced Supervision': UsersIcon,
  'CCTV Intrusion + Permit Mismatch': SA,
};

export function Overview({ onJump }: { onJump: (v: 'map' | 'permits' | 'cctv' | 'incidents' | 'compliance' | 'copilot') => void }) {
  const criticalZones = zones.filter((z) => z.risk === 'critical').length;
  const workersAtRisk = zones.filter((z) => z.riskScore >= 65).reduce((a, z) => a + z.workers, 0);
  const openPermits = permits.filter((p) => p.status === 'active').length;
  const activeAlerts = alerts.filter((a) => a.status !== 'resolved').length;
  const complianceScore = Math.round(compliance.reduce((a, c) => a + c.score, 0) / compliance.length);
  const responseTime = '2.4m';

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <SummaryCard
          icon={<AlertTriangle size={18} />}
          label="Active Alerts"
          value={activeAlerts}
          tone="red"
          sub="3 critical"
          delay={0}
        />
        <SummaryCard
          icon={<ShieldAlert size={18} />}
          label="Critical Zones"
          value={criticalZones}
          tone="red"
          sub="of 8 zones"
          delay={0.05}
        />
        <SummaryCard
          icon={<FileCheck2 size={18} />}
          label="Open Permits"
          value={openPermits}
          tone="amber"
          sub="2 conflicts"
          delay={0.1}
        />
        <SummaryCard
          icon={<Users size={18} />}
          label="Workers at Risk"
          value={workersAtRisk}
          tone="amber"
          sub="in high+ zones"
          delay={0.15}
        />
        <SummaryCard
          icon={<ShieldCheck size={18} />}
          label="Compliance Score"
          value={complianceScore}
          unit="%"
          tone="green"
          sub="target 93%"
          delay={0.2}
        />
        <SummaryCard
          icon={<Timer size={18} />}
          label="Avg Response"
          value={responseTime}
          tone="sky"
          sub="−0.3m vs avg"
          delay={0.25}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Risk trend */}
        <Card className="xl:col-span-2 p-4">
          <SectionTitle
            title="Risk Trend · Last 90 min"
            subtitle="Composite risk, gas exposure and permit load"
            icon={<TrendingUp size={16} />}
            right={
              <div className="flex items-center gap-3 text-[11px]">
                <Legend color="#ff3b3b" label="Risk" />
                <Legend color="#ff7a1a" label="Gas" />
                <Legend color="#3aa0ff" label="Permits" />
              </div>
            }
          />
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={riskTrend} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="gRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff3b3b" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#ff3b3b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gGas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff7a1a" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#ff7a1a" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gPerm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3aa0ff" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#3aa0ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(120,160,200,0.08)" vertical={false} />
                <XAxis dataKey="t" tick={{ fill: '#7c8ca0', fontSize: 11 }} axisLine={false} tickLine={false} />
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
                <Area type="monotone" dataKey="risk" stroke="#ff3b3b" strokeWidth={2} fill="url(#gRisk)" />
                <Area type="monotone" dataKey="gas" stroke="#ff7a1a" strokeWidth={2} fill="url(#gGas)" />
                <Area type="monotone" dataKey="permits" stroke="#3aa0ff" strokeWidth={2} fill="url(#gPerm)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Alerts feed */}
        <Card className="p-4">
          <SectionTitle
            title="Live Alert Feed"
            subtitle="Newest first"
            icon={<Activity size={16} />}
            right={
              <button onClick={() => onJump('cctv')} className="text-[11px] text-sky-300 hover:text-sky-200 flex items-center gap-0.5">
                All <ChevronRight size={12} />
              </button>
            }
          />
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {alerts.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
              >
                <span
                  className="relative inline-block h-2 w-2 rounded-full"
                  style={{ background: sevColor[a.severity] }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-slate-100 truncate">{a.title}</div>
                  <div className="text-[10px] text-slate-400">
                    Zone {a.zone} · {a.time} · {a.status}
                  </div>
                </div>
                <SeverityBadge severity={a.severity} />
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Compound risks */}
        <Card className="xl:col-span-2 p-4">
          <SectionTitle
            title="Compound Risk Intelligence"
            subtitle="AI-correlated multi-signal risks"
            icon={<ShieldAlert size={16} />}
            right={
              <button onClick={() => onJump('incidents')} className="text-[11px] text-sky-300 hover:text-sky-200 flex items-center gap-0.5">
                Investigate <ChevronRight size={12} />
              </button>
            }
          />
          <div className="grid sm:grid-cols-2 gap-3">
            {compoundRisks.map((r, i) => {
              const Icon = hazardIcon[r.title] || Flame;
              return (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-xl p-3 bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="grid place-items-center h-8 w-8 rounded-lg border"
                        style={{
                          background: `${sevColor[r.severity]}22`,
                          borderColor: `${sevColor[r.severity]}55`,
                          color: sevColor[r.severity],
                        }}
                      >
                        <Icon size={15} />
                      </div>
                      <span className="text-xs font-semibold text-slate-100">{r.title}</span>
                    </div>
                    <SeverityBadge severity={r.severity} />
                  </div>
                  <div className="text-[11px] text-slate-400 mb-2">
                    Zone {r.zone} · confidence{' '}
                    <span className="font-mono text-slate-200">{Math.round(r.confidence * 100)}%</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {r.factors.map((f) => (
                      <span
                        key={f}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                  <div className="text-[11px] text-slate-300 leading-relaxed">
                    <span className="text-sky-300 font-medium">Action: </span>
                    {r.action}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>

        {/* Right column: incidents by type + compliance mini */}
        <div className="space-y-4">
          <Card className="p-4">
            <SectionTitle title="Incidents by Type" subtitle="Last 90 days" icon={<Activity size={16} />} />
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incidentByType} margin={{ top: 4, right: 6, left: -22, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(120,160,200,0.08)" vertical={false} />
                  <XAxis dataKey="type" tick={{ fill: '#7c8ca0', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#7c8ca0', fontSize: 10 }} axisLine={false} tickLine={false} />
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
                    {incidentByType.map((d, i) => (
                      <Cell key={i} fill={d.count >= 10 ? '#ff7a1a' : '#3aa0ff'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-4">
            <SectionTitle
              title="Compliance Pulse"
              subtitle="Top gaps"
              icon={<ShieldCheck size={16} />}
              right={
                <button onClick={() => onJump('compliance')} className="text-[11px] text-sky-300 hover:text-sky-200 flex items-center gap-0.5">
                  Details <ChevronRight size={12} />
                </button>
              }
            />
            <div className="space-y-3">
              {compliance.slice(0, 4).map((c) => (
                <div key={c.id}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-300">{c.label}</span>
                    <span className="font-mono text-slate-200">
                      {c.score}
                      <span className="text-slate-500">/{c.target}</span>
                    </span>
                  </div>
                  <ProgressBar value={(c.score / c.target) * 100} color={c.score < 70 ? '#ff7a1a' : '#3fd0a0'} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Mini CCTV strip */}
      <Card className="p-4">
        <SectionTitle
          title="Latest CCTV Events"
          subtitle="AI vision detections"
          icon={<AlertTriangle size={16} />}
          right={
            <button onClick={() => onJump('cctv')} className="text-[11px] text-sky-300 hover:text-sky-200 flex items-center gap-0.5">
              All events <ChevronRight size={12} />
            </button>
          }
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {cameraEvents.slice(0, 4).map((e) => (
            <div key={e.id} className="rounded-xl overflow-hidden border border-white/10 bg-ink-900">
              <div className={`relative h-20 bg-gradient-to-br ${e.thumb} scanlines`}>
                <div className="absolute top-1.5 left-1.5 flex items-center gap-1 text-[9px] font-mono text-white/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" /> REC
                </div>
                <div className="absolute top-1.5 right-1.5 text-[9px] font-mono text-white/70">{e.time}</div>
                <div className="absolute bottom-1.5 left-1.5 text-[9px] font-mono text-white/80">{e.camera}</div>
              </div>
              <div className="p-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-slate-100 truncate">{e.type}</span>
                  <SeverityBadge severity={e.severity} />
                </div>
                <div className="text-[10px] text-slate-400 line-clamp-2">{e.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  unit,
  sub,
  tone,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  sub?: string;
  tone: 'red' | 'amber' | 'green' | 'sky';
  delay: number;
}) {
  const tones: Record<string, { text: string; ring: string; glow: string }> = {
    red: { text: 'text-red-300', ring: 'border-red-500/30', glow: 'hover:shadow-glow-red' },
    amber: { text: 'text-orange-300', ring: 'border-orange-500/30', glow: 'hover:shadow-glow-amber' },
    green: { text: 'text-emerald-300', ring: 'border-emerald-500/30', glow: 'hover:shadow-glow-green' },
    sky: { text: 'text-sky-300', ring: 'border-sky-500/30', glow: 'hover:shadow-glow' },
  };
  const t = tones[tone];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`glass rounded-2xl p-3.5 border ${t.ring} ${t.glow} transition-all`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`grid place-items-center h-8 w-8 rounded-lg bg-white/5 border border-white/10 ${t.text}`}>
          {icon}
        </div>
        <StatusDot tone={tone === 'red' ? 'red' : tone === 'amber' ? 'amber' : tone === 'green' ? 'green' : 'sky'} />
      </div>
      <div className={`text-2xl font-bold leading-none ${t.text}`}>
        {value}
        {unit && <span className="text-sm text-slate-400 ml-0.5">{unit}</span>}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-1">{label}</div>
      {sub && <div className="text-[10px] text-slate-500 mt-0.5">{sub}</div>}
    </motion.div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-slate-400">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}
