import React, { memo } from "react";
import TimelineItem from "./TimelineItem";
import { toDay } from "../../../Utils/dateUtils";

function TimelineRow({
  lane,
  laneIndex,
  pxPerDay,
  minStart,
  editingId,
  draft,
  startEdit,
  commit,
  cancelEdit,
  setDraft,
  beginMove,
  beginResizeStart,
  beginResizeEnd,
  onKeyItem,
}) {
  return lane.map((item) => {
    const sDay = toDay(item.start);
    const eDay = toDay(item.end);
    const left = (sDay - minStart) * pxPerDay;
    const width = Math.max((eDay - sDay + 1) * pxPerDay, 8);
    const isEditing = editingId === item.id;

    return (
      <TimelineItem
        key={item.id}
        gridRow={laneIndex + 1}
        left={left}
        width={width}
        item={item}
        isEditing={isEditing}
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
    );
  });
}

export default memo(TimelineRow);
