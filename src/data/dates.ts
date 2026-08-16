import { PLAN_START, RACE_DATE, type SessionId } from "./program";

export function parseISO(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function toISO(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(iso: string, days: number) {
  const date = parseISO(iso);
  date.setDate(date.getDate() + days);
  return toISO(date);
}

export function daysBetween(from: string, to: string) {
  const ms = parseISO(to).getTime() - parseISO(from).getTime();
  return Math.round(ms / 86400000);
}

export function todayISO() {
  return toISO(new Date());
}

export function formatLong(iso: string) {
  return parseISO(iso).toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function formatDay(iso: string) {
  return parseISO(iso).toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
  });
}

export function planDayIndex(iso: string) {
  return daysBetween(PLAN_START, iso);
}

export function weekFromDate(iso: string) {
  const idx = planDayIndex(iso);
  if (idx < 0) return 1;
  return Math.min(5, Math.floor(idx / 7) + 1);
}

export function weekRange(week: number) {
  const start = addDays(PLAN_START, (week - 1) * 7);
  const end = addDays(start, week === 5 ? 6 : 6);
  return { start, end };
}

export function daysUntilRace(iso = todayISO()) {
  return daysBetween(iso, RACE_DATE);
}

export function sessionKey(week: number, id: SessionId) {
  return `w${week}-${id}`;
}

export function mean(values: number[]) {
  if (!values.length) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function round1(n: number) {
  return Math.round(n * 10) / 10;
}
