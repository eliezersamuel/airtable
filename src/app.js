import React from "react";
import TimelineWrapper from "./components/TimelineWrapper";
import timelineItems from "./service/db/timelineItems"

export default function App() {
  return (
      <TimelineWrapper items={timelineItems}/>
  );
}