import { CHECKLIST, WEEKS } from "../data/program";
import { todayISO, weekFromDate } from "../data/dates";
import { toggleCheck } from "../lib/store";
import { useStore } from "../lib/useStore";
import { computeWeekKpis } from "../lib/kpis";
import { useState } from "react";

const METRICS = [
  { key: "sessions", label: "Sessions" },
  { key: "weight", label: "Weight avg" },
  { key: "interval", label: "400m avg" },
  { key: "zone2", label: "Zone 2 pace" },
  { key: "bench", label: "Bench" },
  { key: "squat", label: "Squat" },
  { key: "circuit", label: "Circuit" },
] as const;

export function Race() {
  const state = useStore();
  const [week, setWeek] = useState(() => weekFromDate(todayISO()));
  const kpis = computeWeekKpis(week);

  return (
    <section className="page">
      <p className="kicker">Melbourne · Saturday 19 Sept</p>
      <h1>Race week</h1>
      <p className="lede">Checklist plus auto stats from your session logs.</p>

      <h2 style={{ marginTop: 24 }}>Readiness</h2>
      <div className="grid">
        {CHECKLIST.map((item) => (
          <button
            key={item.id}
            className={`check ${state.checklist[item.id] ? "on" : ""}`}
            onClick={() => toggleCheck(item.id)}
          >
            <span className="box" />
            <span>
              <strong>{item.label}</strong>
              <p className="muted" style={{ margin: "4px 0 0" }}>{item.detail}</p>
            </span>
          </button>
        ))}
      </div>

      <h2 style={{ marginTop: 28 }}>This block</h2>
      <div className="week-pills">
        {WEEKS.map((item) => (
          <button key={item.week} className={item.week === week ? "on" : ""} onClick={() => setWeek(item.week)}>
            {item.week}
          </button>
        ))}
      </div>
      <div className="kpi-card">
        {METRICS.map((row) => (
          <div className="kpi-row" key={row.key}>
            <span>{row.label}</span>
            <strong>{kpis[row.key]}</strong>
          </div>
        ))}
      </div>
      <p className="faint">Fills in after you tick sets and mark sessions complete. Weight comes from Body.</p>
    </section>
  );
}
