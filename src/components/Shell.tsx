import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Map,
  FileCheck2,
  Cctv,
  Siren,
  ShieldCheck,
  Bot,
  Activity,
  Radio,
  AlertTriangle,
  ChevronDown,
  LogOut,
} from 'lucide-react';
import { StatusDot } from '@/components/ui';

export type ViewId =
  | 'overview'
  | 'map'
  | 'permits'
  | 'cctv'
  | 'incidents'
  | 'compliance'
  | 'copilot';

export const navItems: { id: ViewId; label: string; icon: typeof Map }[] = [
  { id: 'overview', label: 'Command Center', icon: LayoutDashboard },
  { id: 'map', label: 'Risk Map', icon: Map },
  { id: 'permits', label: 'Permit Intelligence', icon: FileCheck2 },
  { id: 'cctv', label: 'CCTV Events', icon: Cctv },
  { id: 'incidents', label: 'Incident Intelligence', icon: Siren },
  { id: 'compliance', label: 'Compliance', icon: ShieldCheck },
  { id: 'copilot', label: 'AI Copilot', icon: Bot },
];

export function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

export function Sidebar({
  view,
  onChange,
  mobileOpen,
  onCloseMobile,
}: {
  view: ViewId;
  onChange: (v: ViewId) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}
      <aside
        className={`fixed lg:static z-40 top-0 left-0 h-full w-64 glass-strong border-r border-white/10 flex flex-col transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center gap-3 px-5 h-16 border-b border-white/10">
          <div className="grid place-items-center h-9 w-9 rounded-xl bg-gradient-to-br from-sky-500/30 to-emerald-500/20 border border-sky-400/30 text-sky-200">
            <ShieldCheck size={18} />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold tracking-tight text-grad">SafeXAI</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Safety Command</div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onChange(item.id);
                  onCloseMobile();
                }}
                className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all focus-ring ${
                  active
                    ? 'text-sky-100 bg-sky-500/15 border border-sky-400/30'
                    : 'text-slate-300 hover:bg-white/5 border border-transparent'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="navActive"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-sky-400"
                  />
                )}
                <Icon size={17} className={active ? 'text-sky-300' : 'text-slate-400'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-white/10 space-y-3">
          <div className="glass rounded-xl p-3 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300 font-medium">System Status</span>
              <StatusDot tone="green" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Radio size={12} className="text-emerald-400" /> Sensors 42/42
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Cctv size={12} className="text-emerald-400" /> Cameras 30/30
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Activity size={12} className="text-emerald-400" /> Telemetry OK
              </div>
              <div className="flex items-center gap-1.5 text-amber-300">
                <AlertTriangle size={12} /> 3 critical
              </div>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 text-center">
            v1.0 · Frontend prototype · Mock data
          </div>
        </div>
      </aside>
    </>
  );
}

export function Topbar({
  onMenu,
  onEmergency,
  userName,
  userEmail,
  onSignOut,
}: {
  onMenu: () => void;
  onEmergency: () => void;
  userName: string;
  userEmail: string;
  onSignOut: () => void;
}) {
  const now = useClock();
  const [menuOpen, setMenuOpen] = useState(false);
  const time = now.toLocaleTimeString('en-IN', { hour12: false });
  const date = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const initials = userName
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <header className="sticky top-0 z-20 h-16 glass-strong border-b border-white/10 flex items-center gap-3 px-4 lg:px-6">
      <button
        onClick={onMenu}
        className="lg:hidden grid place-items-center h-9 w-9 rounded-lg bg-white/5 border border-white/10 text-slate-300"
        aria-label="Open menu"
      >
        <LayoutDashboard size={18} />
      </button>

      <div className="flex items-center gap-2">
        <span className="relative inline-block h-2.5 w-2.5 rounded-full bg-emerald-400 dot-pulse text-emerald-400" />
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">Live</span>
        <span className="hidden sm:inline text-xs text-slate-400">· Hazira Plant, Gujarat</span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
          <span className="font-mono text-slate-200">{time}</span>
          <span>·</span>
          <span>{date}</span>
        </div>
        <button
          onClick={onEmergency}
          className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/15 border border-red-500/40 text-red-200 text-xs font-semibold hover:bg-red-500/25 transition-all"
        >
          <Siren size={14} className="group-hover:animate-pulse" />
          Emergency
        </button>
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 hover:border-white/20 transition-colors pl-1.5 pr-2.5 py-1.5"
          >
            <div className="grid place-items-center h-7 w-7 rounded-full bg-gradient-to-br from-sky-500/40 to-emerald-500/30 border border-white/10 text-xs font-bold text-sky-100">
              {initials}
            </div>
            <span className="hidden sm:block text-xs text-slate-200 font-medium max-w-[120px] truncate">
              {userName}
            </span>
            <ChevronDown size={14} className={`text-slate-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 z-40 w-56 glass-strong rounded-xl shadow-card p-2 origin-top-right"
                >
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <div className="text-xs font-semibold text-slate-100 truncate">{userName}</div>
                    <div className="text-[10px] text-slate-400 truncate">{userEmail}</div>
                    <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Safety Officer
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onSignOut();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-white/5 hover:text-slate-100 transition-colors"
                  >
                    <LogOut size={14} /> Sign out
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
