# PHARMA PLASMA UZ — Phase 1 (core)
```
npm install
npm run dev      # local dev server
npm test         # vitest: filtering, search, language switching, MCQ scoring/selection
npm run build    # type-check + static build in dist/
```
- Data: `src/data.ts` (DEMO records only, status "demo"). Schema: `src/types.ts`. Future import: JSON array of `Drug` with `source.status: "verified"`.
- Static hosting: configure SPA fallback to index.html (BrowserRouter).
- Official instructions are never fabricated; demo records show an "unavailable" state.
- Not yet implemented: flashcards, progress page, settings page, timer/difficulty/shuffle options, searchable dropdowns, theme/motion toggles.
