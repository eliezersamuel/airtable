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
    │   │       ├── TimelineHeaderButtons/
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

---

### Additional Notes
- Further details are provided in **instructions.md** .
