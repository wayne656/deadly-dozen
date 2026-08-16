import type { SessionLog } from "../lib/store";
import { setField } from "../lib/store";
import type { SessionId } from "../data/program";

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

export function Notes({ value, onChange, label = "Session notes" }: { value: string; onChange: (v: string) => void; label?: string }) {
  return (
    <label className="field">
      <span>{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

export function LogInput({
  week,
  id,
  log,
  field,
  placeholder,
}: {
  week: number;
  id: SessionId;
  log: SessionLog;
  field: string;
  placeholder?: string;
}) {
  return (
    <input
      value={log.fields[field] ?? ""}
      placeholder={placeholder}
      onChange={(e) => setField(week, id, field, e.target.value)}
    />
  );
}

export function SetBlock({
  week,
  id,
  log,
  prefix,
  count,
  target,
  extra,
}: {
  week: number;
  id: SessionId;
  log: SessionLog;
  prefix: string;
  count: number;
  target: string;
  extra?: "carry" | "check";
}) {
  return (
    <div className="sets">
      {Array.from({ length: count }, (_, i) => {
        const n = i + 1;
        if (extra === "carry") {
          return (
            <div className="set-row four" key={n}>
              <span>Set {n}</span>
              <LogInput week={week} id={id} log={log} field={`${prefix}-s${n}-kg`} placeholder="kg / hand" />
              <LogInput week={week} id={id} log={log} field={`${prefix}-s${n}-done`} placeholder="Y / N" />
              <LogInput week={week} id={id} log={log} field={`${prefix}-s${n}-rest`} placeholder="rest s" />
            </div>
          );
        }
        return (
          <div className="set-row" key={n}>
            <span>Set {n}</span>
            <LogInput week={week} id={id} log={log} field={`${prefix}-s${n}-kg`} placeholder={`${target} kg`} />
            <LogInput week={week} id={id} log={log} field={`${prefix}-s${n}-reps`} placeholder="actual reps" />
          </div>
        );
      })}
    </div>
  );
}
