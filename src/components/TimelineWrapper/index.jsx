import React, { useState } from "react";
import Timeline from "./Timeline";
import TimelineHeaderButtons from "./TimelineHeaderButtons";
import "./index.css";

export default function TimelineWrapper({ items }) {
  const [pxPerDay, setPxPerDay] = useState(28);
  
  return (
    <div className="tl-wrapper">
      <TimelineHeaderButtons 
        pxPerDay={pxPerDay}
        setPxPerDay={setPxPerDay}
      />
      <Timeline
        items={items}
        pxPerDay={pxPerDay}
        setPxPerDay={setPxPerDay}
      />
    </div>
  );
}
