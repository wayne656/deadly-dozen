import { PLAN_START, WEEKS } from "../data/program";
import { addDays, formatDay, mean, planDayIndex, round1, weekRange } from "../data/dates";
import { getState } from "../lib/store";
import { useStore } from "../lib/useStore";

export function WeightChart({ highlightWeek }: { highlightWeek?: number }) {
  useStore();
  const { weights } = getState();
  const points = Array.from({ length: 35 }, (_, i) => {
    const date = addDays(PLAN_START, i);
    const raw = weights[date];
    const value = raw ? Number(raw) : null;
    return { date, value, day: i + 1 };
  }).filter((p) => p.value && Number.isFinite(p.value)) as { date: string; value: number; day: number }[];

  if (points.length < 1) {
    return <p className="muted">Save your first morning weigh-in to start the trend line.</p>;
  }

  const values = points.map((p) => p.value);
  const min = Math.min(...values) - 0.4;
  const max = Math.max(...values) + 0.4;
  const w = 640;
  const h = 180;
  const pad = 18;
  const x = (day: number) => pad + ((day - 1) / 34) * (w - pad * 2);
  const y = (v: number) => h - pad - ((v - min) / (max - min)) * (h - pad * 2);
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"} ${x(p.day)} ${y(p.value)}`).join(" ");
  const last = points[points.length - 1];
  const first = points[0];
  const delta = round1(last.value - first.value);

  const weekBands = highlightWeek
    ? (() => {
        const { start, end } = weekRange(highlightWeek);
        return { x1: x(planDayIndex(start) + 1), x2: x(planDayIndex(end) + 1) };
      })()
    : null;

  return (
    <div>
      <svg className="chart" viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Body weight trend">
        {weekBands ? (
          <rect x={weekBands.x1} y={pad} width={Math.max(8, weekBands.x2 - weekBands.x1)} height={h - pad * 2} fill="rgba(91,140,255,0.12)" />
        ) : null}
        {WEEKS.map((week) => (
          <text key={week.week} x={x((week.week - 1) * 7 + 1)} y={14} fill="#6d7c99" fontSize="11">
            W{week.week}
          </text>
        ))}
        <path d={d} fill="none" stroke="#5b8cff" strokeWidth="3" />
        {points.map((p) => (
          <circle key={p.date} cx={x(p.day)} cy={y(p.value)} r="3.5" fill="#5b8cff" />
        ))}
      </svg>
      <p className="muted">
        {formatDay(first.date)} {first.value} kg → {formatDay(last.date)} {last.value} kg ·{" "}
        <span className={delta <= 0 ? "ok" : "warn"}>
          {delta > 0 ? "+" : ""}
          {delta} kg
        </span>
      </p>
    </div>
  );
}

export function weekAverage(week: number) {
  const { weights } = getState();
  const { start } = weekRange(week);
  const values = Array.from({ length: 7 }, (_, i) => Number(weights[addDays(start, i)])).filter((n) => Number.isFinite(n) && n > 0);
  const avg = mean(values);
  return avg ? round1(avg) : null;
}
