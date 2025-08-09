import { useCallback } from "react";
import { toDay, dayToStr } from "../../../../Utils/dateUtils";

export function useKeyboardMove({ setData, initialMin, initialMax, toDay }) {
  const onKeyItem = useCallback(
    (e, item) => {
      const key = e.key;
      if (!["ArrowLeft", "ArrowRight"].includes(key)) return;
      e.preventDefault();
      const delta = key === "ArrowLeft" ? -1 : 1;

      const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

      setData((prev) =>
        prev.map((it) => {
          if (it.id !== item.id) return it;
          const s0 = toDay(it.start);
          const e0 = toDay(it.end);

          if (e.altKey) {
            const s = clamp(s0 + delta, initialMin, e0);
            return { ...it, start: dayToStr(s) };
          } else if (e.shiftKey) {
            const ed = clamp(e0 + delta, s0, initialMax);
            return { ...it, end: dayToStr(ed) };
          } else {
            let s = clamp(s0 + delta, initialMin, initialMax);
            let ed = clamp(e0 + delta, initialMin, initialMax);
            const span = e0 - s0;
            if (ed - s !== span) {
              if (s === initialMin) ed = s + span;
              if (ed === initialMax) s = ed - span;
            }
            return { ...it, start: dayToStr(s), end: dayToStr(ed) };
          }
        })
      );
    },
    [setData, initialMin, initialMax, toDay]
  );

  return onKeyItem;
}
