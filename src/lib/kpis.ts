import { SESSIONS, type SessionId } from "../data/program";
import { weekAverage } from "../components/Charts";
import { getSession, type SessionLog } from "./store";

function nums(log: SessionLog, keys: string[]) {
  return keys.map((key) => Number(log.fields[key])).filter((n) => Number.isFinite(n) && n > 0);
}

function bestLift(log: SessionLog, prefix: string, minReps = 6) {
  let best = 0;
  for (let i = 1; i <= 4; i++) {
    const kg = Number(log.fields[`${prefix}-s${i}-kg`]);
    const reps = Number(log.fields[`${prefix}-s${i}-reps`]);
    if (!Number.isFinite(kg) || kg <= 0) continue;
    if (Number.isFinite(reps) && reps > 0 && reps < minReps) continue;
    if (kg > best) best = kg;
  }
  return best || null;
}

function avg(values: number[]) {
  if (!values.length) return null;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

function fmtSec(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? `${m}:${String(s).padStart(2, "0")}` : `${s}s`;
}

export type WeekKpis = {
  sessions: string;
  weight: string;
  interval: string;
  zone2: string;
  bench: string;
  squat: string;
  circuit: string;
};

export function computeWeekKpis(week: number): WeekKpis {
  const a = getSession(week, "A" as SessionId);
  const b = getSession(week, "B");
  const c = getSession(week, "C");
  const e = getSession(week, "E");
  const f = getSession(week, "F");
  const done = SESSIONS.filter((session) => getSession(week, session.id).done).length;
  const times = nums(b, Array.from({ length: 10 }, (_, i) => `r${i + 1}-actual`));
  const interval = avg(times);
  const weight = weekAverage(week);
  const bench = bestLift(a, "bench");
  const squat = bestLift(c, "squat");

  return {
    sessions: `${done}/6`,
    weight: weight != null ? `${weight} kg` : "—",
    interval: interval != null ? fmtSec(interval) : "—",
    zone2: e.fields.pace ? `${e.fields.pace}` : "—",
    bench: bench != null ? `${bench} kg` : "—",
    squat: squat != null ? `${squat} kg` : "—",
    circuit: f.fields.total ? f.fields.total : "—",
  };
}
