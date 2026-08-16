import type { Muscle } from "../data/workouts";

const LABELS: Record<Muscle, string> = {
  chest: "Chest",
  back: "Back",
  shoulders: "Shoulders",
  arms: "Arms",
  core: "Core",
  quads: "Quads",
  glutes: "Glutes",
  full: "Full body",
  cardio: "Cardio",
  grip: "Grip",
};

export function MuscleIcon({ muscle }: { muscle: Muscle }) {
  const on = (groups: Muscle[]) => (groups.includes(muscle) ? "mus-on" : "mus-off");
  return (
    <span className="mus" title={LABELS[muscle]} aria-label={LABELS[muscle]}>
      <svg viewBox="0 0 32 40" aria-hidden>
        <circle cx="16" cy="5" r="3.2" className="mus-off" />
        <path d="M10 10h12l1.5 8H8.5z" className={on(["chest", "shoulders", "back", "full"])} />
        <path d="M11 18h10v7H11z" className={on(["core", "back", "full"])} />
        <path d="M8.2 10.2 4 16.5 6.2 18l4-7z" className={on(["shoulders", "arms", "grip", "full"])} />
        <path d="M23.8 10.2 28 16.5 25.8 18l-4-7z" className={on(["shoulders", "arms", "grip", "full"])} />
        <path d="M11 25h4.2v12H12z" className={on(["quads", "glutes", "cardio", "full"])} />
        <path d="M16.8 25H21v12h-3.2z" className={on(["quads", "glutes", "cardio", "full"])} />
        <path d="M12 18.5h8v3.2H12z" className={on(["back", "glutes", "full"])} />
      </svg>
    </span>
  );
}

export function muscleLabel(muscle: Muscle) {
  return LABELS[muscle];
}
