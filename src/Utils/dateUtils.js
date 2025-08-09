import { parseISO } from "date-fns";
export const DAY_MS = 86400000;
export const toDay = (s) => Math.floor(parseISO(s).getTime() / DAY_MS);
export const dayToStr = (d) => {
  const date = new Date(d * DAY_MS);
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
};
export const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
