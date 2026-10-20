# Shift-Schedule App

Household tool that extracts one person's shifts from a shared, department-wide shift roster, keeps a calendar accurate as revised rosters arrive, and (Phase 2) helps divide chores/kid logistics by real availability. Also a hands-on solution-architecture exercise: the architecture doc is a first-class deliverable.

## How we work (important)

Puja is the architect and developer-in-charge; Claude is the implementer and sounding board. **Work step by step. Do not build ahead.**

- Puja gives one direction at a time. Do that step, then stop and wait for the next one.
- Before changing code, say in a line or two what will change and what won't. Ask if the step is ambiguous; don't guess and build.
- Architecture choices are hers. Offer options with a recommendation and the trade-off, then let her decide.
- Keep steps small and visible: after each one, tell her how to see it in the running app (`npm run dev`).
- Don't add features, files, or dependencies beyond the current step. Flag ideas instead of implementing them.
- Don't commit or push unless asked.

## Architecture doc = source of truth

- [docs/solution-architecture.md](docs/solution-architecture.md) is canonical. Read it before architecture discussions or non-trivial changes.
- Status words matter: **Decided** vs **Proposed** vs **Directional**. Only Puja moves an item to Decided.
- When she decides something, update the doc in the same step: add or update the D# row in the decision log, fix the affected sections, and note it in the appendix change log.
- Notion mirror: "Shift-Schedule App — Solution Architecture Document" (page id `3c6a9d76-8b97-8153-a948-c7a50ccaf17a`). Repo copy is ahead. Push to Notion only when she asks, and overwrite the page as a whole from the repo copy.

## Privacy: real rosters

`docs/` may hold real rosters (`.xlsx`, `.doc`, …). They contain coworkers' names and personal phone numbers and are gitignored. Never commit them, quote coworker names or numbers into code, docs, tests, or commit messages, or send them anywhere except through the extraction flow she approves. Use anonymized fixtures for tests. `sample-data/` holds a synthetic mock only, and it does not match the real roster structure.

## Stack and commands

React 19 + Vite + Tailwind CSS 4 + react-router-dom (JavaScript, not TypeScript). Anthropic SDK is a dependency for the parsing step; the API key must never reach the browser (see D8 in the doc).

- `npm run dev` — dev server at http://127.0.0.1:5173
- `npm run lint` — oxlint
- `npm run build` — production build
- `npm run send-roster` — proof-of-concept script that sends a roster to Claude (extraction instructions still TODO)

Current state and next steps: see §11 Roadmap in the architecture doc.
