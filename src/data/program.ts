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
    focus: "Clean intake, reset sodium, establish movement quality.",
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
    focus: "Simulate Doubles work:rest. Keep the deficit strict.",
    gymNote: "Session F is the priority. Treat transitions like race day.",
    runNote: "10 × 400m at race pace. No fading last three reps.",
    intervalCount: 10,
    strengthSets: 4,
    volume: 1,
  },
  {
    week: 5,
    name: "Taper & Carb Load",
    load: "Volume −40%",
    focus: "Glycogen topping, freshness, Race Day Saturday.",
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

export const ATHLETE = {
  startKg: 76,
  targetKg: [72, 73] as const,
  maintenance: 2558,
  avgDeficit: 550,
  weekdayKcal: 1830,
  weekendKcal: 2450,
  carbLoadKcal: 2700,
  raceDayKcal: 2560,
  proteinG: [140, 165] as const,
  proteinTarget: 155,
};

export const MACROS = {
  deficit: "550 kcal below 2,558 maintenance on a weekly average",
  fatLoss: "0.6–0.8 kg / week from 76 kg",
  protein: "1.8–2.2 g/kg at 76 kg → 140–165 g (lock 155 g daily)",
  carbTiming: "50–60% of daily carbs in the pre- and post-workout windows",
  hydration: "3.5–4.0 L water + 1 scoop electrolytes",
};

export const MACRO_SPLITS = {
  weekday: { kcal: 1830, protein: 155, carbs: 180, fat: 55 },
  weekend: { kcal: 2450, protein: 155, carbs: 310, fat: 65 },
  carbLoad: { kcal: 2700, protein: 155, carbs: 390, fat: 50 },
};

export const MEALS = {
  weekday: [
    {
      window: "Pre-Workout",
      timing: "30 mins prior",
      content: "1 rice cake + 10g honey OR ½ banana + black coffee",
      macros: "~100 kcal",
      function: "Fast glucose to top up liver glycogen without stomach distress.",
    },
    {
      window: "Post-Workout",
      timing: "Within 45 mins",
      content: "1 scoop whey/plant protein + 5g creatine + 50g oats/rice flakes",
      macros: "~340 kcal · 30g P / 50g C",
      function: "Immediate repair and muscle-cell hydration via creatine.",
    },
    {
      window: "Lunch",
      timing: "Mid-day",
      content: "200g lean chicken/white fish + 180g cooked rice/sweet potato + unlimited greens",
      macros: "~520 kcal · 45g P / 50g C",
      function: "High-volume meal to hold energy and prevent the afternoon slump.",
    },
    {
      window: "Afternoon Snack",
      timing: "3:30 PM",
      content: "200g 0% Greek yogurt / cottage cheese + 15g almonds",
      macros: "~220 kcal · 22g P / 10g F",
      function: "Slow casein to keep nitrogen balance positive.",
    },
    {
      window: "Dinner",
      timing: "Evening",
      content: "200g extra-lean turkey/salmon + mixed salad + 1 tbsp olive oil + 80g potatoes",
      macros: "~650 kcal · 40g P",
      function: "Hits the 1,830 weekday cap without starving the evening.",
    },
  ],
  weekend: [
    {
      window: "Pre-Workout",
      timing: "30 mins prior",
      content: "1 banana + 15g honey + black coffee",
      macros: "~170 kcal",
      function: "Slightly bigger glycogen top-up for the longer weekend sessions.",
    },
    {
      window: "Post-Workout",
      timing: "Within 45 mins",
      content: "1 scoop protein + 5g creatine + 80g oats/rice flakes",
      macros: "~430 kcal · 32g P / 70g C",
      function: "Most of the extra weekend calories land here as carbs.",
    },
    {
      window: "Lunch",
      timing: "Mid-day",
      content: "200g chicken/fish + 250g cooked rice/pasta + greens",
      macros: "~700 kcal · 45g P / 80g C",
      function: "Social-meal sized, still protein-first.",
    },
    {
      window: "Afternoon Snack",
      timing: "3:30 PM",
      content: "200g yogurt + banana + 20g almonds",
      macros: "~380 kcal · 24g P",
      function: "Bridges to dinner without grazing.",
    },
    {
      window: "Dinner",
      timing: "Evening",
      content: "200g turkey/salmon + 200g rice/potato + salad + 1 tbsp olive oil",
      macros: "~770 kcal · 40g P",
      function: "Weekend dinner can be a real meal. Keep sauces and alcohol inside the 2,450 cap.",
    },
  ],
};

export const KPI_ROWS = [
  { key: "weight", label: "7-day avg body weight (kg)", goal: "76 → 72–73 kg" },
  { key: "interval", label: "400m average interval pace", goal: "Sub-1:45 / lap" },
  { key: "zone2", label: "Zone 2 avg pace (min/km)", goal: "Sustained engine" },
  { key: "bench", label: "Bench press 6-RM (kg)", goal: "Maintain strength" },
  { key: "squat", label: "Back squat 6-RM (kg)", goal: "Preserve leg drive" },
  { key: "circuit", label: "Simulated race circuit time", goal: "Fast transitions" },
  { key: "adherence", label: "Weekly training adherence", goal: "100% (6/6 days)" },
  { key: "energy", label: "Energy & recovery (1–5)", goal: "≥ 4.0" },
] as const;

export const CHECKLIST = [
  { id: "weight", label: "Weight target met", detail: "3.0–4.0 kg down from 76 kg (72–73 kg), feeling light and powerful." },
  { id: "carbs", label: "Carb load completed", detail: "2,700 kcal on 17 & 18 Sept. Low fibre, low fat, high carb." },
  { id: "hydration", label: "Hydration locked", detail: "4 L daily water + electrolytes through 18 Sept." },
  { id: "gear", label: "Gear ready", detail: "Track-grip shoes, race kit, electrolyte gel shots for race morning." },
  { id: "pacing", label: "Partner pacing finalized", detail: "Pre-planned rep splits for all 12 Labours." },
] as const;

export const ANALYTICS = [
  {
    title: "Weight loss & muscle preservation",
    formula: "Net change = Week 5 avg − Week 1 avg",
    check: "If strength drops > 10% on main lifts, add +20g carbs to the pre-workout window.",
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
