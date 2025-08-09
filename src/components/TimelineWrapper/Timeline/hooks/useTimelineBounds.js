import { useMemo, useCallback } from "react";
import { toDay } from "../../../../Utils/dateUtils";

export function useTimelineBounds({ items, pxPerDay, containerRef }) {
  const initialMin = useMemo(() => Math.min(...items.map((i) => toDay(i.start))), [items]);
  const initialMax = useMemo(() => Math.max(...items.map((i) => toDay(i.end))), [items]);

  const minStart = useMemo(() => Math.min(...items.map((i) => toDay(i.start))), [items]);
  const maxEnd   = useMemo(() => Math.max(...items.map((i) => toDay(i.end))), [items]);

  const width = useMemo(() => Math.max((maxEnd - minStart + 1) * pxPerDay, 200), [
    maxEnd,
    minStart,
    pxPerDay,
  ]);

  const xToDay = useCallback(
    (clientX) => {
      const el = containerRef.current;
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left + el.scrollLeft;
      const day = Math.round(x / pxPerDay) + minStart;
      const clamped = Math.max(initialMin, Math.min(initialMax, day));
      return clamped;
    },
    [containerRef, pxPerDay, minStart, initialMin, initialMax]
  );

  return { initialMin, initialMax, minStart, maxEnd, width, xToDay };
}
