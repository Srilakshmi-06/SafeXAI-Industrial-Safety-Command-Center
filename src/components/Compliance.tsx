import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle, FileCheck2, Wind, Zap, ClipboardCheck, FileText } from 'lucide-react';
import { Card, SectionTitle, Ring, ProgressBar } from '@/components/ui';
import { compliance } from '@/data/mock';

const icons: Record<string, typeof FileCheck2> = {
  c1: FileCheck2,
  c2: Wind,
  c3: Zap,
  c4: ClipboardCheck,
  c5: FileText,
};

export function Compliance() {
  const overall = Math.round(compliance.reduce((a, c) => a + c.score, 0) / compliance.length);
  const overdueTotal = compliance.reduce((a, c) => a + c.overdue, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4">
        <Card className="p-5 flex flex-col items-center justify-center text-center">
          <Ring value={overall} size={150} stroke={12} color={overall >= 80 ? '#3fd0a0' : '#ff7a1a'} label="overall" />
          <h3 className="text-sm font-semibold text-slate-100 mt-4">Overall Compliance</h3>
          <p className="text-xs text-slate-400 mt-1">
            {overdueTotal} overdue actions across {compliance.length} pillars
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 text-emerald-300">
              <ShieldCheck size={12} /> 3 pillars on target
            </span>
            <span className="inline-flex items-center gap-1 text-amber-300">
              <AlertTriangle size={12} /> 2 below target
            </span>
          </div>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {compliance.map((c, i) => {
            const Icon = icons[c.id] || FileCheck2;
            const ratio = (c.score / c.target) * 100;
            const color = c.score >= c.target ? '#3fd0a0' : c.score < 70 ? '#ff7a1a' : '#ffc24b';
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="glass rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="grid place-items-center h-9 w-9 rounded-lg border"
                      style={{ background: `${color}22`, borderColor: `${color}55`, color }}
                    >
                      <Icon size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-100">{c.label}</div>
                      <div className="text-[10px] text-slate-400">target {c.target}{c.unit}</div>
                    </div>
                  </div>
                  <Ring value={c.score} size={52} stroke={6} color={color} />
                </div>
                <ProgressBar value={ratio} color={color} />
                <div className="flex items-center justify-between mt-2 text-[11px]">
                  <span className="text-slate-400">
                    {c.score}/{c.target} {c.unit}
                  </span>
                  {c.overdue > 0 ? (
                    <span className="inline-flex items-center gap-1 text-amber-300">
                      <AlertTriangle size={11} /> {c.overdue} overdue
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-emerald-300">
                      <ShieldCheck size={11} /> on target
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Card className="p-4">
        <SectionTitle title="Missing Records & Overdue Actions" subtitle="Items requiring immediate attention" icon={<AlertTriangle size={16} />} />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-slate-400 border-b border-white/10">
                <th className="px-2 py-2 font-medium">Pillar</th>
                <th className="px-2 py-2 font-medium">Missing item</th>
                <th className="px-2 py-2 font-medium">Owner</th>
                <th className="px-2 py-2 font-medium">Due</th>
                <th className="px-2 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Gas Test Logs', 'Post-ventilation retest · Zone A', 'M. Das', '14:45', 'overdue'],
                ['Isolation Verification', 'LOTO sign-off · Substation-3', 'F. Ali', '14:50', 'overdue'],
                ['Permit Validation', 'Closeout · PT-1165', 'P. Reddy', '15:00', 'overdue'],
                ['Inspection Completion', 'Crane cert check · Zone D', 'V. Rao', '15:10', 'due'],
                ['Gas Test Logs', 'O2 continuous log · Tank 7', 'K. Iyer', '15:15', 'due'],
                ['Audit Readiness', 'Monthly safety audit pack', 'Safety Ops', '16:00', 'due'],
              ].map((row, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-2 py-2.5 text-xs text-slate-300">{row[0]}</td>
                  <td className="px-2 py-2.5 text-xs text-slate-200">{row[1]}</td>
                  <td className="px-2 py-2.5 text-xs text-slate-300">{row[2]}</td>
                  <td className="px-2 py-2.5 text-xs font-mono text-slate-300">{row[3]}</td>
                  <td className="px-2 py-2.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        row[4] === 'overdue'
                          ? 'bg-red-500/15 text-red-300 border-red-500/30'
                          : 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                      }`}
                    >
                      {row[4]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
