import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FileCheck2, Filter, ShieldX, CheckCircle2, Clock, Pause, XCircle } from 'lucide-react';
import { Card, SectionTitle, SeverityBadge, Chip } from '@/components/ui';
import { permits, type Permit, type Severity } from '@/data/mock';
import { sevColor } from '@/lib/theme';

const statusStyle: Record<Permit['status'], { label: string; color: string; icon: typeof Clock }> = {
  active: { label: 'Active', color: '#3fd0a0', icon: CheckCircle2 },
  pending: { label: 'Pending', color: '#3aa0ff', icon: Clock },
  blocked: { label: 'Blocked', color: '#ff3b3b', icon: ShieldX },
  suspended: { label: 'Suspended', color: '#ff7a1a', icon: Pause },
  expired: { label: 'Expired', color: '#ffc24b', icon: XCircle },
};

const types = ['All', 'Hot Work', 'Confined Space', 'Electrical Isolation', 'Lifting', 'Height Work', 'Excavation'];
const sevs: (Severity | 'all')[] = ['all', 'critical', 'high', 'medium', 'low'];

export function Permits() {
  const [type, setType] = useState('All');
  const [sev, setSev] = useState<Severity | 'all'>('all');

  const filtered = useMemo(
    () =>
      permits.filter(
        (p) => (type === 'All' || p.type === type) && (sev === 'all' || p.severity === sev),
      ),
    [type, sev],
  );

  const counts = {
    active: permits.filter((p) => p.status === 'active').length,
    pending: permits.filter((p) => p.status === 'pending').length,
    blocked: permits.filter((p) => p.status === 'blocked').length,
    suspended: permits.filter((p) => p.status === 'suspended').length,
    expired: permits.filter((p) => p.status === 'expired').length,
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {(['active', 'pending', 'blocked', 'suspended', 'expired'] as const).map((s) => {
          const st = statusStyle[s];
          const Icon = st.icon;
          return (
            <div key={s} className="glass rounded-xl p-3 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <Icon size={14} style={{ color: st.color }} />
                <span className="text-[10px] uppercase tracking-wider text-slate-400">{st.label}</span>
              </div>
              <div className="text-xl font-bold" style={{ color: st.color }}>
                {counts[s]}
              </div>
            </div>
          );
        })}
      </div>

      <Card className="p-4">
        <SectionTitle
          title="Permit Intelligence"
          subtitle="Live permits with safety-check and conflict analysis"
          icon={<FileCheck2 size={16} />}
          right={
            <div className="flex items-center gap-1.5 text-slate-400">
              <Filter size={13} /> <span className="text-[11px]">{filtered.length} shown</span>
            </div>
          }
        />

        <div className="flex flex-wrap items-center gap-2 mb-4">
          {types.map((t) => (
            <Chip key={t} active={type === t} onClick={() => setType(t)}>
              {t}
            </Chip>
          ))}
          <span className="mx-1 h-4 w-px bg-white/10" />
          {sevs.map((s) => (
            <Chip key={s} active={sev === s} onClick={() => setSev(s)}>
              {s === 'all' ? 'All severity' : s}
            </Chip>
          ))}
        </div>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-slate-400 border-b border-white/10">
                <th className="px-2 py-2 font-medium">Permit</th>
                <th className="px-2 py-2 font-medium">Type</th>
                <th className="px-2 py-2 font-medium">Asset</th>
                <th className="px-2 py-2 font-medium">Zone</th>
                <th className="px-2 py-2 font-medium">Status</th>
                <th className="px-2 py-2 font-medium">Remaining</th>
                <th className="px-2 py-2 font-medium">Safety checks</th>
                <th className="px-2 py-2 font-medium">Conflict</th>
                <th className="px-2 py-2 font-medium">Severity</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const st = statusStyle[p.status];
                const doneChecks = p.checks.filter((c) => c.done).length;
                return (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                      p.conflict ? 'bg-red-500/5' : ''
                    }`}
                  >
                    <td className="px-2 py-2.5 font-mono text-xs text-slate-200">{p.id}</td>
                    <td className="px-2 py-2.5 text-xs text-slate-300">{p.type}</td>
                    <td className="px-2 py-2.5 text-xs text-slate-300">{p.asset}</td>
                    <td className="px-2 py-2.5">
                      <span className="inline-grid place-items-center h-6 w-6 rounded-md bg-white/5 border border-white/10 text-[11px] font-bold text-slate-200">
                        {p.zone}
                      </span>
                    </td>
                    <td className="px-2 py-2.5">
                      <span
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border"
                        style={{ color: st.color, borderColor: `${st.color}55`, background: `${st.color}15` }}
                      >
                        {st.label}
                      </span>
                    </td>
                    <td className="px-2 py-2.5 text-xs font-mono text-slate-300">{p.remaining}</td>
                    <td className="px-2 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="flex gap-1">
                          {p.checks.map((c) => (
                            <span
                              key={c.label}
                              title={c.label}
                              className="h-1.5 w-5 rounded-full"
                              style={{ background: c.done ? '#3fd0a0' : '#ff7a1a' }}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {doneChecks}/{p.checks.length}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-2.5">
                      {p.conflict ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-red-300">
                          <ShieldX size={12} /> {p.conflict}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500">—</span>
                      )}
                    </td>
                    <td className="px-2 py-2.5">
                      <SeverityBadge severity={p.severity} />
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          <div className="rounded-xl p-3 bg-red-500/10 border border-red-500/30">
            <div className="flex items-center gap-2 text-red-200 text-xs font-semibold mb-1">
              <ShieldX size={14} /> Unsafe simultaneous operations
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Hot Work PT-1187 (Zone A) overlaps rising CO trend; Lifting PT-1185 (Zone D) overlaps incomplete
              isolation. These pairs are flagged for automatic permit freeze.
            </p>
          </div>
          <div className="rounded-xl p-3 bg-sky-500/10 border border-sky-500/30">
            <div className="flex items-center gap-2 text-sky-200 text-xs font-semibold mb-1">
              <CheckCircle2 size={14} /> Permit integrity
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {counts.active} permits active, {counts.pending} pending validation. Gas-test logs missing on 2 permits.
              Auto-retest scheduled before expiry.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
