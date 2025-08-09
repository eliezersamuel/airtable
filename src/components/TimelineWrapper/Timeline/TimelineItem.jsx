import React, { memo, useCallback } from "react";
import { format, parseISO } from "date-fns";

function TimelineItem({
  gridRow,
  left,
  width,
  item,
  isEditing,
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
  const onDblClick = useCallback(() => startEdit(item.id, item.name), [item.id, item.name, startEdit]);

  const onMouseDownMove = useCallback(
    (e) => {
      if (isEditing) return;
      beginMove(item, e.clientX);
    },
    [isEditing, beginMove, item]
  );

  const onMouseDownResizeStart = useCallback(
    (e) => {
      e.stopPropagation();
      beginResizeStart(item, e.clientX);
    },
    [beginResizeStart, item]
  );

  const onMouseDownResizeEnd = useCallback(
    (e) => {
      e.stopPropagation();
      beginResizeEnd(item, e.clientX);
    },
    [beginResizeEnd, item]
  );

  const aria = `${item.name} from ${format(parseISO(item.start), "PP")} to ${format(
    parseISO(item.end),
    "PP"
  )}`;

  return (
    <button
      className="tl-item"
      style={{ gridRow, left, width }}
      onDoubleClick={onDblClick}
      onMouseDown={onMouseDownMove}
      onKeyDown={(ev) => onKeyItem(ev, item)}
      aria-label={aria}
    >
      <span className="tl-handle left" onMouseDown={onMouseDownResizeStart} aria-hidden />
      {isEditing ? (
        <input
          autoFocus
          className="tl-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => commit(item.id)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit(item.id);
            if (e.key === "Escape") cancelEdit();
          }}
        />
      ) : (
        <span className="tl-label" title={item.name}>
          {item.name}
        </span>
      )}
      <span className="tl-handle right" onMouseDown={onMouseDownResizeEnd} aria-hidden />
    </button>
  );
}

export default memo(TimelineItem);
