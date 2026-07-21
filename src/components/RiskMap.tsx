import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  Wind,
  Skull,
  Zap,
  Users,
  ShieldAlert,
  Footprints,
  X,
  Gauge,
  Thermometer,
  Droplets,
  Map,
} from 'lucide-react';
import { zones, workers, type Zone, type ZoneId } from '@/data/mock';
import { sevColor, sevText } from '@/lib/theme';
import { SeverityBadge } from '@/components/ui';

const hazardIcon: Record<string, typeof Flame> = {
  'Hot work active': Flame,
  'Rising CO trend': Wind,
  'LEL rising': Wind,
  'Low oxygen': Skull,
  'Confined space entry': Skull,
  'Maintenance isolation incomplete': Zap,
  'Arc flash risk': Zap,
  'Intrusion detected': ShieldAlert,
  'Shift change in 25 min': Users,
  'Reduced supervision': Users,
  'Vehicle movement': Footprints,
  'Crowding near gate': Users,
  'Overhead crane ops': Zap,
  'High surface temp': Thermometer,
  'Ventilation low': Wind,
  'Permit conflict': ShieldAlert,
};

export function RiskMap({
  selected,
  onSelect,
}: {
  selected: ZoneId | null;
  onSelect: (z: ZoneId | null) => void;
}) {
  const [showWorkers, setShowWorkers] = useState(true);
  const [showHazards, setShowHazards] = useState(true);
  const [showEvac, setShowEvac] = useState(true);

  const selectedZone = zones.find((z) => z.id === selected) || null;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-4">
      <div className="glass rounded-2xl p-4 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Plant Risk Map</h3>
            <p className="text-xs text-slate-400">Hazira complex · live heatmap with worker & hazard overlay</p>
          </div>
          <div className="flex items-center gap-2">
            <ToggleChip active={showWorkers} onClick={() => setShowWorkers((v) => !v)} icon={<Users size={12} />}>
              Workers
            </ToggleChip>
            <ToggleChip active={showHazards} onClick={() => setShowHazards((v) => !v)} icon={<Flame size={12} />}>
              Hazards
            </ToggleChip>
            <ToggleChip active={showEvac} onClick={() => setShowEvac((v) => !v)} icon={<Footprints size={12} />}>
              Evac routes
            </ToggleChip>
          </div>
        </div>

        <div className="relative rounded-xl overflow-hidden border border-white/10 bg-ink-950 grid-overlay">
          <svg viewBox="0 0 1000 470" className="w-full h-auto block">
            <defs>
              <radialGradient id="heatCritical" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff3b3b" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#ff3b3b" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="heatHigh" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff7a1a" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#ff7a1a" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="heatMedium" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffc24b" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#ffc24b" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="heatLow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#3fd0a0" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#3fd0a0" stopOpacity="0" />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Evacuation routes */}
            {showEvac && (
              <g stroke="#3fd0a0" strokeWidth="2.5" strokeDasharray="8 6" fill="none" opacity="0.7">
                <path d="M225 150 L 60 60" />
                <path d="M450 155 L 60 200" />
                <path d="M640 150 L 980 60" />
                <path d="M460 330 L 60 430" />
                <path d="M680 330 L 980 430" />
              </g>
            )}

            {/* Heatmap halos */}
            {zones.map((z) => {
              const id =
                z.risk === 'critical'
                  ? 'heatCritical'
                  : z.risk === 'high'
                    ? 'heatHigh'
                    : z.risk === 'medium'
                      ? 'heatMedium'
                      : 'heatLow';
              return (
                <circle
                  key={`h-${z.id}`}
                  cx={z.cx}
                  cy={z.cy}
                  r={z.riskScore > 70 ? 110 : 80}
                  fill={`url(#${id})`}
                />
              );
            })}

            {/* Zone polygons */}
            {zones.map((z) => {
              const active = selected === z.id;
              return (
                <g key={z.id} className="cursor-pointer" onClick={() => onSelect(z.id)}>
                  <polygon
                    points={z.poly}
                    fill={sevColor[z.risk]}
                    fillOpacity={active ? 0.28 : 0.14}
                    stroke={sevColor[z.risk]}
                    strokeWidth={active ? 3 : 1.5}
                    style={{ transition: 'all 0.25s' }}
                  />
                  {z.restricted && (
                    <polygon
                      points={z.poly}
                      fill="none"
                      stroke="#ff3b3b"
                      strokeOpacity={0.5}
                      strokeWidth={1.2}
                      strokeDasharray="4 4"
                    />
                  )}
                  <text
                    x={z.cx}
                    y={z.cy - 8}
                    textAnchor="middle"
                    className="fill-slate-100 font-semibold"
                    style={{ fontSize: 14 }}
                  >
                    {z.id}
                  </text>
                  <text
                    x={z.cx}
                    y={z.cy + 8}
                    textAnchor="middle"
                    className="fill-slate-300"
                    style={{ fontSize: 9 }}
                  >
                    {z.name}
                  </text>
                </g>
              );
            })}

            {/* Hazard icons */}
            {showHazards &&
              zones.flatMap((z) =>
                z.hazards.map((h, i) => {
                  const Icon = hazardIcon[h] || Flame;
                  const n = z.hazards.length;
                  const ang = (i / Math.max(1, n)) * Math.PI * 2;
                  const x = z.cx + Math.cos(ang) * 34;
                  const y = z.cy + Math.sin(ang) * 22 + 28;
                  return (
                    <g key={`${z.id}-${i}`} filter="url(#glow)">
                      <circle cx={x} cy={y} r={11} fill="#0b1118" stroke={sevColor[z.risk]} strokeWidth={1.5} />
                      <foreignObject x={x - 8} y={y - 8} width={16} height={16}>
                        <Icon size={16} color={sevColor[z.risk]} />
                      </foreignObject>
                    </g>
                  );
                }),
              )}

            {/* Worker markers */}
            {showWorkers &&
              workers.map((w) => {
                const z = zones.find((zz) => zz.id === w.zone)!;
                const color = w.sos ? '#ff3b3b' : w.ppe ? '#3fd0a0' : '#ff7a1a';
                return (
                  <g key={w.id} className="cursor-pointer">
                    {w.sos && (
                      <circle cx={w.x} cy={w.y} r={9} fill="none" stroke="#ff3b3b" strokeWidth={1.5}>
                        <animate attributeName="r" values="6;14;6" dur="1.6s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.8;0;0.8" dur="1.6s" repeatCount="indefinite" />
                      </circle>
                    )}
                    <circle cx={w.x} cy={w.y} r={5} fill={color} stroke="#0b1118" strokeWidth={1.5} />
                    <circle cx={w.x} cy={w.y} r={2} fill="#0b1118" />
                  </g>
                );
              })}
          </svg>

          {/* Legend */}
          <div className="absolute bottom-3 left-3 glass rounded-lg px-3 py-2 text-[10px] text-slate-300 flex flex-wrap gap-x-4 gap-y-1">
            <Legend color="#ff3b3b" label="Critical" />
            <Legend color="#ff7a1a" label="High" />
            <Legend color="#ffc24b" label="Medium" />
            <Legend color="#3fd0a0" label="Low / Safe" />
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> PPE ok
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-orange-400" /> PPE missing
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-red-500" /> SOS
            </span>
          </div>
        </div>
      </div>

      {/* Side detail panel */}
      <div className="glass rounded-2xl p-4 shadow-card min-h-[300px]">
        <AnimatePresence mode="wait">
          {selectedZone ? (
            <motion.div
              key={selectedZone.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400">Zone {selectedZone.id}</div>
                  <h3 className="text-lg font-bold text-slate-100">{selectedZone.name}</h3>
                  <p className="text-xs text-slate-400">{selectedZone.area}</p>
                </div>
                <button
                  onClick={() => onSelect(null)}
                  className="grid place-items-center h-7 w-7 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <SeverityBadge severity={selectedZone.risk} />
                <span className="text-xs text-slate-400">
                  Risk score{' '}
                  <span className="font-bold" style={{ color: sevColor[selectedZone.risk] }}>
                    {selectedZone.riskScore}
                  </span>
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <MiniStat icon={<Thermometer size={14} />} label="Temp" value={`${selectedZone.temperature}°`} />
                <MiniStat icon={<Droplets size={14} />} label="O2" value={`${selectedZone.oxygen}%`} />
                <MiniStat icon={<Users size={14} />} label="Workers" value={`${selectedZone.workers}`} />
              </div>

              <div className="mb-4">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-2">Gas readings</div>
                {selectedZone.gas.length === 0 && <div className="text-xs text-slate-500">No gas sensors in zone</div>}
                <div className="space-y-2">
                  {selectedZone.gas.map((g) => {
                    const over = g.name === 'O2' ? false : g.ppm > g.limit;
                    return (
                      <div key={g.name} className="flex items-center gap-2">
                        <Gauge size={14} className={over ? 'text-red-400' : 'text-slate-400'} />
                        <span className="text-xs text-slate-300 w-10">{g.name}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.min(100, (g.ppm / Math.max(g.limit, 1)) * 50)}%`,
                              background: over ? '#ff3b3b' : '#3fd0a0',
                            }}
                          />
                        </div>
                        <span className={`text-xs font-mono ${over ? 'text-red-300' : 'text-slate-300'}`}>
                          {g.ppm}
                          <span className="text-slate-500">/{g.limit}</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-2">Active hazards</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedZone.hazards.length === 0 && (
                    <span className="text-xs text-emerald-300">No active hazards</span>
                  )}
                  {selectedZone.hazards.map((h) => {
                    const Icon = hazardIcon[h] || Flame;
                    return (
                      <span
                        key={h}
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-slate-200"
                      >
                        <Icon size={12} style={{ color: sevColor[selectedZone.risk] }} />
                        {h}
                      </span>
                    );
                  })}
                </div>
              </div>

              {selectedZone.restricted && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-xs text-red-200">
                  Restricted area — entry requires validated permit & gas clearance.
                </div>
              )}
            </motion.div>
          ) : (
            <div className="h-full grid place-items-center text-center py-10">
              <div>
                <div className="mx-auto mb-3 grid place-items-center h-12 w-12 rounded-xl bg-white/5 border border-white/10 text-slate-400">
                  <Map size={20} />
                </div>
                <p className="text-sm text-slate-300 font-medium">Select a zone</p>
                <p className="text-xs text-slate-500 mt-1 max-w-[220px]">
                  Click any zone on the plant map to see live risk, gas, workers and hazards.
                </p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ToggleChip({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all focus-ring ${
        active
          ? 'bg-sky-500/20 border-sky-400/40 text-sky-200'
          : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/5 border border-white/10 p-2.5">
      <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase tracking-wider">
        {icon}
        {label}
      </div>
      <div className="text-sm font-bold text-slate-100 mt-1">{value}</div>
    </div>
  );
}

// re-export for Shell typing
export type { Zone, ZoneId };
