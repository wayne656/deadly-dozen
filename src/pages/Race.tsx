import { ANALYTICS, CHECKLIST, KPI_ROWS } from "../data/program";
import { getKpi, setKpi, toggleCheck } from "../lib/store";
import { useStore } from "../lib/useStore";
import { weekAverage } from "../components/Charts";

export function Race() {
  const state = useStore();

  return (
    <section className="page">
      <p className="kicker">Melbourne · Saturday 19 Sept</p>
      <h1>Race week</h1>
      <p className="lede">Taper volume, stay fresh, lock the doubles pacing plan. Fill KPIs as each week closes.</p>

      <h2 style={{ marginTop: 24 }}>Readiness checklist</h2>
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

      <h2 style={{ marginTop: 28 }}>Weekly KPIs</h2>
      <div className="panel" style={{ overflowX: "auto" }}>
        <table className="table">
          <thead>
            <tr>
              <th>Metric</th>
              {[1, 2, 3, 4, 5].map((week) => (
                <th key={week}>W{week}</th>
              ))}
              <th>Goal</th>
            </tr>
          </thead>
          <tbody>
            {KPI_ROWS.map((row) => (
              <tr key={row.key}>
                <td>{row.label}</td>
                {[1, 2, 3, 4, 5].map((week) => (
                  <td key={week}>
                    <input
                      value={getKpi(week, row.key)}
                      placeholder={row.key === "weight" ? (weekAverage(week) != null ? String(weekAverage(week)) : "kg") : ""}
                      onChange={(e) => setKpi(week, row.key, e.target.value)}
                    />
                  </td>
                ))}
                <td className="muted">{row.goal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={{ marginTop: 28 }}>How to read the block</h2>
      <div className="grid">
        {ANALYTICS.map((item) => (
          <article className="panel" key={item.title}>
            <h3>{item.title}</h3>
            <p className="ok">{item.formula}</p>
            <p className="muted">{item.check}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
