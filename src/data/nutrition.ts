import { ATHLETE, RACE_DATE } from "./program";
import { parseISO } from "./dates";

export function isWeekend(iso: string) {
  const day = parseISO(iso).getDay();
  return day === 0 || day === 6;
}

export function calorieTarget(iso: string) {
  if (iso === RACE_DATE) {
    return {
      kcal: ATHLETE.raceDayKcal,
      tag: "Race day",
      kind: "race" as const,
      note: "At maintenance. Easy, practised carbs. No fibre experiment.",
    };
  }
  if (iso === "2026-09-17" || iso === "2026-09-18") {
    return {
      kcal: ATHLETE.carbLoadKcal,
      tag: "Carb load",
      kind: "carbs" as const,
      note: "Low fibre, low fat, high carb. Thu 17 & Fri 18 Sept only.",
    };
  }
  if (isWeekend(iso)) {
    return {
      kcal: ATHLETE.weekendKcal,
      tag: "Weekend",
      kind: "weekend" as const,
      note: "Near maintenance. Extra carbs around training, protein stays 155 g.",
    };
  }
  return {
    kcal: ATHLETE.weekdayKcal,
    tag: "Weekday",
    kind: "weekday" as const,
    note: "25% below the weekend target. Protein locked, carbs around the session.",
  };
}

export function weeklyAverage() {
  return Math.round((ATHLETE.weekdayKcal * 5 + ATHLETE.weekendKcal * 2) / 7);
}

export function weekdayDiscount() {
  return Math.round((1 - ATHLETE.weekdayKcal / ATHLETE.weekendKcal) * 100);
}
