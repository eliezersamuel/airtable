import React, { useMemo, useRef, useState, useCallback } from "react";
import assignLanes from "../../../Utils/assignLanes";
import { toDay } from "../../../Utils/dateUtils";
import TimelineRow from "./TimelineRow";
import {
  useTimelineBounds,
} from "./hooks/useTimelineBounds";
import { useEditing } from "./hooks/useEditing";
import { useDrag } from "./hooks/useDrag";
import { useKeyboardMove } from "./hooks/useKeyboardMove";

export default function Timeline({ pxPerDay, setPxPerDay, items }) {
  const [data, setData] = useState(items);

  const lanesArr = useMemo(() => assignLanes(data), [data]);
  const containerRef = useRef(null);

  const {
    initialMin,
    initialMax,
    minStart,
    maxEnd,
    width,
    xToDay,
  } = useTimelineBounds({ items: data, pxPerDay, containerRef });

  const { editingId, draft, startEdit, commit, cancelEdit, setDraft } =
    useEditing({ setData });

  const onWheel = useCallback(
    (e) =>
      setPxPerDay((v) => Math.max(8, Math.min(120, v * (e.deltaY < 0 ? 1.1 : 0.9)))),
    [setPxPerDay]
  );

  const { drag, beginMove, beginResizeStart, beginResizeEnd } = useDrag({
    setData,
    toDay,
    xToDay,
    initialMin,
    initialMax,
  });

  const onKeyItem = useKeyboardMove({
    setData,
    initialMin,
    initialMax,
    toDay,
  });

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
        {lanesArr.map((lane, laneIndex) => (
          <TimelineRow
            key={laneIndex}
            lane={lane}
            laneIndex={laneIndex}
            pxPerDay={pxPerDay}
            minStart={minStart}
            editingId={editingId}
            draft={draft}
            startEdit={startEdit}
            commit={commit}
            cancelEdit={cancelEdit}
            setDraft={setDraft}
            beginMove={beginMove}
            beginResizeStart={beginResizeStart}
            beginResizeEnd={beginResizeEnd}
            onKeyItem={onKeyItem}
          />
        ))}
      </div>
    </div>
  );
}
