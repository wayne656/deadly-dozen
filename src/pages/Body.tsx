import { ATHLETE, WEEKS } from "../data/program";
import { addDays, formatDay, weekRange } from "../data/dates";
import { setWeight } from "../lib/store";
import { useStore } from "../lib/useStore";
import { weekAverage, WeightChart } from "../components/Charts";

export function Body() {
  const state = useStore();

  return (
    <section className="page">
      <p className="kicker">Morning weigh-in</p>
      <h1>Body</h1>
      <p className="lede">
        Start {ATHLETE.startKg} kg. Target 72–73 kg by race week (3–4 kg). Weigh after the bathroom, before food or water.
      </p>

      <div className="panel" style={{ marginTop: 18 }}>
        <h2>Trend</h2>
        <WeightChart />
      </div>

      {WEEKS.map((week) => {
        const { start } = weekRange(week.week);
        const avg = weekAverage(week.week);
        const prev = week.week > 1 ? weekAverage(week.week - 1) : null;
        const change = avg && prev ? Math.round((avg - prev) * 10) / 10 : null;
        return (
          <div className="panel" key={week.week} style={{ marginTop: 14 }}>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <h3>
                Week {week.week} · {week.name}
              </h3>
              <span className="pill">
                Avg {avg ?? "—"} kg
                {change != null ? ` · ${change > 0 ? "+" : ""}${change}` : ""}
              </span>
            </div>
            <div className="weight-grid" style={{ marginTop: 12 }}>
              {Array.from({ length: 7 }, (_, i) => {
                const date = addDays(start, i);
                const race = week.week === 5 && i === 6;
                return (
                  <label className="day-cell" key={date}>
                    <small>
                      {race ? "RACE DAY" : formatDay(date)}
                    </small>
                    <input
                      inputMode="decimal"
                      value={state.weights[date] ?? ""}
                      placeholder={week.week === 1 && i === 0 ? String(ATHLETE.startKg) : "kg"}
                      onChange={(e) => setWeight(date, e.target.value)}
                    />
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
}
