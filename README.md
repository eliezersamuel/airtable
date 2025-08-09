# airtable

> Documentation about Airtable Engineering Take Home Assignment

## General Overview

```
airtable-main/
└── airtable-main/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   └── TimelineWrapper/
    │   │       ├── Timeline/
    │   │       |   ├── TimelineItem.jsx
    │   │       |   ├── TimelineRow.jsx
    │   │       |   ├── index.jsx
    │   │       |   └── hooks/
    │   │       |       ├── useDrag.js
    │   │       |       ├── useEditing.js
    │   │       |       ├── useKeyboardMove.js
    │   │       |       ├── useTimelineBounds.js
    │   │       ├── TimelineHeaderButtons/
    │   │       |   └── index.jsx
    │   │       ├── index.css
    │   │       ├── index.jsx
    │   │       └── test.spec.jsx
    │   ├── service/
    │   │   └── db/
    │   │       └── timelineItems.js
    │   ├── styles/
    │   │   └── global/
    │   │       └── app.css
    │   ├── Utils/
    │   │   ├── assignLanes.js
    │   │   └── dateUtils.js
    │   ├── app.js
    │   ├── index.js
    │   └── setupTests.js
    ├── instructions.md
    ├── package-lock.json
    ├── package.json
    └── vitest.config.ts
```

## Run Locally

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run start
```

3. Run tests:
```bash
npm run test
```

## Tools Used
- **vitest**: for component testing
- **date-fns**: for date manipulation

## Features

- **Inline editing**: Double-click a card to edit its name directly.
- **Drag and drop**: Click and drag a card to change its position on the timeline.
- **Resizable items**: Click and drag the card's handles to resize its duration.

---

### Additional Notes
- Further details are provided in **instructions.md** .
