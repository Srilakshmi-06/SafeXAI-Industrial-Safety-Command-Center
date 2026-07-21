import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, X, Map, FileCheck2, Siren, ShieldAlert } from 'lucide-react';
import { Card } from '@/components/ui';
import { zones, permits, compoundRisks, incidents } from '@/data/mock';
import { sevColor } from '@/lib/theme';

interface Msg {
  role: 'user' | 'ai';
  text: string;
}

const prompts = [
  'Why is Zone A red?',
  'Which permits are unsafe?',
  'Show similar incidents.',
  'What action should I take now?',
];

function answer(q: string): string {
  const lower = q.toLowerCase();
  if (lower.includes('zone a')) {
    const z = zones.find((zz) => zz.id === 'A')!;
    return `Zone A (${z.name}) is ${z.risk.toUpperCase()} with a risk score of ${z.riskScore}. Drivers: ${z.hazards.join(
      ', ',
    )}. CO is at 38 ppm (limit 25), surface temperature 64°C, and an active hot-work permit overlaps the rising gas trend. Recommend pausing hot work and re-testing gas before resuming.`;
  }
  if (lower.includes('permit') || lower.includes('unsafe')) {
    const unsafe = permits.filter((p) => p.conflict);
    return `${unsafe.length} permits have conflicts:\n${unsafe
      .map((p) => `• ${p.id} (${p.type}, Zone ${p.zone}) — ${p.conflict}`)
      .join('\n')}\n\nHot Work PT-1187 and Lifting PT-1185 should be frozen pending revalidation.`;
  }
  if (lower.includes('similar') || lower.includes('incident')) {
    return `Matched 3 similar incidents:\n• INC-2024-031 — CO exposure during boiler flange work (Zone A)\n• INC-2024-009 — Gas vent ignition near tank farm (Zone B)\n• INC-2024-014 — Missing PPE during grinding (Zone A)\n\nPattern: skipped gas retests after ventilation/wind change. Prevention: continuous gas telemetry + auto-pause on trend rise.`;
  }
  if (lower.includes('action') || lower.includes('now')) {
    const top = compoundRisks[0];
    return `Highest priority: ${top.title} (Zone ${top.zone}, ${Math.round(top.confidence * 100)}% confidence).\nAction: ${top.action}\nSecondary: verify confined-space attendant presence in Zone C and complete LOTO sign-off in Zone H.`;
  }
  return `I can analyze live zones, permits, CCTV events and incident history. Try: "Why is Zone A red?", "Which permits are unsafe?", or "Show similar incidents."`;
}

export function Copilot() {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: 'ai',
      text: 'Safety Copilot online. I have live context on 8 zones, 8 permits, 8 CCTV events and 6 historical incidents. Ask me anything.',
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { role: 'user', text }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setMsgs((m) => [...m, { role: 'ai', text: answer(text) }]);
      setTyping(false);
    }, 700);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 h-[calc(100vh-7rem)]">
      <Card hover={false} className="p-0 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="grid place-items-center h-9 w-9 rounded-xl bg-gradient-to-br from-sky-500/30 to-emerald-500/20 border border-sky-400/30 text-sky-200">
              <Bot size={18} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100">Safety Copilot</h3>
              <p className="text-[10px] text-slate-400">Context-aware · mock reasoning</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> online
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {msgs.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                  m.role === 'user'
                    ? 'bg-sky-500/20 border border-sky-400/30 text-sky-50'
                    : 'glass text-slate-200'
                }`}
              >
                {m.role === 'ai' && (
                  <div className="flex items-center gap-1.5 text-[10px] text-sky-300 mb-1">
                    <Sparkles size={11} /> SafeXAI
                  </div>
                )}
                {m.text}
              </div>
            </motion.div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="glass rounded-2xl px-3.5 py-2.5 flex gap-1">
                {[0, 1, 2].map((d) => (
                  <motion.span
                    key={d}
                    className="h-1.5 w-1.5 rounded-full bg-sky-300"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: d * 0.15 }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t border-white/10 p-3">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {prompts.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:border-sky-400/30 hover:text-sky-200 transition-all"
              >
                {p}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about zones, permits, incidents…"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-400/40"
            />
            <button
              type="submit"
              className="grid place-items-center h-10 w-10 rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-200 hover:bg-sky-500/30 transition-all"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </Card>

      <Card hover={false} className="p-4 overflow-y-auto">
        <h3 className="text-sm font-semibold text-slate-100 mb-3">Copilot Context</h3>
        <div className="space-y-3">
          <ContextBlock icon={<Map size={13} />} title="Live Zones">
            {zones.map((z) => (
              <div key={z.id} className="flex items-center justify-between text-[11px] py-1">
                <span className="text-slate-300">
                  Zone {z.id} · {z.name}
                </span>
                <span className="font-mono" style={{ color: sevColor[z.risk] }}>
                  {z.riskScore}
                </span>
              </div>
            ))}
          </ContextBlock>
          <ContextBlock icon={<FileCheck2 size={13} />} title="Permit Conflicts">
            {permits
              .filter((p) => p.conflict)
              .map((p) => (
                <div key={p.id} className="text-[11px] text-slate-300 py-1">
                  {p.id} · {p.conflict}
                </div>
              ))}
          </ContextBlock>
          <ContextBlock icon={<Siren size={13} />} title="Top Compound Risks">
            {compoundRisks.slice(0, 3).map((r) => (
              <div key={r.id} className="text-[11px] text-slate-300 py-1">
                {r.title} · Zone {r.zone}
              </div>
            ))}
          </ContextBlock>
          <ContextBlock icon={<ShieldAlert size={13} />} title="Recent Incidents">
            {incidents.slice(0, 3).map((inc) => (
              <div key={inc.id} className="text-[11px] text-slate-300 py-1">
                {inc.title}
              </div>
            ))}
          </ContextBlock>
        </div>
      </Card>
    </div>
  );
}

function ContextBlock({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-400 mb-1.5">
        {icon} {title}
      </div>
      <div>{children}</div>
    </div>
  );
}

export function CopilotDock({ onOpen }: { onOpen: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <AnimatePresence>
      {!open && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          onClick={() => {
            setOpen(true);
            onOpen();
          }}
          className="fixed bottom-5 right-5 z-40 grid place-items-center h-14 w-14 rounded-full bg-gradient-to-br from-sky-500/30 to-emerald-500/20 border border-sky-400/40 text-sky-100 shadow-glow hover:scale-105 transition-transform"
        >
          <Bot size={22} />
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 border-2 border-ink-950 animate-pulse" />
        </motion.button>
      )}
      {open && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setOpen(false)}
          className="fixed bottom-5 right-5 z-40 grid place-items-center h-14 w-14 rounded-full bg-white/10 border border-white/20 text-slate-200"
        >
          <X size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
