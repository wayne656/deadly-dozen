import { useEffect, useMemo, useState } from "react";
import { PLAN_START } from "../data/program";
import { addDays, formatLong, todayISO } from "../data/dates";
import { setWeight } from "../lib/store";
import { useStore } from "../lib/useStore";
import { WeightChart } from "../components/Charts";

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

export function Body() {
  const state = useStore();
  const today = todayISO();
  const [selected, setSelected] = useState(today);
  const saved = state.weights[selected] ?? "";
  const [draft, setDraft] = useState(saved);

  useEffect(() => {
    setDraft(state.weights[selected] ?? "");
  }, [selected, state.weights]);

  const days = useMemo(() => Array.from({ length: 35 }, (_, i) => addDays(PLAN_START, i)), []);
  const logged = days
    .map((date) => ({ date, weight: Number(state.weights[date]) }))
    .filter((row) => Number.isFinite(row.weight) && row.weight > 0);
  const first = logged[0];
  const last = logged[logged.length - 1];
  const change = first && last ? round1(last.weight - first.weight) : null;

  function save() {
    setWeight(selected, draft.trim());
  }

  function clearDay() {
    setWeight(selected, "");
    setDraft("");
  }

  return (
    <section className="page">
      <p className="kicker">Scale log</p>
      <h1>Body</h1>
      <p className="lede">Morning weigh-ins only. Track the trend, not the bounce.</p>

      <div className="weight-form">
        <div className="weight-form-meta">
          <span className="kicker">{selected === today ? "Today" : "Day"}</span>
          <strong>{formatLong(selected)}</strong>
        </div>
        <label className="field" htmlFor="weight-input">
          <span>Body weight (kg)</span>
          <div className="weight-input-row">
            <input
              id="weight-input"
              inputMode="decimal"
              value={draft}
              placeholder="e.g. 76.2"
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") save();
              }}
            />
            <button type="button" className="btn primary" onClick={save}>
              Save
            </button>
          </div>
        </label>
        {saved ? (
          <button type="button" className="text-btn" onClick={clearDay}>
            Clear this day
          </button>
        ) : (
          <p className="faint">Logs stay on this phone only.</p>
        )}
        <div className="weight-stats">
          <div>
            <span>Logged</span>
            <strong>{last ? `${last.weight.toFixed(1)} kg` : "—"}</strong>
          </div>
          <div>
            <span>Change</span>
            <strong className={change == null ? "" : change <= 0 ? "ok" : "warn"}>
              {change == null ? "—" : `${change > 0 ? "+" : ""}${change} kg`}
            </strong>
          </div>
          <div>
            <span>Entries</span>
            <strong>
              {logged.length}/35
            </strong>
          </div>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 14 }}>
        <WeightChart />
      </div>

      <h3 className="section-title">Log</h3>
      <ul className="weight-log">
        {[...logged].reverse().map((row) => (
          <li key={row.date}>
            <button type="button" onClick={() => setSelected(row.date)}>
              <span>{formatLong(row.date)}</span>
              <strong>{row.weight.toFixed(1)} kg</strong>
            </button>
          </li>
        ))}
      </ul>
      {logged.length === 0 ? <p className="muted">No weigh-ins yet. Save this morning’s number to start the line.</p> : null}

      <h3 className="section-title">Pick a day</h3>
      <div className="day-strip">
        {days.map((date) => (
          <button
            key={date}
            type="button"
            className={`${date === selected ? "on" : ""} ${state.weights[date] ? "has" : ""}`}
            onClick={() => setSelected(date)}
          >
            {formatLong(date).replace(",", "")}
          </button>
        ))}
      </div>
    </section>
  );
}
