import { useEffect, useState } from "react";

export function RestTimer({
  seconds,
  onSkip,
}: {
  seconds: number;
  onSkip: () => void;
}) {
  const [left, setLeft] = useState(seconds);

  useEffect(() => {
    setLeft(seconds);
  }, [seconds]);

  useEffect(() => {
    if (left <= 0) {
      onSkip();
      return;
    }
    const id = window.setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => window.clearTimeout(id);
  }, [left, onSkip]);

  const m = Math.floor(left / 60);
  const s = String(left % 60).padStart(2, "0");
  const pct = Math.max(0, left / seconds);

  return (
    <div className="rest">
      <p className="rest-kicker">Rest</p>
      <div className="rest-ring">
        <svg viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" className="rest-track" />
          <circle
            cx="60"
            cy="60"
            r="52"
            className="rest-progress"
            strokeDasharray={`${pct * 327} 327`}
          />
        </svg>
        <strong>
          {m}:{s}
        </strong>
      </div>
      <div className="rest-actions">
        <button className="btn ghost" onClick={() => setLeft((n) => n + 15)}>
          +15s
        </button>
        <button className="btn primary" onClick={onSkip}>
          Skip rest
        </button>
      </div>
    </div>
  );
}

export function Stepper({
  value,
  onChange,
  step = 1,
  unit,
  min = 0,
  compact = false,
}: {
  value: string;
  onChange: (v: string) => void;
  step?: number;
  unit: string;
  min?: number;
  compact?: boolean;
}) {
  const n = Number(value);
  const current = Number.isFinite(n) ? n : 0;

  function round(v: number) {
    return String(Math.round(v * 10) / 10);
  }

  return (
    <div className={`stepper ${compact ? "compact" : ""}`}>
      <button type="button" aria-label={`decrease ${unit}`} onClick={() => onChange(round(Math.max(min, current - step)))}>
        −
      </button>
      <input
        inputMode="decimal"
        value={value}
        placeholder="0"
        onChange={(e) => onChange(e.target.value)}
      />
      {compact ? null : <em>{unit}</em>}
      <button type="button" aria-label={`increase ${unit}`} onClick={() => onChange(round(current + step))}>
        +
      </button>
    </div>
  );
}

export function fmtTime(total: number) {
  const m = Math.floor(total / 60);
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}
