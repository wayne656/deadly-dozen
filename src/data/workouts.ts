import { WEEKS, type SessionId } from "./program";

export type ExKind = "strength" | "carry" | "superset" | "checks" | "interval" | "metrics" | "circuit";

export type Muscle = "chest" | "back" | "shoulders" | "arms" | "core" | "quads" | "glutes" | "full" | "cardio" | "grip";

export type ExerciseDef = {
  id: string;
  name: string;
  labour?: string;
  cue: string;
  restSec: number;
  kind: ExKind;
  sets: number;
  target: string;
  muscle: Muscle;
  kgKey?: string;
  repsKey?: string;
  extraKey?: string;
  extraLabel?: string;
  doneKey?: string;
};

export function applyOrder(list: ExerciseDef[], order?: string[]) {
  if (!order?.length) return list;
  const map = new Map(list.map((ex) => [ex.id, ex]));
  const next = order.map((id) => map.get(id)).filter((ex): ex is ExerciseDef => Boolean(ex));
  for (const ex of list) if (!order.includes(ex.id)) next.push(ex);
  return next;
}

export function exercisesFor(session: SessionId, week: number): ExerciseDef[] {
  const strength = WEEKS[week - 1].strengthSets;
  const intervals = WEEKS[week - 1].intervalCount;

  if (session === "A") {
    return [
      {
        id: "bench",
        name: "Barbell bench press",
        cue: "Warm-up first. Leave 1–2 reps in reserve in Week 1.",
        restSec: 120,
        kind: "strength",
        sets: strength,
        target: `${strength} × 6–8`,
        muscle: "chest",
        kgKey: "bench",
        repsKey: "bench",
      },
      {
        id: "row",
        name: "Bent-over barbell rows",
        cue: "Control the eccentric. No bounce off the floor.",
        restSec: 90,
        kind: "strength",
        sets: strength,
        target: `${strength} × 8–10`,
        muscle: "back",
        kgKey: "row",
        repsKey: "row",
      },
      {
        id: "ohp",
        name: "Standing dumbbell overhead press",
        cue: "No layback. Brace before every rep.",
        restSec: 90,
        kind: "strength",
        sets: Math.min(strength, 3),
        target: `${Math.min(strength, 3)} × 8–10`,
        muscle: "shoulders",
        kgKey: "ohp",
        repsKey: "ohp",
      },
      {
        id: "farm",
        name: "Kettlebell farmers carry",
        labour: "Labour 2",
        cue: "40m per set. Squeeze the handles, tall walk.",
        restSec: 75,
        kind: "carry",
        sets: week === 5 ? 3 : 4,
        target: `${week === 5 ? 3 : 4} × 40m`,
        muscle: "grip",
        kgKey: "farm",
        doneKey: "farm",
      },
      {
        id: "core",
        name: "Hand-release push-ups & hanging leg raises",
        labour: "Labour 9",
        cue: "3 rounds. Chest to floor, full hand lift, then raises.",
        restSec: 45,
        kind: "superset",
        sets: 3,
        target: "3 rounds",
        muscle: "core",
        repsKey: "core",
        extraKey: "core",
        extraLabel: "Raises",
      },
    ];
  }

  if (session === "B") {
    return [
      {
        id: "intervals",
        name: "400m race-pace intervals",
        cue: "75s rest. Hold even splits. Do not hero the first rep.",
        restSec: 75,
        kind: "interval",
        sets: intervals,
        target: `${intervals} × 400m`,
        muscle: "cardio",
        repsKey: "r",
      },
    ];
  }

  if (session === "C") {
    return [
      {
        id: "squat",
        name: "Barbell back squat",
        cue: "Leg press if knees are angry. Depth you can own.",
        restSec: 150,
        kind: "strength",
        sets: strength,
        target: `${strength} × 6–8`,
        muscle: "quads",
        kgKey: "squat",
        repsKey: "squat",
      },
      {
        id: "kbdl",
        name: "Heavy kettlebell deadlifts",
        labour: "Labour 1",
        cue: "12–15 reps. Posterior chain, not a bounce.",
        restSec: 90,
        kind: "strength",
        sets: strength,
        target: `${strength} × 12–15`,
        muscle: "glutes",
        kgKey: "kbdl",
        repsKey: "kbdl",
      },
      {
        id: "lunge",
        name: "Overhead walking lunges",
        labour: "Labour 4",
        cue: "20 total steps. Lock the overhead.",
        restSec: 75,
        kind: "strength",
        sets: 3,
        target: "3 × 20 steps",
        muscle: "quads",
        kgKey: "lunge",
        repsKey: "lunge",
      },
      {
        id: "curl",
        name: "Hamstring curls & calf raises",
        cue: "Superset. Full squeeze at the top of both.",
        restSec: 60,
        kind: "superset",
        sets: 3,
        target: "3 supersets",
        muscle: "glutes",
        kgKey: "curl",
        repsKey: "curl",
        extraKey: "calf",
        extraLabel: "Calves",
      },
    ];
  }

  if (session === "D") {
    return [
      {
        id: "plate",
        name: "Weight plate clean & press",
        labour: "Labour 5",
        cue: "4 × 15. 20kg plate. 20s rest.",
        restSec: 20,
        kind: "checks",
        sets: 4,
        target: "4 × 15",
        muscle: "shoulders",
        doneKey: "plate",
      },
      {
        id: "snatch",
        name: "Single-arm dumbbell snatches",
        labour: "Labour 7",
        cue: "10 / side, hand-to-hand. 30s rest.",
        restSec: 30,
        kind: "checks",
        sets: 4,
        target: "4 × 10/side",
        muscle: "full",
        kgKey: "snatch",
        doneKey: "snatch",
      },
      {
        id: "goblet",
        name: "Kettlebell goblet squats",
        labour: "Labour 3",
        cue: "4 × 20, fast tempo. 30s rest.",
        restSec: 30,
        kind: "checks",
        sets: 4,
        target: "4 × 20",
        muscle: "quads",
        kgKey: "goblet",
        doneKey: "goblet",
      },
      {
        id: "thruster",
        name: "Dumbbell thrusters / wall balls",
        labour: "Labour 8",
        cue: "4 × 12–15, partner micro-sets. 25s rest.",
        restSec: 25,
        kind: "checks",
        sets: 4,
        target: "4 × 12–15",
        muscle: "full",
        kgKey: "thruster",
        doneKey: "thruster",
      },
      {
        id: "bear",
        name: "Bear crawl shuttles",
        labour: "Labour 10",
        cue: "4 × 20m. 45s rest.",
        restSec: 45,
        kind: "checks",
        sets: 4,
        target: "4 × 20m",
        muscle: "core",
        doneKey: "bear",
      },
      {
        id: "devil",
        name: "Devil presses",
        labour: "Labour 12",
        cue: "3 × 8–10. Dumbbell burpee snatch/clean.",
        restSec: 60,
        kind: "checks",
        sets: 3,
        target: "3 × 8–10",
        muscle: "full",
        kgKey: "devil",
        doneKey: "devil",
      },
    ];
  }

  if (session === "E") {
    return [
      {
        id: "z2",
        name: "Zone 2 engine run",
        cue: "45–60 min. Conversational. ~130–145 bpm.",
        restSec: 0,
        kind: "metrics",
        sets: 1,
        target: "45–60 min",
        muscle: "cardio",
      },
    ];
  }

  return [
    {
      id: "run",
      name: "Treadmill 400m",
      cue: "Race-pace 400m. If the belt is taken, 500m rower. Walk straight back to your mat.",
      restSec: 15,
      kind: "circuit",
      sets: 3,
      target: "3 rounds",
      muscle: "cardio",
    },
    {
      id: "dl",
      name: "Kettlebell deadlifts",
      labour: "Labour 1",
      cue: "Park one pair of KBs on a mat and stay there. 40 reps as 20 / 15s / 20.",
      restSec: 15,
      kind: "circuit",
      sets: 3,
      target: "40 reps",
      muscle: "glutes",
    },
    {
      id: "lunge",
      name: "Overhead reverse lunges",
      labour: "Labour 4",
      cue: "In place — no walking lane. DBs locked out. 30 total steps as 15 / 15s / 15.",
      restSec: 15,
      kind: "circuit",
      sets: 3,
      target: "30 steps",
      muscle: "quads",
    },
    {
      id: "goblet",
      name: "Kettlebell goblet squats",
      labour: "Labour 3",
      cue: "Same KB as the deadlifts. 40 reps as 20 / 15s / 20.",
      restSec: 15,
      kind: "circuit",
      sets: 3,
      target: "40 reps",
      muscle: "quads",
    },
    {
      id: "burpee",
      name: "Burpees in place",
      labour: "Labour 6",
      cue: "Chest to floor, stand up, small jump. No broad jumps. 20 as 10 / 15s / 10.",
      restSec: 15,
      kind: "circuit",
      sets: 3,
      target: "20 reps",
      muscle: "full",
    },
    {
      id: "carry",
      name: "Plate hug march",
      labour: "Labour 11",
      cue: "Hug a 20kg plate. 40 marching steps in a small loop, or 10m down the walkway and back. Rest 2 min after the round.",
      restSec: 120,
      kind: "circuit",
      sets: 3,
      target: "40 steps",
      muscle: "grip",
    },
  ];
}
