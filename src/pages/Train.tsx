import { useCallback, useEffect, useMemo, useState } from "react";
import { SESSIONS, WEEKS, type SessionId } from "../data/program";
import { applyOrder, exercisesFor, type ExerciseDef } from "../data/workouts";
import { getSession, getState, patchSession, setField, setNav, setSessionOrder } from "../lib/store";
import { useStore } from "../lib/useStore";
import { fmtTime, RestTimer, Stepper } from "../components/PlayerUI";
import { MuscleIcon, muscleLabel } from "../components/MuscleIcon";
import { Notes } from "../components/Fields";

type Mode = "list" | "preview" | "play" | "done";

export function Train() {
  const state = useStore();
  const week = state.trainWeek;
  const id = state.trainSession;
  const session = SESSIONS.find((item) => item.id === id)!;
  const meta = WEEKS[week - 1];
  const log = getSession(week, id);
  const base = useMemo(() => exercisesFor(id, week), [id, week]);
  const exercises = useMemo(() => applyOrder(base, log.order), [base, log.order]);
  const [mode, setMode] = useState<Mode>(getState().launchPlay ? "play" : "list");
  const [exId, setExId] = useState(exercises[0]?.id ?? "");
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

  useEffect(() => {
    if (!exercises.some((ex) => ex.id === exId)) setExId(exercises[0]?.id ?? "");
  }, [exercises, exId]);

  function open(sessionId: SessionId) {
    setNav("train", { week, session: sessionId });
    setMode("preview");
    setExId(exercisesFor(sessionId, week)[0]?.id ?? "");
  }

  function start() {
    setElapsed(0);
    setExId(exercises[0]?.id ?? "");
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
        exId={exId}
        setExId={setExId}
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
        <p className="muted">Race KPIs update from this log automatically.</p>
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
              <MuscleIcon muscle={ex.muscle} />
              <div>
                <strong>{ex.name}</strong>
                <p>
                  {muscleLabel(ex.muscle)}
                  {ex.labour ? ` · ${ex.labour}` : ""} · {ex.target}
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
  exId,
  setExId,
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
  exId: string;
  setExId: (id: string) => void;
  rest: number | null;
  setRest: (n: number | null) => void;
  elapsed: number;
  onExit: () => void;
  onFinish: () => void;
}) {
  useStore();
  const log = getSession(week, id);
  const exIndex = Math.max(0, exercises.findIndex((item) => item.id === exId));
  const ex = exercises[exIndex] ?? exercises[0];
  const last = exIndex === exercises.length - 1;
  const prev = exercises[exIndex - 1];
  const next = exercises[exIndex + 1];
  const [sheet, setSheet] = useState(false);
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
    const on = checked(set);
    setField(week, id, field, on ? "" : "1");
    if (!on) {
      navigator.vibrate?.(30);
      const isLastSet = set === ex.sets;
      if (ex.restSec > 0 && (!isLastSet || !last)) setRest(ex.restSec);
    }
  }

  function goNext() {
    if (last) onFinish();
    else {
      setExId(exercises[exIndex + 1].id);
      setRest(null);
    }
  }

  function goPrev() {
    if (exIndex === 0) return;
    setExId(exercises[exIndex - 1].id);
    setRest(null);
  }

  function move(target: string, dir: -1 | 1) {
    const ids = exercises.map((item) => item.id);
    const i = ids.indexOf(target);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= ids.length) return;
    const nextIds = [...ids];
    [nextIds[i], nextIds[j]] = [nextIds[j], nextIds[i]];
    setSessionOrder(week, id, nextIds);
  }

  const sharedKg = ["snatch", "goblet", "thruster", "devil"].includes(ex.id);
  const showKg = ex.kind === "strength" || ex.kind === "carry" || (ex.kind === "superset" && ex.id === "curl");
  const showTime = ex.kind === "interval";
  const showReps = ex.kind === "strength" || ex.kind === "superset";
  const showExtra = ex.kind === "superset";
  const colCount = 2 + Number(showKg || showTime || ex.kind === "circuit" || sharedKg || ex.kind === "checks") + Number(showReps) + Number(showExtra);

  return (
    <section className="player">
      {rest != null ? <RestTimer seconds={rest} onSkip={skipRest} /> : null}
      {sheet ? (
        <div className="sheet">
          <div className="sheet-card">
            <div className="row" style={{ justifyContent: "space-between" }}>
              <strong>Exercises</strong>
              <button className="text-btn" onClick={() => setSheet(false)}>
                Close
              </button>
            </div>
            <p className="muted">Tap to jump back. Use arrows to reorder this workout.</p>
            <div className="sheet-list">
              {exercises.map((item, i) => (
                <div className={`sheet-row ${item.id === ex.id ? "on" : ""}`} key={item.id}>
                  <button className="sheet-jump" onClick={() => { setExId(item.id); setSheet(false); setRest(null); }}>
                    <MuscleIcon muscle={item.muscle} />
                    <span>
                      <strong>
                        {i + 1}. {item.name}
                      </strong>
                      <em>{item.target}</em>
                    </span>
                  </button>
                  <div className="sheet-move">
                    <button disabled={i === 0} onClick={() => move(item.id, -1)} aria-label="Move up">
                      ↑
                    </button>
                    <button disabled={i === exercises.length - 1} onClick={() => move(item.id, 1)} aria-label="Move down">
                      ↓
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <header className="player-top">
        <button className="text-btn" onClick={onExit}>
          Exit
        </button>
        <strong className="ex-count">
          Exercise {exIndex + 1}/{exercises.length}
        </strong>
        <button className="text-btn" onClick={() => setSheet(true)}>
          Exercises
        </button>
      </header>
      <div className="progress">
        <i style={{ width: `${((exIndex + 1) / exercises.length) * 100}%` }} />
      </div>
      <p className="clock">{fmtTime(elapsed)} · {name}</p>

      <div className="player-ex">
        <div className="ex-title">
          <MuscleIcon muscle={ex.muscle} />
          <div>
            {ex.labour ? <span className="pill lime">{ex.labour}</span> : null}
            <h1>{ex.name}</h1>
            <p className="target">
              {muscleLabel(ex.muscle)} · {ex.target}
            </p>
          </div>
        </div>
        <p className="lede">{ex.cue}</p>
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
              <Stepper compact value={val(`${ex.kgKey}-kg`)} onChange={(v) => setField(week, id, `${ex.kgKey}-kg`, v)} step={2.5} unit="kg" />
            </div>
          ) : null}
          <div className={`set-head cols-${colCount}`}>
            <span>Set</span>
            {showKg ? <span>kg</span> : null}
            {showTime ? <span>sec</span> : null}
            {ex.kind === "circuit" ? <span>Log</span> : null}
            {sharedKg || (ex.kind === "checks" && !showKg) ? <span>Target</span> : null}
            {showReps ? <span>{ex.id === "core" ? "HRPU" : "Reps"}</span> : null}
            {showExtra ? <span>{ex.extraLabel ?? "Extra"}</span> : null}
            <span />
          </div>
          <div className="set-list">
            {Array.from({ length: ex.sets }, (_, i) => {
              const set = i + 1;
              const on = checked(set);
              return (
                <div className={`set-line cols-${colCount} ${on ? "on" : ""}`} key={set}>
                  <span className="set-n">{set}</span>
                  {showKg ? (
                    <Stepper
                      compact
                      value={val(kgField(set))}
                      onChange={(v) => {
                        setField(week, id, kgField(set), v);
                        if (set < ex.sets && !val(kgField(set + 1))) setField(week, id, kgField(set + 1), v);
                      }}
                      step={2.5}
                      unit="kg"
                    />
                  ) : null}
                  {showTime ? (
                    <Stepper compact value={val(repsField(set))} onChange={(v) => setField(week, id, repsField(set), v)} step={5} unit="sec" />
                  ) : null}
                  {ex.kind === "circuit" ? (
                    <input
                      className="circuit-in"
                      value={val(`${ex.id}-r${set}`)}
                      placeholder={ex.id === "run" || ex.id === "burpee" ? "time" : "kg"}
                      onChange={(e) => setField(week, id, `${ex.id}-r${set}`, e.target.value)}
                    />
                  ) : null}
                  {sharedKg || (ex.kind === "checks" && !showKg) ? (
                    <span className="set-ghost">{ex.target.split("×").pop()?.trim() ?? ""}</span>
                  ) : null}
                  {showReps ? (
                    <Stepper compact value={val(repsField(set))} onChange={(v) => setField(week, id, repsField(set), v)} step={1} unit="reps" />
                  ) : null}
                  {showExtra ? (
                    <Stepper compact value={val(extraField(set))} onChange={(v) => setField(week, id, extraField(set), v)} step={1} unit="reps" />
                  ) : null}
                  <button className={`tick ${on ? "on" : ""}`} onClick={() => completeSet(set)} aria-label={`Complete set ${set}`}>
                    {on ? "✓" : ""}
                  </button>
                </div>
              );
            })}
          </div>
          {ex.id === "core" ? <p className="faint">HRPU = hand-release push-ups · Raises = hanging legs</p> : null}
          {id === "F" && last ? (
            <label className="field" style={{ marginTop: 12 }}>
              <span>Total circuit time</span>
              <input value={val("total")} placeholder="e.g. 18:40" onChange={(e) => setField(week, id, "total", e.target.value)} />
            </label>
          ) : null}
        </>
      )}

      {next ? (
        <button className="up-next" onClick={() => { setExId(next.id); setRest(null); }}>
          <span>Up next</span>
          <strong>
            <MuscleIcon muscle={next.muscle} />
            {next.name}
          </strong>
        </button>
      ) : (
        <p className="up-next last">Last movement · Finish when you’re done</p>
      )}

      <div className="player-nav">
        <button className="btn ghost" disabled={!prev} onClick={goPrev}>
          ‹ Previous
        </button>
        <button className="btn primary" onClick={goNext}>
          {last ? "Finish" : "Next ›"}
        </button>
      </div>
    </section>
  );
}
