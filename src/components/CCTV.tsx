import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cctv, Maximize2, X, Play } from 'lucide-react';
import { Card, SectionTitle, SeverityBadge, Chip } from '@/components/ui';
import { cameraEvents, type CameraEvent } from '@/data/mock';
import { sevColor } from '@/lib/theme';

const filters = ['All', 'Critical', 'High', 'Medium'] as const;

export function CCTV() {
  const [filter, setFilter] = useState<(typeof filters)[number]>('All');
  const [active, setActive] = useState<CameraEvent | null>(null);

  const list = cameraEvents.filter((e) =>
    filter === 'All' ? true : e.severity === filter.toLowerCase(),
  );

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <SectionTitle
          title="CCTV Safety Events"
          subtitle="Real-time AI vision detections across 30 cameras"
          icon={<Cctv size={16} />}
          right={
            <div className="flex items-center gap-2">
              {filters.map((f) => (
                <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>
                  {f}
                </Chip>
              ))}
            </div>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {list.map((e, i) => (
            <motion.button
              key={e.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => setActive(e)}
              className="text-left rounded-xl overflow-hidden border border-white/10 bg-ink-900 hover:border-white/25 transition-all group focus-ring"
            >
              <div className={`relative h-28 bg-gradient-to-br ${e.thumb} scanlines`}>
                <div className="absolute inset-0 grid-overlay opacity-40" />
                <div className="absolute top-2 left-2 flex items-center gap-1 text-[9px] font-mono text-white/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" /> REC
                </div>
                <div className="absolute top-2 right-2 text-[9px] font-mono text-white/70">{e.time}</div>
                <div className="absolute bottom-2 left-2 text-[9px] font-mono text-white/80">{e.camera}</div>
                <div className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="grid place-items-center h-10 w-10 rounded-full bg-black/40 border border-white/30 backdrop-blur-sm">
                    <Play size={16} className="text-white ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2">
                  <span
                    className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                    style={{ background: `${sevColor[e.severity]}22`, color: sevColor[e.severity] }}
                  >
                    {Math.round(e.confidence * 100)}%
                  </span>
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-100">{e.type}</span>
                  <SeverityBadge severity={e.severity} />
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-2">{e.desc}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </Card>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              onClick={(ev) => ev.stopPropagation()}
              className="glass-strong rounded-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className={`relative h-64 bg-gradient-to-br ${active.thumb} scanlines`}>
                <div className="absolute inset-0 grid-overlay opacity-30" />
                <div className="absolute top-3 left-3 flex items-center gap-2 text-xs font-mono text-white/80">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" /> LIVE · {active.camera}
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <Maximize2 size={16} className="text-white/70" />
                  <button
                    onClick={() => setActive(null)}
                    className="grid place-items-center h-8 w-8 rounded-lg bg-black/40 border border-white/20 text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="absolute bottom-3 left-3 text-xs font-mono text-white/80">
                  Zone {active.zone} · {active.time} · confidence {Math.round(active.confidence * 100)}%
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-slate-100">{active.type}</h3>
                  <SeverityBadge severity={active.severity} />
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">{active.desc}</p>
                <div className="grid sm:grid-cols-3 gap-2 text-xs">
                  <Field label="Event ID" value={active.id} />
                  <Field label="Camera" value={active.camera} />
                  <Field label="Zone" value={`Zone ${active.zone}`} />
                </div>
                <div className="mt-4 rounded-xl bg-sky-500/10 border border-sky-500/30 p-3 text-xs text-sky-100">
                  <span className="font-semibold">AI assessment: </span>
                  Event correlates with an active permit in zone {active.zone}. Recommend supervisor acknowledgment
                  and evidence preservation.
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/5 border border-white/10 p-2.5">
      <div className="text-[10px] uppercase tracking-wider text-slate-400">{label}</div>
      <div className="text-xs font-mono text-slate-200 mt-0.5">{value}</div>
    </div>
  );
}
