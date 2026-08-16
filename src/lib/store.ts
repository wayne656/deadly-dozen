import { CHECKLIST, KPI_ROWS, type SessionId } from "../data/program";
import { sessionKey, todayISO, weekFromDate } from "../data/dates";

export type PageId = "brief" | "train" | "body" | "race";

export type SessionLog = {
  date: string;
  energy: string;
  notes: string;
  fields: Record<string, string>;
  done: boolean;
};

export type AppState = {
  weights: Record<string, string>;
  sessions: Record<string, SessionLog>;
  kpis: Record<string, string>;
  checklist: Record<string, boolean>;
  lastPage: PageId;
  trainWeek: number;
  trainSession: SessionId;
  launchPlay: boolean;
};

const STORAGE_KEY = "dd-plan-v1";

function emptySession(): SessionLog {
  return { date: todayISO(), energy: "", notes: "", fields: {}, done: false };
}

function defaultState(): AppState {
  const checklist = Object.fromEntries(CHECKLIST.map((item) => [item.id, false]));
  return {
    weights: {},
    sessions: {},
    kpis: {},
    checklist,
    lastPage: "brief",
    trainWeek: weekFromDate(todayISO()),
    trainSession: "A",
    launchPlay: false,
  };
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const loaded = { ...defaultState(), ...parsed } as AppState;
    if (parsed.lastPage === "fuel") loaded.lastPage = "brief";
    return loaded;
  } catch {
    return defaultState();
  }
}

let state = loadState();
const listeners = new Set<() => void>();

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  listeners.forEach((fn) => fn());
}

export function getState() {
  return state;
}

export function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function setWeight(date: string, value: string) {
  state = {
    ...state,
    weights: { ...state.weights, [date]: value },
  };
  persist();
}

export function getSession(week: number, id: SessionId): SessionLog {
  return state.sessions[sessionKey(week, id)] ?? emptySession();
}

export function patchSession(week: number, id: SessionId, patch: Partial<SessionLog>) {
  const key = sessionKey(week, id);
  const current = state.sessions[key] ?? emptySession();
  state = {
    ...state,
    sessions: {
      ...state.sessions,
      [key]: { ...current, ...patch, fields: patch.fields ?? current.fields },
    },
  };
  persist();
}

export function setField(week: number, id: SessionId, field: string, value: string) {
  const current = getSession(week, id);
  patchSession(week, id, { fields: { ...current.fields, [field]: value } });
}

export function setKpi(week: number, key: string, value: string) {
  state = {
    ...state,
    kpis: { ...state.kpis, [`${week}-${key}`]: value },
  };
  persist();
}

export function getKpi(week: number, key: string) {
  return state.kpis[`${week}-${key}`] ?? "";
}

export function toggleCheck(id: string) {
  state = {
    ...state,
    checklist: { ...state.checklist, [id]: !state.checklist[id] },
  };
  persist();
}

export function setNav(
  page: PageId,
  train?: { week?: number; session?: SessionId; launchPlay?: boolean },
) {
  state = {
    ...state,
    lastPage: page,
    trainWeek: train?.week ?? state.trainWeek,
    trainSession: train?.session ?? state.trainSession,
    launchPlay: train?.launchPlay ?? false,
  };
  persist();
}

export const KPI_KEYS = KPI_ROWS.map((row) => row.key);
