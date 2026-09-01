# Live Hub Academy

An outcome-first learning and troubleshooting experience for AudioCodes Live Hub.

Live version: https://live-hub-academy.audiocodes.chatgpt.site

## What is included

- Five guided missions with exact portal paths, numbered actions, success checks, official screenshots, video, and browser-based lesson narration
- Hands-on paths for launching a Voice AI Agent, connecting voice channels, Agent Assist, real-time translation, and diagnosing a failed call
- Searchable troubleshooting book with 100 Live Hub issue patterns, completion-status strings, likely causes, self-service actions, escalation rules, and evidence checklists
- Documentation library aligned to the current product structure: Get started, Concepts, Bot connections, Speech providers, Voice channels, Routing, AI Agents, Hub+, Calls, Monitoring, Administration, APIs, Support, and Release notes
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
```

## Upload to GitHub

The simplest route is:

1. Create an empty GitHub repository.
2. Unzip the Academy package.
3. In GitHub, choose **Add file → Upload files**.
4. Drag the unzipped files and folders into the upload area.
5. Commit to the `main` branch.

Or push from a terminal:

```bash
git init
git add .
git commit -m "Add Live Hub Academy"
git branch -M main
git remote add origin https://github.com/YOUR-ORG/YOUR-REPOSITORY.git
git push -u origin main
```

The included GitHub Actions workflow verifies every push with a clean install and production build.

## Deployment note

This is a Vinext/Cloudflare Worker application, not a static GitHub Pages bundle. Store and review the source in GitHub, then deploy it through the existing Sites project or another compatible Cloudflare Worker pipeline. The production Academy currently runs at the live URL above.

## Main files

- `app/page.tsx` - application navigation and interactive views
- `app/lesson-data.ts` - five detailed guided missions
- `app/troubleshooting-data.json` - 100 structured troubleshooting entries
- `app/globals.css` - complete visual system and responsive layout
- `.openai/hosting.json` - existing Sites project binding
- `.github/workflows/verify.yml` - GitHub build verification

## Content note

The Academy condenses the supplied Live Hub documentation, legacy manual, support guidance, and Live Hub Log Glossary into task-oriented learning. Official documentation remains the source of truth for release-specific behavior.
