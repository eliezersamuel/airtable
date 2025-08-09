import React from 'react';

export default function TimelineHeaderButtons({pxPerDay, setPxPerDay}) {
    return (
    <div style={{ display: "flex", gap: 30, alignItems: "center" }}>
        <span>Zoom:</span>
        <button className="tl-header-buttons" onClick={() => setPxPerDay((v) => Math.max(8, v / 1.25))} aria-label="Zoom out">-</button>
        <button className="tl-header-buttons" onClick={() => setPxPerDay((v) => Math.min(120, v * 1.25))} aria-label="Zoom in">+</button>
        <span style={{ fontFamily: "monospace" }}>px/day: {pxPerDay.toFixed(1)}</span>
    </div>
    );
}