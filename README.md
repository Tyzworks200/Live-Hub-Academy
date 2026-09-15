# Live Hub Academy

The official outcome-first success experience for AudioCodes Live Hub: the fastest path from zero to a working Voice AI deployment.

## What is included

- A real-dashboard orientation tour that explains the account selector, navigation, usage, Help Center, IAM, wizard, and support assistant
- A five-level go-live journey: first successful call, connect telephony, route intelligently, operate production, and production readiness
- A gold-standard **Route a Real Customer Call** prototype built around real Live Hub 2.19.2 screens, visible hotspots, one move at a time, and Call History proof
- One progress hierarchy across the experience: Levels 1–5, with the active outcome and completion shown in one place
- Twenty working-outcome courses covering native and external bots, speech providers, every major voice channel, routing, call features, Agent Assist, translation, outbound calling and campaigns, operations, APIs, governance, and troubleshooting
- A brand-book-aligned experience using AudioCodes navy, blue, cyan, purple, Rajdhani display type, Poppins body type, and the official sound-wave artwork
- A calm, product-launch-style homepage that asks customers to choose one real win instead of browsing product categories
- A working lightweight Academy Guide in the homepage hero that routes natural-language questions to the shortest verified outcome, while preserving a stable Intercom integration slot
- The Live Hub call model—Origin → Route → Destination → Proof—taught once in orientation as a concept, never reused as a progress tracker
- Story-first missions that show the working result before explanation, reveal one action at a time, and unlock the success check only at the final action
- Exact portal paths, official screenshots, optional video, collapsed preparation, and on-demand troubleshooting without a documentation wall
- Contextual official routing videos for Live Hub-number and external-SIP call paths, placed beside the rule-building action where they are useful
- Short browser-based coaching summaries that prepare learners for action instead of narrating the full text
- An optional 12-question production-readiness checkpoint with explanations and official documentation links
- A corrected US/UK phone-number request flow that includes the form, required documents, provisioning wait, and the routing handoff
- Supporting mission content for account models, alarm thresholds, billing, IAM, operations, and failed-call diagnosis
- Searchable troubleshooting book with 100 Live Hub issue patterns, completion-status strings, likely causes, self-service actions, escalation rules, and evidence checklists
- A centralized official-TechDocs link map, checked against the complete Live Hub 2.19.2 manual, used by every mission and reference card
- Support guidance covering documentation, chat, AI Assistant, ticket severity, transcript/log sharing, recordings, and retention
- Developer compass for the Live Hub REST API versus Bot and speech provider APIs
- Device-local progress tracking with no account or database required
- Responsive desktop and mobile layouts

## Run locally

Requirements:

- Node.js 22.13 or newer
- Linux, macOS, or WSL

Install and start the development server:

```bash
npm ci
npm run dev
```

Create a production build:

```bash
npm run build
npm run build:pages
```

## Upload to GitHub

This package is configured for the repository:

`https://github.com/Tyzworks200/Live-Hub-Academy`

To replace the earlier upload:

1. Unzip the corrected Academy package.
2. Open the existing `Live-Hub-Academy` repository on GitHub.
3. Choose **Add file → Upload files**.
4. Drag everything inside the unzipped `Live-Hub-Academy` folder into GitHub.
5. Allow GitHub to replace files with the same names, then commit to `main`.
6. Open **Settings → Pages**.
7. Under **Build and deployment → Source**, select **Deploy from a branch**.
8. Select the `main` branch and the `/docs` folder, then click **Save**.
9. Wait a minute or two for GitHub to show the published address.

The published address will be:

`https://tyzworks200.github.io/Live-Hub-Academy/`

To push from a terminal instead:

```bash
git add .
git commit -m "Enable Live Hub Academy on GitHub Pages"
git push
```

The ready-to-publish website is stored in `docs/`. The included GitHub Actions workflow also verifies that the static Academy still builds successfully after changes.

## Deployment note

The project keeps its existing Sites/Vinext configuration and adds a separate static GitHub Pages build. Both versions use the same Academy source and design.

## Main files

- `app/page.tsx` - application navigation and interactive views
- `app/lesson-data.ts` - verified challenge and evidence content for every mission
- `app/quiz-data.ts` - customer-facing bootcamp questions, answers, explanations, and source links
- `app/techdocs.ts` - centralized official documentation destinations
- `app/troubleshooting-data.json` - 100 structured troubleshooting entries
- `app/globals.css` - complete visual system and responsive layout
- `github-pages/index.html` - source template for the GitHub Pages entry point
- `github-pages/main.tsx` - static React entry point
- `docs/index.html` - ready-to-publish GitHub Pages homepage
- `vite.pages.config.ts` - repository-aware static build
- `.openai/hosting.json` - existing Sites project binding
- `.github/workflows/verify.yml` - GitHub Pages build verification

## Content note

The Academy converts the complete 782-page Live Hub 2.19.2 manual, support guidance, and Live Hub Log Glossary into short, task-oriented customer outcomes. Vendor parameter tables, edge cases, and release-specific detail remain in Expert Reference; official documentation remains the source of truth.
