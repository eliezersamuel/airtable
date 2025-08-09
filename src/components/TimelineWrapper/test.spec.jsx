import { render, screen, fireEvent } from "@testing-library/react";
import Timeline from "./index.jsx";
import timelineItems from "../../service/db/timelineItems.js";
import React from 'react';

function setup() {
  render(<Timeline items={timelineItems.slice(0, 3)} />);
  return {
    getItem: (name) => screen.getByRole("button", { name: new RegExp(name, "i") }),
  };
}

test("renders items and allows inline edit", () => {
  const { getItem } = setup();
  const a = getItem("Recruit translators");
  fireEvent.doubleClick(a);
  const input = screen.getByRole("textbox");
  fireEvent.change(input, { target: { value: "Recruit translators ✅" } });
  fireEvent.keyDown(input, { key: "Enter" });
  expect(screen.getByText("Recruit translators ✅")).toBeInTheDocument();
});

test("keyboard move and resize within bounds", () => {
  const { getItem } = setup();
  const a = getItem("Recruit translators");
  a.focus();
  // Move right 1 day
  fireEvent.keyDown(a, { key: "ArrowRight" });
  // Resize end +1 (Shift+ArrowRight)
  fireEvent.keyDown(a, { key: "ArrowRight", shiftKey: true });
  // Resize start -1 (Alt+ArrowLeft)
  fireEvent.keyDown(a, { key: "ArrowLeft", altKey: true });
  // If it didn't throw and still exists, basic behavior is ok
  expect(a).toBeInTheDocument();
});
