import React, { useEffect, useMemo, useRef, useState } from "react";
import assignLanes from "../../../Utils/assignLanes";
import { toDay, dayToStr, clamp } from "../../../Utils/dateUtils";
import { format, parseISO } from "date-fns";

export default function Timeline({ pxPerDay, setPxPerDay, items }) {
  const [data, setData] = useState(items);
  const lanesArr = useMemo(() => assignLanes(data), [data]);

  const initialMin = useRef(Math.min(...items.map((i) => toDay(i.start))));
  const initialMax = useRef(Math.max(...items.map((i) => toDay(i.end))));

  const minStart = Math.min(...data.map((i) => toDay(i.start)));
  const maxEnd = Math.max(...data.map((i) => toDay(i.end)));
  const width = Math.max((maxEnd - minStart + 1) * pxPerDay, 200);

  const containerRef = useRef(null);

  const xToDay = (clientX) => {
    const el = containerRef.current;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left + el.scrollLeft;
    const day = Math.round(x / pxPerDay) + minStart;
    return clamp(day, initialMin.current, initialMax.current);
  };

  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState("");
  const startEdit = (id, current) => {
    setEditingId(id);
    setDraft(current);
  };
  const commit = (id) => {
    setData((prev) =>
      prev.map((x) =>
        x.id === id ? { ...x, name: draft.trim() || x.name } : x
      )
    );
    setEditingId(null);
  };

  const [drag, setDrag] = useState(null);
  
  useEffect(() => {
    if (!drag) return;
    const onMove = (e) => {
      const curDay = xToDay(e.clientX);
      setData((prev) =>
        prev.map((it) => {
          if (it.id !== drag.id) return it;
          const s0 = toDay(drag.startAtDrag);
          const e0 = toDay(drag.endAtDrag);
          if (drag.kind === "move") {
            const delta = curDay - drag.anchorDay;
            let s = clamp(s0 + delta, initialMin.current, initialMax.current);
            let e = clamp(e0 + delta, initialMin.current, initialMax.current);
            // keep span constant and inside bounds
            const span = e0 - s0;
            if (e - s !== span) {
              // Adjust when hit boundary
              if (s === initialMin.current) e = s + span;
              if (e === initialMax.current) s = e - span;
            }
            return {
              ...it,
              start: dayToStr(Math.min(s, e)),
              end: dayToStr(Math.max(s, e)),
            };
          }
          if (drag.kind === "resize-start") {
            const e0c = toDay(drag.endAtDrag);
            const s = clamp(Math.min(curDay, e0c), initialMin.current, e0c);
            return { ...it, start: dayToStr(s) };
          }
          if (drag.kind === "resize-end") {
            const s0c = toDay(drag.startAtDrag);
            const e = clamp(Math.max(curDay, s0c), s0c, initialMax.current);
            return { ...it, end: dayToStr(e) };
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
  }, [drag]);

  const onWheel = (e) =>
    setPxPerDay((v) =>
      Math.max(8, Math.min(120, v * (e.deltaY < 0 ? 1.1 : 0.9)))
    );

  const onKeyItem = (e, item) => {
    const key = e.key;
    if (!["ArrowLeft", "ArrowRight"].includes(key)) return;
    e.preventDefault();
    const delta = key === "ArrowLeft" ? -1 : 1;
    setData((prev) =>
      prev.map((it) => {
        if (it.id !== item.id) return it;
        const s0 = toDay(it.start);
        const e0 = toDay(it.end);
        if (e.altKey) {
          // resize start
          const s = clamp(s0 + delta, initialMin.current, e0);
          return { ...it, start: dayToStr(s) };
        } else if (e.shiftKey) {
          // resize end
          const eDay = clamp(e0 + delta, s0, initialMax.current);
          return { ...it, end: dayToStr(eDay) };
        } else {
          // move
          let s = clamp(s0 + delta, initialMin.current, initialMax.current);
          let eDay = clamp(e0 + delta, initialMin.current, initialMax.current);
          const span = e0 - s0;
          if (eDay - s !== span) {
            if (s === initialMin.current) eDay = s + span;
            if (eDay === initialMax.current) s = eDay - span;
          }
          return { ...it, start: dayToStr(s), end: dayToStr(eDay) };
        }
      })
    );
  };

  return (
    <div
      className="tl-root"
      style={{ width }}
      onWheel={onWheel}
      ref={containerRef}
    >
      <div className="tl-grid" aria-hidden />
      <div
        className="tl-rows"
        style={{ gridTemplateRows: `repeat(${lanesArr.length}, 1fr)` }}
      >
        {lanesArr.map((lane, laneIndex) =>
          lane.map((item) => {
            const sDay = toDay(item.start);
            const eDay = toDay(item.end);
            const left = (sDay - minStart) * pxPerDay;
            const w = Math.max((eDay - sDay + 1) * pxPerDay, 8);
            const isEditing = editingId === item.id;
            return (
              <button
                key={item.id}
                className="tl-item"
                style={{ gridRow: laneIndex + 1, left, width: w }}
                onDoubleClick={() => startEdit(item.id, item.name)}
                onMouseDown={(e) => {
                  if (isEditing) return;
                  setDrag({
                    id: item.id,
                    kind: "move",
                    anchorDay: toDay(dayToStr(xToDay(e.clientX))),
                    startAtDrag: item.start,
                    endAtDrag: item.end,
                  });
                }}
                onKeyDown={(ev) => onKeyItem(ev, item)}
                aria-label={`${item.name} from ${format(
                  parseISO(item.start),
                  "PP"
                )} to ${format(parseISO(item.end), "PP")}`}
              >
                <span
                  className="tl-handle left"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setDrag({
                      id: item.id,
                      kind: "resize-start",
                      anchorDay: toDay(dayToStr(xToDay(e.clientX))),
                      startAtDrag: item.start,
                      endAtDrag: item.end,
                    });
                  }}
                  aria-hidden
                />
                {isEditing ? (
                  <input
                    autoFocus
                    className="tl-input"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onBlur={() => commit(item.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commit(item.id);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                  />
                ) : (
                  <span className="tl-label" title={item.name}>
                    {item.name}
                  </span>
                )}
                <span
                  className="tl-handle right"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setDrag({
                      id: item.id,
                      kind: "resize-end",
                      anchorDay: toDay(dayToStr(xToDay(e.clientX))),
                      startAtDrag: item.start,
                      endAtDrag: item.end,
                    });
                  }}
                  aria-hidden
                />
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
