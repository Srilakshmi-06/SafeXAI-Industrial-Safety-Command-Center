import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Siren, X, CheckCircle2, Loader2, Circle, Phone, FileText, ShieldX, Footprints, Camera } from 'lucide-react';
import { responseSteps, type ResponseStep } from '@/data/mock';

const stepIcons = [Phone, ShieldX, Footprints, Camera, FileText];

export function EmergencyModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [steps, setSteps] = useState<ResponseStep[]>(responseSteps);

  useEffect(() => {
    if (!open) {
      setSteps(responseSteps);
      return;
    }
    const timers: number[] = [];
    steps.forEach((s, idx) => {
      if (s.status === 'pending') {
        timers.push(
          window.setTimeout(() => {
            setSteps((prev) =>
              prev.map((p, i) =>
                i === idx ? { ...p, status: 'active', time: new Date().toLocaleTimeString('en-IN', { hour12: false }) } : p,
              ),
            );
          }, (idx + 1) * 1200),
        );
        timers.push(
          window.setTimeout(() => {
            setSteps((prev) => prev.map((p, i) => (i === idx ? { ...p, status: 'done' } : p)));
          }, (idx + 1) * 1200 + 900),
        );
      }
    });
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/75 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 12 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong rounded-2xl w-full max-w-lg overflow-hidden border-red-500/40"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-red-500/10">
              <div className="flex items-center gap-3">
                <div className="grid place-items-center h-10 w-10 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300">
                  <Siren size={20} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-red-100">Emergency Response Activated</h3>
                  <p className="text-xs text-red-200/70">Compound risk · Zone A · Boiler-2 spark + rising CO</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="grid place-items-center h-8 w-8 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5">
              <div className="space-y-2.5">
                {steps.map((s, i) => {
                  const Icon = stepIcons[i] || CheckCircle2;
                  return (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        s.status === 'done'
                          ? 'bg-emerald-500/10 border-emerald-500/30'
                          : s.status === 'active'
                            ? 'bg-sky-500/10 border-sky-500/30'
                            : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <div
                        className={`grid place-items-center h-8 w-8 rounded-lg border shrink-0 ${
                          s.status === 'done'
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                            : s.status === 'active'
                              ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                              : 'bg-white/5 border-white/10 text-slate-500'
                        }`}
                      >
                        {s.status === 'done' ? (
                          <CheckCircle2 size={16} />
                        ) : s.status === 'active' ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Circle size={14} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-100">{s.label}</div>
                        {s.time && <div className="text-[10px] font-mono text-slate-400">{s.time}</div>}
                      </div>
                      <Icon size={14} className="text-slate-500" />
                      <span
                        className={`text-[10px] uppercase tracking-wider font-semibold ${
                          s.status === 'done'
                            ? 'text-emerald-300'
                            : s.status === 'active'
                              ? 'text-sky-300'
                              : 'text-slate-500'
                        }`}
                      >
                        {s.status}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-4 rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-100">
                <span className="font-semibold">Auto-actions triggered: </span>
                Permits in Zone A frozen, CCTV evidence preserved, supervisor notified. Evacuation will initiate if
                CO exceeds 50 ppm within 5 minutes.
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-200 text-xs font-semibold hover:bg-white/10"
                >
                  Acknowledge & Close
                </button>
                <button className="flex-1 py-2 rounded-lg bg-red-500/20 border border-red-500/40 text-red-100 text-xs font-semibold hover:bg-red-500/30">
                  Generate Report
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
