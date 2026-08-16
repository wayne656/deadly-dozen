export const RACE_DATE = "2026-09-19";
export const PLAN_START = "2026-08-16";
export const RACE_NAME = "Deadly Dozen Doubles";
export const RACE_CITY = "Melbourne";

export type SessionId = "A" | "B" | "C" | "D" | "E" | "F";
export type SessionKind = "gym" | "run";

export const WEEKS = [
  {
    week: 1,
    name: "Post-US Reset & Baseline",
    load: "80–85% gym load",
    focus: "Establish movement quality. 80–85% gym load.",
    gymNote: "Cap working sets at 80–85% of usual loads. Leave 2–3 reps in reserve.",
    runNote: "8 × 400m. Lock a sustainable target — do not chase a hero first rep.",
    intervalCount: 8,
    strengthSets: 4,
    volume: 1,
  },
  {
    week: 2,
    name: "Volume & Engine Building",
    load: "Progressive overload",
    focus: "Add load where last week's reps were clean. Lock 400m pacing.",
    gymNote: "Add 2.5–5 kg on main lifts if all target reps were hit last week.",
    runNote: "8 × 400m. Hold even splits. Target rest stays 75s.",
    intervalCount: 8,
    strengthSets: 4,
    volume: 1,
  },
  {
    week: 3,
    name: "Peak Muscular Endurance",
    load: "Max Labour density",
    focus: "Highest gym density of the block. Heavy grip work.",
    gymNote: "Keep rest honest on farmers and labour circuits. Density over ego load.",
    runNote: "10 × 400m. Same target as Week 2. Fatigue management is the skill.",
    intervalCount: 10,
    strengthSets: 4,
    volume: 1.1,
  },
  {
    week: 4,
    name: "Race-Pace Hardening",
    load: "High intensity 1:1",
    focus: "Simulate Doubles work:rest. High intensity 1:1.",
    gymNote: "Session F is the priority. Treat transitions like race day.",
    runNote: "10 × 400m at race pace. No fading last three reps.",
    intervalCount: 10,
    strengthSets: 4,
    volume: 1,
  },
  {
    week: 5,
    name: "Taper & Race Week",
    load: "Volume −40%",
    focus: "Drop volume, stay fresh, Race Day Saturday.",
    gymNote: "Drop to 3 working sets. Keep intensity, cut junk volume.",
    runNote: "6 × 400m, crisp and fast. No extra striding after.",
    intervalCount: 6,
    strengthSets: 3,
    volume: 0.6,
  },
] as const;

export const SESSIONS: {
  id: SessionId;
  kind: SessionKind;
  name: string;
  short: string;
  focus: string;
}[] = [
  {
    id: "A",
    kind: "gym",
    name: "Upper Body Strength & Grip",
    short: "Press / carry / HR push-ups",
    focus: "Structural push/pull, Hand-Release Push-Up endurance (Labour 9), and heavy grip (Labour 2).",
  },
  {
    id: "B",
    kind: "run",
    name: "400m Track Intervals",
    short: "Race-pace speed",
    focus: "400m race-pace speed work, anaerobic threshold, and interval tolerance.",
  },
  {
    id: "C",
    kind: "gym",
    name: "Lower Body Strength & Hinge",
    short: "Squat / KB DL / OH lunge",
    focus: "Quad/glute drive for Overhead Lunges (Labour 4) and hamstring power for Kettlebell Deadlifts (Labour 1).",
  },
  {
    id: "D",
    kind: "gym",
    name: "Labour Muscular Endurance",
    short: "Exact race implements",
    focus: "High-rep capacity under fatigue using exact race implements, micro-sets, and 1:1 rest.",
  },
  {
    id: "E",
    kind: "run",
    name: "Zone 2 Aerobic Engine",
    short: "45–60 min easy",
    focus: "Low-heart-rate continuous running to expand aerobic capacity without systemic fatigue.",
  },
  {
    id: "F",
    kind: "gym",
    name: "Full Deadly Dozen Simulation",
    short: "3-round race circuit",
    focus: "Solo Doubles sim: 400m runs paired with 1:1 rest-matched exact station reps.",
  },
];

export const KPI_ROWS = [
  { key: "weight", label: "7-day avg body weight (kg)", goal: "Watch the trend" },
  { key: "interval", label: "400m average interval pace", goal: "Sub-1:45 / lap" },
  { key: "zone2", label: "Zone 2 avg pace (min/km)", goal: "Sustained engine" },
  { key: "bench", label: "Bench press 6-RM (kg)", goal: "Maintain strength" },
  { key: "squat", label: "Back squat 6-RM (kg)", goal: "Preserve leg drive" },
  { key: "circuit", label: "Simulated race circuit time", goal: "Fast transitions" },
  { key: "adherence", label: "Weekly training adherence", goal: "100% (6/6 days)" },
  { key: "energy", label: "Energy & recovery (1–5)", goal: "≥ 4.0" },
] as const;

export const CHECKLIST = [
  { id: "weight", label: "Feeling light and powerful", detail: "Scale trend is down, legs feel snappy." },
  { id: "gear", label: "Gear ready", detail: "Track-grip shoes, race kit, gels for race morning." },
  { id: "pacing", label: "Partner pacing finalized", detail: "Pre-planned rep splits for all 12 Labours." },
] as const;

export const ANALYTICS = [
  {
    title: "Weight trend",
    formula: "Net change = Week 5 avg − Week 1 avg",
    check: "If strength drops > 10% on main lifts, drop a set rather than grinding.",
  },
  {
    title: "Aerobic capacity & speed",
    formula: "400m delta = Week 1 pace − Week 4 pace",
    check: "Target 3–5 seconds faster per interval while holding a stable heart rate.",
  },
  {
    title: "Labour fatigue index",
    formula: "Session F round fade",
    check: "If station times fade > 15% from Round 1 to Round 3, break into 10s earlier.",
  },
];
