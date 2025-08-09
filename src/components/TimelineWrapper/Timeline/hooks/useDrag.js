import { useEffect, useState, useCallback } from "react";
import { toDay, dayToStr } from "../../../../Utils/dateUtils";

export function useDrag({ setData, xToDay, initialMin, initialMax }) {
  const [drag, setDrag] = useState(null);

  const beginMove = useCallback((item, clientX) => {
    setDrag({
      id: item.id,
      kind: "move",
      anchorDay: toDay(dayToStr(xToDay(clientX))),
      startAtDrag: item.start,
      endAtDrag: item.end,
    });
  }, [xToDay]);

  const beginResizeStart = useCallback((item, clientX) => {
    setDrag({
      id: item.id,
      kind: "resize-start",
      anchorDay: toDay(dayToStr(xToDay(clientX))),
      startAtDrag: item.start,
      endAtDrag: item.end,
    });
  }, [xToDay]);

  const beginResizeEnd = useCallback((item, clientX) => {
    setDrag({
      id: item.id,
      kind: "resize-end",
      anchorDay: toDay(dayToStr(xToDay(clientX))),
      startAtDrag: item.start,
      endAtDrag: item.end,
    });
  }, [xToDay]);

  useEffect(() => {
    if (!drag) return;

    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

    const onMove = (e) => {
      const curDay = xToDay(e.clientX);
      setData((prev) =>
        prev.map((it) => {
          if (it.id !== drag.id) return it;
          const s0 = toDay(drag.startAtDrag);
          const e0 = toDay(drag.endAtDrag);

          if (drag.kind === "move") {
            const delta = curDay - drag.anchorDay;
            let s = clamp(s0 + delta, initialMin, initialMax);
            let ed = clamp(e0 + delta, initialMin, initialMax);
            const span = e0 - s0;
            if (ed - s !== span) {
              if (s === initialMin) ed = s + span;
              if (ed === initialMax) s = ed - span;
            }
            return { ...it, start: dayToStr(Math.min(s, ed)), end: dayToStr(Math.max(s, ed)) };
          }

          if (drag.kind === "resize-start") {
            const e0c = e0;
            const s = clamp(Math.min(curDay, e0c), initialMin, e0c);
            return { ...it, start: dayToStr(s) };
          }

          if (drag.kind === "resize-end") {
            const s0c = s0;
            const ed = clamp(Math.max(curDay, s0c), s0c, initialMax);
            return { ...it, end: dayToStr(ed) };
          }

          return it;
        })
      );
    };

    const onUp = () => setDrag(null);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [drag, setData, xToDay, initialMin, initialMax]);

  return { drag, beginMove, beginResizeStart, beginResizeEnd };
}
