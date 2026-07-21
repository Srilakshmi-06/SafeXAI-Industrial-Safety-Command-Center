export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type ZoneId =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H';

export interface Zone {
  id: ZoneId;
  name: string;
  area: string;
  risk: Severity;
  riskScore: number; // 0-100
  temperature: number; // °C
  gas: { name: string; ppm: number; limit: number }[];
  oxygen: number; // %
  workers: number;
  permits: number;
  hazards: string[];
  restricted: boolean;
  // SVG polygon points (viewBox 0 0 1000 620)
  poly: string;
  cx: number;
  cy: number;
}

export const zones: Zone[] = [
  {
    id: 'A',
    name: 'Boiler House',
    area: 'Power Block',
    risk: 'critical',
    riskScore: 92,
    temperature: 64,
    gas: [
      { name: 'CO', ppm: 38, limit: 25 },
      { name: 'H2S', ppm: 4, limit: 10 },
    ],
    oxygen: 19.2,
    workers: 14,
    permits: 3,
    hazards: ['Hot work active', 'Rising CO trend', 'High surface temp'],
    restricted: false,
    poly: '120,90 300,70 330,210 140,230',
    cx: 225,
    cy: 150,
  },
  {
    id: 'B',
    name: 'Gas Storage',
    area: 'Tank Farm',
    risk: 'critical',
    riskScore: 88,
    temperature: 41,
    gas: [
      { name: 'CH4', ppm: 1420, limit: 1000 },
      { name: 'LEL', ppm: 22, limit: 20 },
    ],
    oxygen: 20.6,
    workers: 6,
    permits: 2,
    hazards: ['LEL rising', 'Ventilation low', 'Permit conflict'],
    restricted: true,
    poly: '360,80 540,90 520,220 380,230',
    cx: 450,
    cy: 155,
  },
  {
    id: 'C',
    name: 'Confined Tank 7',
    area: 'Tank Farm',
    risk: 'high',
    riskScore: 74,
    temperature: 38,
    gas: [{ name: 'O2', ppm: 0, limit: 0 }],
    oxygen: 17.4,
    workers: 2,
    permits: 1,
    hazards: ['Low oxygen', 'Confined space entry'],
    restricted: true,
    poly: '560,90 720,100 710,210 570,200',
    cx: 640,
    cy: 150,
  },
  {
    id: 'D',
    name: 'Pipe Rack East',
    area: 'Process',
    risk: 'high',
    riskScore: 68,
    temperature: 52,
    gas: [{ name: 'VOC', ppm: 60, limit: 75 }],
    oxygen: 20.8,
    workers: 9,
    permits: 2,
    hazards: ['Maintenance isolation incomplete', 'Overhead crane ops'],
    restricted: false,
    poly: '740,110 920,120 900,240 760,230',
    cx: 830,
    cy: 175,
  },
  {
    id: 'E',
    name: 'Control Room',
    area: 'Utilities',
    risk: 'low',
    riskScore: 18,
    temperature: 23,
    gas: [],
    oxygen: 20.9,
    workers: 11,
    permits: 0,
    hazards: [],
    restricted: false,
    poly: '130,260 320,250 330,400 150,410',
    cx: 230,
    cy: 330,
  },
  {
    id: 'F',
    name: 'Maintenance Bay',
    area: 'Process',
    risk: 'medium',
    riskScore: 46,
    temperature: 35,
    gas: [{ name: 'VOC', ppm: 30, limit: 75 }],
    oxygen: 20.7,
    workers: 18,
    permits: 4,
    hazards: ['Shift change in 25 min', 'Reduced supervision'],
    restricted: false,
    poly: '350,260 560,250 570,400 360,410',
    cx: 460,
    cy: 330,
  },
  {
    id: 'G',
    name: 'Loading Dock',
    area: 'Logistics',
    risk: 'medium',
    riskScore: 52,
    temperature: 33,
    gas: [],
    oxygen: 20.9,
    workers: 12,
    permits: 1,
    hazards: ['Vehicle movement', 'Crowding near gate'],
    restricted: false,
    poly: '590,260 760,250 770,400 600,410',
    cx: 680,
    cy: 330,
  },
  {
    id: 'H',
    name: 'Substation',
    area: 'Utilities',
    risk: 'high',
    riskScore: 71,
    temperature: 44,
    gas: [],
    oxygen: 20.8,
    workers: 4,
    permits: 1,
    hazards: ['Arc flash risk', 'Intrusion detected'],
    restricted: true,
    poly: '790,260 940,260 930,400 800,410',
    cx: 865,
    cy: 330,
  },
];

export interface Worker {
  id: string;
  name: string;
  role: string;
  zone: ZoneId;
  x: number;
  y: number;
  ppe: boolean;
  sos: boolean;
}

export const workers: Worker[] = [
  { id: 'W-1042', name: 'R. Sharma', role: 'Welder', zone: 'A', x: 210, y: 160, ppe: true, sos: false },
  { id: 'W-1043', name: 'A. Khan', role: 'Rigger', zone: 'A', x: 250, y: 140, ppe: false, sos: false },
  { id: 'W-1044', name: 'S. Nair', role: 'Fitter', zone: 'A', x: 235, y: 180, ppe: true, sos: false },
  { id: 'W-1051', name: 'M. Das', role: 'Gas Tester', zone: 'B', x: 440, y: 150, ppe: true, sos: false },
  { id: 'W-1052', name: 'P. Reddy', role: 'Supervisor', zone: 'B', x: 470, y: 170, ppe: true, sos: false },
  { id: 'W-1061', name: 'K. Iyer', role: 'Entry Attendant', zone: 'C', x: 630, y: 150, ppe: true, sos: false },
  { id: 'W-1062', name: 'T. Bose', role: 'Technician', zone: 'C', x: 650, y: 160, ppe: true, sos: false },
  { id: 'W-1071', name: 'V. Rao', role: 'Crane Op', zone: 'D', x: 820, y: 170, ppe: true, sos: false },
  { id: 'W-1072', name: 'H. Singh', role: 'Rigger', zone: 'D', x: 850, y: 190, ppe: true, sos: false },
  { id: 'W-1081', name: 'G. Pillai', role: 'Operator', zone: 'E', x: 220, y: 330, ppe: true, sos: false },
  { id: 'W-1091', name: 'L. Mehta', role: 'Mechanic', zone: 'F', x: 450, y: 320, ppe: true, sos: false },
  { id: 'W-1092', name: 'D. Joshi', role: 'Apprentice', zone: 'F', x: 480, y: 340, ppe: false, sos: false },
  { id: 'W-1101', name: 'N. Gupta', role: 'Driver', zone: 'G', x: 670, y: 330, ppe: true, sos: false },
  { id: 'W-1111', name: 'F. Ali', role: 'Electrician', zone: 'H', x: 860, y: 330, ppe: true, sos: false },
  { id: 'W-1112', name: 'B. Verma', role: 'Helper', zone: 'H', x: 880, y: 350, ppe: true, sos: true },
];

export interface CameraEvent {
  id: string;
  camera: string;
  zone: ZoneId;
  type:
    | 'Person in restricted zone'
    | 'Missing PPE'
    | 'Crowding'
    | 'Smoke / Spark'
    | 'Unsafe proximity'
    | 'Intrusion';
  severity: Severity;
  time: string; // HH:MM
  confidence: number;
  thumb: string; // gradient class
  desc: string;
}

export const cameraEvents: CameraEvent[] = [
  {
    id: 'CAM-2284',
    camera: 'CAM-12 · Boiler South',
    zone: 'A',
    type: 'Smoke / Spark',
    severity: 'critical',
    time: '14:32',
    confidence: 0.94,
    thumb: 'from-red-500/40 to-orange-500/20',
    desc: 'Spark detected near flange during hot work. Adjacent gas reading rising.',
  },
  {
    id: 'CAM-2290',
    camera: 'CAM-04 · Tank Farm',
    zone: 'B',
    type: 'Person in restricted zone',
    severity: 'critical',
    time: '14:30',
    confidence: 0.89,
    thumb: 'from-red-500/40 to-rose-500/20',
    desc: 'Unbadged person inside LEL zone without active permit.',
  },
  {
    id: 'CAM-2271',
    camera: 'CAM-08 · Maintenance Bay',
    zone: 'F',
    type: 'Missing PPE',
    severity: 'high',
    time: '14:28',
    confidence: 0.82,
    thumb: 'from-amber-500/40 to-yellow-500/20',
    desc: 'Worker without high-vis vest near live pipe rack.',
  },
  {
    id: 'CAM-2255',
    camera: 'CAM-21 · Loading Dock',
    zone: 'G',
    type: 'Crowding',
    severity: 'medium',
    time: '14:25',
    confidence: 0.71,
    thumb: 'from-amber-400/40 to-lime-400/20',
    desc: '6 personnel grouped near gate — exceeds zone limit of 4.',
  },
  {
    id: 'CAM-2263',
    camera: 'CAM-15 · Pipe Rack East',
    zone: 'D',
    type: 'Unsafe proximity',
    severity: 'high',
    time: '14:22',
    confidence: 0.78,
    thumb: 'from-orange-500/40 to-amber-500/20',
    desc: 'Rigger within 1.2 m of rotating coupling — safe distance 2.0 m.',
  },
  {
    id: 'CAM-2241',
    camera: 'CAM-30 · Substation',
    zone: 'H',
    type: 'Intrusion',
    severity: 'critical',
    time: '14:19',
    confidence: 0.91,
    thumb: 'from-red-500/40 to-fuchsia-500/20',
    desc: 'After-hours entry detected. No matching permit or badge.',
  },
  {
    id: 'CAM-2233',
    camera: 'CAM-02 · Boiler North',
    zone: 'A',
    type: 'Missing PPE',
    severity: 'medium',
    time: '14:14',
    confidence: 0.66,
    thumb: 'from-amber-400/40 to-orange-400/20',
    desc: 'Face shield not detected during grinding.',
  },
  {
    id: 'CAM-2210',
    camera: 'CAM-19 · Tank 7 Entry',
    zone: 'C',
    type: 'Person in restricted zone',
    severity: 'high',
    time: '14:08',
    confidence: 0.74,
    thumb: 'from-orange-500/40 to-red-500/20',
    desc: 'Entry attendant stepped out — confined space momentarily unattended.',
  },
];

export interface Permit {
  id: string;
  type: 'Hot Work' | 'Confined Space' | 'Excavation' | 'Electrical Isolation' | 'Height Work' | 'Lifting';
  asset: string;
  zone: ZoneId;
  status: 'active' | 'pending' | 'blocked' | 'suspended' | 'expired';
  remaining: string;
  checks: { label: string; done: boolean }[];
  conflict: string | null;
  severity: Severity;
}

export const permits: Permit[] = [
  {
    id: 'PT-2024-1187',
    type: 'Hot Work',
    asset: 'Boiler-2 Flange',
    zone: 'A',
    status: 'active',
    remaining: '1h 12m',
    checks: [
      { label: 'Gas test', done: true },
      { label: 'Fire watch', done: true },
      { label: 'Isolation', done: false },
    ],
    conflict: 'Rising CO in same zone',
    severity: 'critical',
  },
  {
    id: 'PT-2024-1190',
    type: 'Confined Space',
    asset: 'Tank-7',
    zone: 'C',
    status: 'active',
    remaining: '0h 48m',
    checks: [
      { label: 'O2 test', done: true },
      { label: 'Attendant', done: true },
      { label: 'Rescue plan', done: true },
    ],
    conflict: null,
    severity: 'high',
  },
  {
    id: 'PT-2024-1192',
    type: 'Electrical Isolation',
    asset: 'Substation-3',
    zone: 'H',
    status: 'suspended',
    remaining: 'paused',
    checks: [
      { label: 'LOTO', done: true },
      { label: 'Voltage check', done: false },
      { label: 'Sign-off', done: false },
    ],
    conflict: 'Intrusion detected',
    severity: 'critical',
  },
  {
    id: 'PT-2024-1185',
    type: 'Lifting',
    asset: 'Pipe Rack East',
    zone: 'D',
    status: 'active',
    remaining: '2h 05m',
    checks: [
      { label: 'Crane cert', done: true },
      { label: 'Exclusion zone', done: true },
      { label: 'Rigger brief', done: true },
    ],
    conflict: 'Maintenance isolation incomplete',
    severity: 'high',
  },
  {
    id: 'PT-2024-1196',
    type: 'Hot Work',
    asset: 'Gas Storage Vent',
    zone: 'B',
    status: 'blocked',
    remaining: '—',
    checks: [
      { label: 'Gas test', done: false },
      { label: 'Fire watch', done: false },
      { label: 'Isolation', done: false },
    ],
    conflict: 'LEL above threshold',
    severity: 'critical',
  },
  {
    id: 'PT-2024-1180',
    type: 'Height Work',
    asset: 'Maintenance Bay Roof',
    zone: 'F',
    status: 'active',
    remaining: '3h 20m',
    checks: [
      { label: 'Harness', done: true },
      { label: 'Anchor', done: true },
      { label: 'Rescue', done: true },
    ],
    conflict: null,
    severity: 'medium',
  },
  {
    id: 'PT-2024-1198',
    type: 'Excavation',
    asset: 'Loading Dock Trench',
    zone: 'G',
    status: 'pending',
    remaining: 'awaiting',
    checks: [
      { label: 'Utility scan', done: true },
      { label: 'Shoring', done: false },
      { label: 'Gas test', done: false },
    ],
    conflict: null,
    severity: 'medium',
  },
  {
    id: 'PT-2024-1165',
    type: 'Hot Work',
    asset: 'Pipe Rack East',
    zone: 'D',
    status: 'expired',
    remaining: '−0h 22m',
    checks: [
      { label: 'Gas test', done: true },
      { label: 'Fire watch', done: true },
      { label: 'Closeout', done: false },
    ],
    conflict: 'Overdue closeout',
    severity: 'high',
  },
];

export interface CompoundRisk {
  id: string;
  title: string;
  severity: Severity;
  confidence: number;
  zone: ZoneId;
  factors: string[];
  action: string;
  why: string;
}

export const compoundRisks: CompoundRisk[] = [
  {
    id: 'CR-01',
    title: 'Hot Work + Rising Gas',
    severity: 'critical',
    confidence: 0.91,
    zone: 'A',
    factors: ['Active hot work permit PT-1187', 'CO trend +18% in 10 min', 'Surface temp 64°C'],
    action: 'Pause hot work, re-test gas, verify ventilation before resuming.',
    why: 'Hot work ignition source combined with a rising flammable/toxic gas trend exceeds the compound threshold. Even a small leak reaching the work area could ignite.',
  },
  {
    id: 'CR-02',
    title: 'Confined Space + Low Oxygen',
    severity: 'high',
    confidence: 0.84,
    zone: 'C',
    factors: ['Confined space entry active', 'O2 at 17.4% (min 19.5%)', 'Attendant stepped out 14:08'],
    action: 'Evacuate entrant immediately, restore continuous attendant, re-test O2.',
    why: 'Oxygen below 19.5% is immediately dangerous. The momentary absence of the attendant removes the rescue trigger, compounding the risk.',
  },
  {
    id: 'CR-03',
    title: 'Maintenance + Incomplete Isolation',
    severity: 'high',
    confidence: 0.79,
    zone: 'D',
    factors: ['Maintenance permit PT-1185', 'LOTO incomplete on coupling', 'Crane ops overhead'],
    action: 'Halt crane lift over the work area, complete LOTO sign-off before resuming.',
    why: 'Personnel are working under a live load with incomplete energy isolation — a release or drop would strike unprotected workers.',
  },
  {
    id: 'CR-04',
    title: 'Shift Change + Reduced Supervision',
    severity: 'medium',
    confidence: 0.67,
    zone: 'F',
    factors: ['Shift change in 25 min', '2 permits active', 'Apprentice unsupervised'],
    action: 'Brief incoming supervisor, pause new permits until handover signed.',
    why: 'Handover gaps historically correlate with permit violations and missed gas retests during this plant’s incident record.',
  },
  {
    id: 'CR-05',
    title: 'CCTV Intrusion + Permit Mismatch',
    severity: 'critical',
    confidence: 0.88,
    zone: 'H',
    factors: ['Intrusion at Substation CAM-30', 'No matching permit', 'Electrical isolation suspended'],
    action: 'Dispatch response, freeze all electrical permits, preserve CCTV evidence.',
    why: 'An unbadged entry into an energised substation with no permit is both a safety and security event — high likelihood of arc-flash exposure.',
  },
];

export interface Incident {
  id: string;
  date: string;
  title: string;
  type: 'Gas' | 'Permit Conflict' | 'PPE' | 'Fall' | 'Fire' | 'Electrical';
  severity: Severity;
  zone: ZoneId;
  outcome: 'First aid' | 'Near miss' | 'Lost time' | 'Property';
  summary: string;
  rootCause: string;
  prevention: string;
}

export const incidents: Incident[] = [
  {
    id: 'INC-2024-031',
    date: '2024-06-12',
    title: 'CO exposure during boiler flange work',
    type: 'Gas',
    severity: 'high',
    zone: 'A',
    outcome: 'First aid',
    summary: 'Two workers felt dizzy during flange grinding; CO measured 41 ppm.',
    rootCause: 'Gas retest skipped after ventilation change; hot work continued on stale gas test.',
    prevention: 'Mandatory continuous gas monitoring + auto-pause on >25% trend rise.',
  },
  {
    id: 'INC-2024-028',
    date: '2024-05-30',
    title: 'Confined space O2 drop',
    type: 'Gas',
    severity: 'critical',
    zone: 'C',
    outcome: 'Near miss',
    summary: 'Entrant evacuated at 16.8% O2 after attendant left for a break.',
    rootCause: 'Attendant absence + no continuous O2 telemetry.',
    prevention: 'Continuous O2 logging + attendant presence check every 5 min.',
  },
  {
    id: 'INC-2024-022',
    date: '2024-05-04',
    title: 'Crane load swing near pipe rack',
    type: 'Permit Conflict',
    severity: 'high',
    zone: 'D',
    outcome: 'Property',
    summary: 'Lift over incomplete isolation damaged coupling guard.',
    rootCause: 'Lifting and maintenance permits overlapped without exclusion check.',
    prevention: 'Permit conflict matrix blocks simultaneous lift + isolation.',
  },
  {
    id: 'INC-2024-019',
    date: '2024-04-21',
    title: 'Substation unauthorized entry',
    type: 'Electrical',
    severity: 'critical',
    zone: 'H',
    outcome: 'Near miss',
    summary: 'Contractor entered energised substation without permit.',
    rootCause: 'Badge not enforced at gate; CCTV not monitored in real-time.',
    prevention: 'CCTV intrusion + permit cross-check with auto-freeze.',
  },
  {
    id: 'INC-2024-014',
    date: '2024-04-02',
    title: 'Missing PPE during grinding',
    type: 'PPE',
    severity: 'medium',
    zone: 'A',
    outcome: 'First aid',
    summary: 'Eye injury from spark; face shield absent.',
    rootCause: 'PPE check self-certified, not verified.',
    prevention: 'CCTV PPE detection at hot-work zone entry.',
  },
  {
    id: 'INC-2024-009',
    date: '2024-03-18',
    title: 'Gas vent ignition near tank farm',
    type: 'Fire',
    severity: 'critical',
    zone: 'B',
    outcome: 'Property',
    summary: 'Minor flash fire at vent; LEL was 24%.',
    rootCause: 'Hot work permit issued without gas retest after wind change.',
    prevention: 'Wind + LEL coupled trigger that auto-suspends hot work.',
  },
];

export interface ComplianceItem {
  id: string;
  label: string;
  score: number; // 0-100
  target: number;
  overdue: number;
  unit: string;
}

export const compliance: ComplianceItem[] = [
  { id: 'c1', label: 'Permit Validation', score: 82, target: 95, overdue: 3, unit: '%' },
  { id: 'c2', label: 'Gas Test Logs', score: 71, target: 95, overdue: 5, unit: '%' },
  { id: 'c3', label: 'Isolation Verification', score: 64, target: 90, overdue: 4, unit: '%' },
  { id: 'c4', label: 'Inspection Completion', score: 88, target: 95, overdue: 1, unit: '%' },
  { id: 'c5', label: 'Audit Readiness', score: 76, target: 90, overdue: 2, unit: '%' },
];

export interface AlertItem {
  id: string;
  time: string;
  zone: ZoneId;
  title: string;
  severity: Severity;
  status: 'new' | 'ack' | 'resolved';
}

export const alerts: AlertItem[] = [
  { id: 'AL-9001', time: '14:32', zone: 'A', title: 'Smoke / spark on Boiler-2', severity: 'critical', status: 'new' },
  { id: 'AL-9002', time: '14:30', zone: 'B', title: 'Unbadged person in LEL zone', severity: 'critical', status: 'new' },
  { id: 'AL-9003', time: '14:28', zone: 'F', title: 'Missing high-vis vest', severity: 'high', status: 'ack' },
  { id: 'AL-9004', time: '14:25', zone: 'G', title: 'Crowding at loading gate', severity: 'medium', status: 'ack' },
  { id: 'AL-9005', time: '14:19', zone: 'H', title: 'Substation intrusion', severity: 'critical', status: 'new' },
  { id: 'AL-9006', time: '14:08', zone: 'C', title: 'Attendant absence', severity: 'high', status: 'ack' },
  { id: 'AL-9007', time: '13:55', zone: 'D', title: 'Unsafe proximity to coupling', severity: 'high', status: 'resolved' },
];

export interface ResponseStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'done';
  time?: string;
}

export const responseSteps: ResponseStep[] = [
  { id: 's1', label: 'Notify supervisor', status: 'done', time: '14:32:04' },
  { id: 's2', label: 'Freeze affected permits', status: 'done', time: '14:32:18' },
  { id: 's3', label: 'Dispatch response team', status: 'active' },
  { id: 's4', label: 'Initiate evacuation', status: 'pending' },
  { id: 's5', label: 'Preserve CCTV evidence', status: 'pending' },
  { id: 's6', label: 'Generate incident report', status: 'pending' },
];

// Time-series for charts
export const riskTrend = [
  { t: '13:00', risk: 42, gas: 28, permits: 18 },
  { t: '13:15', risk: 48, gas: 33, permits: 19 },
  { t: '13:30', risk: 55, gas: 41, permits: 20 },
  { t: '13:45', risk: 61, gas: 52, permits: 22 },
  { t: '14:00', risk: 70, gas: 64, permits: 24 },
  { t: '14:15', risk: 78, gas: 71, permits: 26 },
  { t: '14:30', risk: 86, gas: 80, permits: 27 },
];

export const incidentByType = [
  { type: 'Gas', count: 14 },
  { type: 'Permit', count: 9 },
  { type: 'PPE', count: 11 },
  { type: 'Fall', count: 4 },
  { type: 'Fire', count: 6 },
  { type: 'Elec', count: 5 },
];

export const incidentByZone = [
  { zone: 'A', count: 9 },
  { zone: 'B', count: 7 },
  { zone: 'C', count: 5 },
  { zone: 'D', count: 6 },
  { zone: 'F', count: 8 },
  { zone: 'H', count: 4 },
];

export const responseTimeBuckets = [
  { bucket: '<1m', v: 6 },
  { bucket: '1-3m', v: 11 },
  { bucket: '3-5m', v: 7 },
  { bucket: '5-10m', v: 4 },
  { bucket: '>10m', v: 2 },
];
