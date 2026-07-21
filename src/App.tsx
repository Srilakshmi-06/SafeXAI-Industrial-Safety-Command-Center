import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar, Topbar, type ViewId } from '@/components/Shell';
import { Overview } from '@/components/Overview';
import { RiskMap } from '@/components/RiskMap';
import { Permits } from '@/components/Permits';
import { CCTV } from '@/components/CCTV';
import { Incidents } from '@/components/Incidents';
import { Compliance } from '@/components/Compliance';
import { Copilot, CopilotDock } from '@/components/Copilot';
import { EmergencyModal } from '@/components/EmergencyModal';
import { AuthScreen } from '@/components/AuthScreen';
import { useAuth } from '@/lib/auth';
import type { ZoneId } from '@/data/mock';

const titles: Record<ViewId, { title: string; sub: string }> = {
  overview: { title: 'Safety Command Center', sub: 'Live overview of plant-wide safety posture' },
  map: { title: 'Geospatial Risk Map', sub: 'Heatmap, workers, hazards and evacuation routes' },
  permits: { title: 'Permit Intelligence', sub: 'Permit-to-work validation and conflict detection' },
  cctv: { title: 'CCTV Safety Events', sub: 'AI vision detections across the plant' },
  incidents: { title: 'Incident Intelligence', sub: 'Historical patterns and AI cause analysis' },
  compliance: { title: 'Compliance Dashboard', sub: 'Pillar scores, gaps and overdue actions' },
  copilot: { title: 'AI Safety Copilot', sub: 'Natural-language safety assistant' },
};

export default function App() {
  const { user, signOut } = useAuth();
  const [view, setView] = useState<ViewId>('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [emergency, setEmergency] = useState(false);
  const [selectedZone, setSelectedZone] = useState<ZoneId | null>(null);

  const t = titles[view];

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div className="app-bg min-h-screen text-slate-100">
      <div className="flex">
        <Sidebar
          view={view}
          onChange={setView}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        <div className="flex-1 min-w-0 flex flex-col">
          <Topbar
            onMenu={() => setMobileOpen(true)}
            onEmergency={() => setEmergency(true)}
            userName={user.name}
            userEmail={user.email}
            onSignOut={signOut}
          />

          <main className="flex-1 p-4 lg:p-6 max-w-[1600px] w-full mx-auto">
            <div className="mb-5">
              <motion.h1
                key={view}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl lg:text-2xl font-bold text-grad"
              >
                {t.title}
              </motion.h1>
              <p className="text-xs text-slate-400 mt-1">{t.sub}</p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {view === 'overview' && <Overview onJump={(v) => setView(v)} />}
                {view === 'map' && <RiskMap selected={selectedZone} onSelect={setSelectedZone} />}
                {view === 'permits' && <Permits />}
                {view === 'cctv' && <CCTV />}
                {view === 'incidents' && <Incidents />}
                {view === 'compliance' && <Compliance />}
                {view === 'copilot' && <Copilot />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <CopilotDock onOpen={() => setView('copilot')} />
      <EmergencyModal open={emergency} onClose={() => setEmergency(false)} />
    </div>
  );
}
