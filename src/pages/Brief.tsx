import { ATHLETE, SESSIONS, WEEKS } from "../data/program";
import { daysUntilRace, formatLong, todayISO, weekFromDate } from "../data/dates";
import { calorieTarget } from "../data/nutrition";
import { exercisesFor } from "../data/workouts";
import { getSession, setNav, type PageId } from "../lib/store";
import { useStore } from "../lib/useStore";
import { weekAverage } from "../components/Charts";

export function Brief({ go }: { go: (page: PageId) => void }) {
  useStore();
  const today = todayISO();
  const week = weekFromDate(today);
  const days = daysUntilRace(today);
  const avg = weekAverage(week);
  const fuel = calorieTarget(today);
  const next = SESSIONS.find((session) => !getSession(week, session.id).done) ?? SESSIONS[0];
  const nextEx = exercisesFor(next.id, week);
  const done = SESSIONS.filter((session) => getSession(week, session.id).done).length;

  function startNext() {
    setNav("train", { week, session: next.id, launchPlay: true });
    go("train");
  }

  return (
    <section className="page home">
      <header className="home-head">
        <div>
          <p className="kicker">Melbourne · 19 Sept</p>
          <h1>Deadly Dozen</h1>
        </div>
        <div className="count-chip">
          <b>{days < 0 ? "0" : days}</b>
          <span>days</span>
        </div>
      </header>

      <article className="hero-card">
        <p className="kicker">Your plan</p>
        <h2>Overall race prep</h2>
        <p>4 gym · 2 run · 1 rest · 5 weeks</p>
        <div className="hero-meta">
          <span>{formatLong(today)}</span>
          <span>
            {done}/6 this week
          </span>
        </div>
      </article>

      <button className="btn primary block start-btn" onClick={startNext}>
        {getSession(week, next.id).done ? "Open workout" : "Start workout"}
        <small>
          Session {next.id} · {next.name} · {nextEx.length} movements
        </small>
      </button>

      <div className="stat-row">
        <article>
          <small>Calories</small>
          <strong>{fuel.kcal.toLocaleString("en-AU")}</strong>
          <span>{fuel.tag}</span>
        </article>
        <article>
          <small>Protein</small>
          <strong>{ATHLETE.proteinTarget}g</strong>
          <span>daily lock</span>
        </article>
        <article>
          <small>Weight</small>
          <strong>{avg ? `${avg}` : String(ATHLETE.startKg)}</strong>
          <span>kg avg</span>
        </article>
      </div>

      <h3 className="section-title">Program</h3>
      <div className="timeline">
        {WEEKS.map((item, i) => (
          <button
            key={item.week}
            className={`time-card ${item.week === week ? "current" : ""} ${item.week < week ? "past" : ""}`}
            onClick={() => {
              setNav("train", { week: item.week });
              go("train");
            }}
          >
            <span className="dot">{item.week < week ? "✓" : item.week}</span>
            {i < WEEKS.length - 1 ? <i className="line" /> : null}
            <div className="grow">
              <strong>
                Week {item.week} · {item.name}
              </strong>
              <p>{item.load}</p>
            </div>
            <span className="chev">›</span>
          </button>
        ))}
      </div>
    </section>
  );
}
