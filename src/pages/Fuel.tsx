import { ATHLETE, MACROS, MACRO_SPLITS, MEALS } from "../data/program";
import { todayISO } from "../data/dates";
import { calorieTarget, weekdayDiscount, weeklyAverage } from "../data/nutrition";
import { useState } from "react";

function kcal(n: number) {
  return n.toLocaleString("en-AU");
}

export function Fuel() {
  const today = calorieTarget(todayISO());
  const [menu, setMenu] = useState<"weekday" | "weekend">(today.kind === "weekend" || today.kind === "race" ? "weekend" : "weekday");
  const avg = weeklyAverage();
  const split = MACRO_SPLITS[menu];
  const meals = MEALS[menu];

  return (
    <section className="page">
      <p className="kicker">2,558 maintenance · 76 kg start</p>
      <h1>Fuel</h1>
      <p className="lede">
        Weekly average sits {ATHLETE.avgDeficit} kcal under maintenance. Weekdays are {weekdayDiscount()}% below
        weekends so the deficit happens Mon–Fri and Saturday/Sunday can be a real meal.
      </p>

      <div className="panel cal-today" style={{ marginTop: 18 }}>
        <span className="pill lime">{today.tag} · today</span>
        <div className="metric" style={{ marginTop: 10 }}>
          <small>Today’s calorie target</small>
          <strong>{kcal(today.kcal)}</strong>
        </div>
        <p className="muted">{today.note} Protein stays {ATHLETE.proteinTarget} g either way.</p>
      </div>

      <div className="grid grid-2" style={{ marginTop: 14 }}>
        <article className="panel">
          <small className="faint">WEEKDAY · MON–FRI</small>
          <h3>{kcal(ATHLETE.weekdayKcal)} kcal</h3>
          <p className="muted">
            {ATHLETE.maintenance - ATHLETE.weekdayKcal} kcal below maintenance. 155 g protein · 180 g carbs · 55 g fat.
          </p>
        </article>
        <article className="panel">
          <small className="faint">WEEKEND · SAT–SUN</small>
          <h3>{kcal(ATHLETE.weekendKcal)} kcal</h3>
          <p className="muted">
            Only {ATHLETE.maintenance - ATHLETE.weekendKcal} kcal below maintenance. Same protein, +130 g carbs vs weekdays.
          </p>
        </article>
      </div>

      <div className="panel" style={{ marginTop: 14 }}>
        <h2>Weekly math</h2>
        <div className="cal-bar" aria-hidden>
          <span className="wd" style={{ flex: 5 }} />
          <span className="we" style={{ flex: 2 }} />
        </div>
        <div className="row" style={{ justifyContent: "space-between", marginTop: 8 }}>
          <span className="faint">5 × {kcal(ATHLETE.weekdayKcal)}</span>
          <span className="faint">2 × {kcal(ATHLETE.weekendKcal)}</span>
        </div>
        <div className="grid grid-3" style={{ marginTop: 16 }}>
          <div className="metric">
            <small>Weekly average</small>
            <strong>{kcal(avg)}</strong>
          </div>
          <div className="metric">
            <small>Avg deficit</small>
            <strong>{ATHLETE.maintenance - avg}</strong>
          </div>
          <div className="metric">
            <small>Weekday vs weekend</small>
            <strong>−{weekdayDiscount()}%</strong>
          </div>
        </div>
        <p className="muted" style={{ marginTop: 12 }}>
          5 × {kcal(ATHLETE.weekdayKcal)} + 2 × {kcal(ATHLETE.weekendKcal)} = {kcal(ATHLETE.weekdayKcal * 5 + ATHLETE.weekendKcal * 2)} kcal / week.
          That is the 500–600 kcal daily deficit from the plan, just not spread evenly.
        </p>
      </div>

      <div className="grid grid-2" style={{ marginTop: 14 }}>
        <article className="panel">
          <small className="faint">PROTEIN</small>
          <h3>{MACROS.protein}</h3>
          <p className="muted">Same every day so the weekday cut comes from carbs and a little fat, not muscle.</p>
        </article>
        <article className="panel">
          <small className="faint">CARB TIMING</small>
          <h3>{MACROS.carbTiming}</h3>
        </article>
        <article className="panel">
          <small className="faint">HYDRATION</small>
          <h3>{MACROS.hydration}</h3>
        </article>
        <article className="panel">
          <small className="faint">RACE WEEK OVERRIDE</small>
          <h3>Thu–Fri 2,700 · Race 2,560</h3>
          <p className="muted">Carb load 17–18 Sept. Race day at maintenance. Ignore the weekday deficit those three days.</p>
        </article>
      </div>

      <div className="row" style={{ marginTop: 28, justifyContent: "space-between" }}>
        <h2 style={{ margin: 0 }}>Meal template</h2>
        <div className="seg">
          <button className={menu === "weekday" ? "active" : ""} onClick={() => setMenu("weekday")}>
            Weekday {kcal(ATHLETE.weekdayKcal)}
          </button>
          <button className={menu === "weekend" ? "active" : ""} onClick={() => setMenu("weekend")}>
            Weekend {kcal(ATHLETE.weekendKcal)}
          </button>
        </div>
      </div>
      <p className="muted">
        {menu === "weekday" ? "Mon–Fri template" : "Sat–Sun template"} · {split.protein} g P / {split.carbs} g C / {split.fat} g F · {kcal(split.kcal)} kcal
      </p>
      <div className="grid">
        {meals.map((meal) => (
          <article className="panel" key={`${menu}-${meal.window}`}>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <h3>{meal.window}</h3>
              <span className="pill">{meal.timing}</span>
            </div>
            <p>{meal.content}</p>
            <p className="ok">{meal.macros}</p>
            <p className="muted">{meal.function}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
