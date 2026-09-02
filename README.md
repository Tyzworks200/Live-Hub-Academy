# Live Hub Academy

An outcome-first learning and troubleshooting experience for AudioCodes Live Hub.

Live version: https://live-hub-academy.audiocodes.chatgpt.site

## What is included

- A real-dashboard orientation tour that explains the account selector, navigation, usage, Help Center, IAM, wizard, and support assistant
- Three real starting paths: launch an AI Agent, connect SIP plus a Live Hub number, or connect Microsoft Teams plus SIP
- Six guided missions with exact portal paths, architecture maps, numbered actions, common mistakes, success checks, official screenshots, video, and browser-based narration
- A corrected US/UK phone-number request flow that includes the form, required documents, provisioning wait, and the routing handoff
- Focused paths for routing, account models, alarm thresholds, billing, IAM, operations, and failed-call diagnosis
- Searchable troubleshooting book with 100 Live Hub issue patterns, completion-status strings, likely causes, self-service actions, escalation rules, and evidence checklists
- A centralized official-TechDocs link map, checked against the supplied TechDocs menu, used by every lesson and library card
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
- `app/lesson-data.ts` - detailed lessons for every guided mission
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

The Academy condenses the supplied Live Hub documentation, legacy manual, support guidance, and Live Hub Log Glossary into task-oriented learning. Official documentation remains the source of truth for release-specific behavior.
