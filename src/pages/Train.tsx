import { useCallback, useEffect, useMemo, useState } from "react";
import { SESSIONS, WEEKS, type SessionId } from "../data/program";
import { exercisesFor, type ExerciseDef } from "../data/workouts";
import { getSession, getState, patchSession, setField, setNav } from "../lib/store";
import { useStore } from "../lib/useStore";
import { fmtTime, RestTimer, Stepper } from "../components/PlayerUI";
import { Notes } from "../components/Fields";

type Mode = "list" | "preview" | "play" | "done";

export function Train() {
  const state = useStore();
  const week = state.trainWeek;
  const id = state.trainSession;
  const session = SESSIONS.find((item) => item.id === id)!;
  const meta = WEEKS[week - 1];
  const log = getSession(week, id);
  const exercises = useMemo(() => exercisesFor(id, week), [id, week]);
  const [mode, setMode] = useState<Mode>(getState().launchPlay ? "play" : "list");
  const [exIndex, setExIndex] = useState(0);
  const [rest, setRest] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (getState().launchPlay) setNav("train", { launchPlay: false });
  }, []);

  useEffect(() => {
    if (mode !== "play") return;
    const t = window.setInterval(() => setElapsed((n) => n + 1), 1000);
    return () => window.clearInterval(t);
  }, [mode]);

  function open(sessionId: SessionId) {
    setNav("train", { week, session: sessionId });
    setMode("preview");
    setExIndex(0);
  }

  function start() {
    setElapsed(0);
    setExIndex(0);
    setRest(null);
    setMode("play");
    if (!log.date) patchSession(week, id, { date: new Date().toISOString().slice(0, 10) });
  }

  function finish() {
    patchSession(week, id, { done: true });
    setMode("done");
    setRest(null);
  }

  if (mode === "play") {
    return (
      <Player
        week={week}
        id={id}
        name={session.name}
        exercises={exercises}
        exIndex={exIndex}
        setExIndex={setExIndex}
        rest={rest}
        setRest={setRest}
        elapsed={elapsed}
        onExit={() => setMode("preview")}
        onFinish={finish}
      />
    );
  }

  if (mode === "done") {
    return (
      <section className="page">
        <p className="kicker">Workout complete</p>
        <h1>Nice work</h1>
        <p className="lede">
          Session {id} · {fmtTime(elapsed)} · Week {week}
        </p>
        <button className="btn primary block" onClick={() => setMode("list")}>
          Back to plan
        </button>
      </section>
    );
  }

  if (mode === "preview") {
    return (
      <section className="page">
        <button className="back" onClick={() => setMode("list")}>
          ‹ Plan
        </button>
        <p className="kicker">
          Session {id} · Week {week} · {session.kind}
        </p>
        <h1>{session.name}</h1>
        <p className="lede">{session.focus}</p>
        <p className="banner">{id === "B" || id === "E" ? meta.runNote : meta.gymNote}</p>
        <div className="ex-list">
          {exercises.map((ex, i) => (
            <div className="ex-row" key={ex.id}>
              <span className="ex-num">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <strong>{ex.name}</strong>
                <p>
                  {ex.labour ? `${ex.labour} · ` : ""}
                  {ex.target}
                </p>
              </div>
            </div>
          ))}
        </div>
        <Notes
          label={id === "C" ? "Knee & lower back" : "Notes"}
          value={log.notes}
          onChange={(value) => patchSession(week, id, { notes: value })}
        />
        <button className="btn primary block" onClick={start}>
          {log.done ? "Restart workout" : "Start workout"}
        </button>
      </section>
    );
  }

  return (
    <section className="page">
      <p className="kicker">Week {week} · {meta.name}</p>
      <h1>Workouts</h1>
      <div className="week-pills">
        {WEEKS.map((item) => (
          <button
            key={item.week}
            className={item.week === week ? "on" : ""}
            onClick={() => setNav("train", { week: item.week })}
          >
            {item.week}
          </button>
        ))}
      </div>
      <div className="session-list">
        {SESSIONS.map((item) => {
          const done = getSession(week, item.id).done;
          return (
            <button key={item.id} className={`session-card ${done ? "done" : ""}`} onClick={() => open(item.id)}>
              <span className="badge">{item.id}</span>
              <div className="grow">
                <strong>{item.name}</strong>
                <p>{item.short}</p>
              </div>
              <span className="chev">{done ? "✓" : "›"}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function Player({
  week,
  id,
  name,
  exercises,
  exIndex,
  setExIndex,
  rest,
  setRest,
  elapsed,
  onExit,
  onFinish,
}: {
  week: number;
  id: SessionId;
  name: string;
  exercises: ExerciseDef[];
  exIndex: number;
  setExIndex: (n: number) => void;
  rest: number | null;
  setRest: (n: number | null) => void;
  elapsed: number;
  onExit: () => void;
  onFinish: () => void;
}) {
  useStore();
  const log = getSession(week, id);
  const ex = exercises[exIndex];
  const last = exIndex === exercises.length - 1;

  const skipRest = useCallback(() => setRest(null), [setRest]);

  function val(field: string) {
    return log.fields[field] ?? "";
  }

  function kgField(set: number) {
    if (!ex.kgKey) return "";
    if (["snatch", "goblet", "thruster", "devil"].includes(ex.id)) return `${ex.kgKey}-kg`;
    if (ex.id === "curl") return `curl-s${set}-kg`;
    return `${ex.kgKey}-s${set}-kg`;
  }

  function repsField(set: number) {
    if (ex.kind === "interval") return `r${set}-actual`;
    if (ex.id === "core") return `core-r${set}-hrpu`;
    if (ex.id === "curl") return `curl-s${set}-reps`;
    return `${ex.repsKey}-s${set}-reps`;
  }

  function extraField(set: number) {
    if (ex.id === "core") return `core-r${set}-raises`;
    if (ex.id === "curl") return `calf-s${set}`;
    return "";
  }

  function doneField(set: number) {
    if (ex.kind === "circuit") return `${ex.id}-r${set}-ok`;
    if (ex.kind === "interval") return `r${set}-ok`;
    if (ex.id === "bear") return `bear-s${set}`;
    if (ex.kind === "checks") return `${ex.doneKey}-s${set}`;
    if (ex.kind === "carry") return `${ex.kgKey}-s${set}-done`;
    return `${ex.id}-s${set}-ok`;
  }

  function checked(set: number) {
    const v = val(doneField(set));
    return v === "1" || v === "✓" || v.toLowerCase() === "y" || v.toLowerCase() === "yes";
  }

  function completeSet(set: number) {
    const field = doneField(set);
    const next = checked(set) ? "" : "1";
    setField(week, id, field, next);
    if (next === "1") {
      navigator.vibrate?.(30);
      const isLastSet = set === ex.sets;
      if (!isLastSet && ex.restSec > 0) setRest(ex.restSec);
      else if (isLastSet && !last && ex.restSec > 0) setRest(ex.restSec);
    }
  }

  function nextEx() {
    if (last) onFinish();
    else {
      setExIndex(exIndex + 1);
      setRest(null);
    }
  }

  const sharedKg = ["snatch", "goblet", "thruster", "devil"].includes(ex.id);

  return (
    <section className="player">
      {rest != null ? <RestTimer seconds={rest} onSkip={skipRest} /> : null}
      <header className="player-top">
        <button className="back" onClick={onExit}>
          ‹
        </button>
        <div>
          <p className="kicker">{name}</p>
          <strong>{fmtTime(elapsed)}</strong>
        </div>
        <span className="pill">
          {exIndex + 1}/{exercises.length}
        </span>
      </header>
      <div className="progress">
        <i style={{ width: `${((exIndex + 1) / exercises.length) * 100}%` }} />
      </div>

      <div className="player-ex">
        {ex.labour ? <span className="pill lime">{ex.labour}</span> : null}
        <h1>{ex.name}</h1>
        <p className="lede">{ex.cue}</p>
        <p className="target">{ex.target}</p>
      </div>

      {ex.kind === "metrics" ? (
        <div className="stack">
          {[
            ["distance", "Distance km"],
            ["time", "Time"],
            ["pace", "Pace min/km"],
            ["hr-avg", "Avg HR"],
            ["hr-max", "Max HR"],
          ].map(([field, label]) => (
            <label className="field" key={field}>
              <span>{label}</span>
              <input value={val(field)} onChange={(e) => setField(week, id, field, e.target.value)} />
            </label>
          ))}
        </div>
      ) : (
        <>
          {sharedKg ? (
            <div className="shared-kg">
              <span>Weight</span>
              <Stepper value={val(`${ex.kgKey}-kg`)} onChange={(v) => setField(week, id, `${ex.kgKey}-kg`, v)} step={2.5} unit="kg" />
            </div>
          ) : null}
          <div className="set-list">
            {Array.from({ length: ex.sets }, (_, i) => {
              const set = i + 1;
              const on = checked(set);
              return (
                <div className={`set-card ${on ? "on" : ""}`} key={set}>
                  <span className="set-n">SET {set}</span>
                  <div className="set-controls">
                    {ex.kind === "strength" || ex.kind === "carry" || (ex.kind === "superset" && ex.id === "curl") ? (
                      <Stepper
                        value={val(kgField(set))}
                        onChange={(v) => {
                          setField(week, id, kgField(set), v);
                          if (set < ex.sets && !val(kgField(set + 1))) setField(week, id, kgField(set + 1), v);
                        }}
                        step={2.5}
                        unit="kg"
                      />
                    ) : null}
                    {ex.kind === "strength" || ex.kind === "superset" || ex.kind === "interval" ? (
                      <Stepper
                        value={val(repsField(set))}
                        onChange={(v) => setField(week, id, repsField(set), v)}
                        step={ex.kind === "interval" ? 5 : 1}
                        unit={ex.kind === "interval" ? "sec" : ex.id === "core" ? "HRPU" : "reps"}
                      />
                    ) : null}
                    {ex.kind === "superset" ? (
                      <Stepper
                        value={val(extraField(set))}
                        onChange={(v) => setField(week, id, extraField(set), v)}
                        step={1}
                        unit={ex.extraLabel ?? "reps"}
                      />
                    ) : null}
                    {ex.kind === "circuit" ? (
                      <input
                        className="circuit-in"
                        value={val(`${ex.id}-r${set}`)}
                        placeholder={ex.id === "run" || ex.id === "burpee" ? "time" : "kg"}
                        onChange={(e) => setField(week, id, `${ex.id}-r${set}`, e.target.value)}
                      />
                    ) : null}
                  </div>
                  <button className={`did ${on ? "on" : ""}`} onClick={() => completeSet(set)}>
                    {on ? "✓" : "Did it"}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      <div className="player-nav">
        <button className="btn ghost" disabled={exIndex === 0} onClick={() => setExIndex(Math.max(0, exIndex - 1))}>
          Previous
        </button>
        <button className="btn primary" onClick={nextEx}>
          {last ? "Finish" : "Next"}
        </button>
      </div>
    </section>
  );
}
