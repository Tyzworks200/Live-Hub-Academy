# Live Hub Academy v18

This folder is ready for GitHub Pages.

## Upload

1. Upload **all files in this folder** to the root of `Tyzworks200/Live-Hub-Academy`.
2. In GitHub, open **Settings → Pages**.
3. Publish from your repository branch and the **root** folder.
4. Open `https://tyzworks200.github.io/Live-Hub-Academy/`.

The site is a static, single-page Academy. Progress, XP, badges, quiz scores, and Mission completion are stored in the learner's browser.

## Academy Guide integration point

The homepage guide already matches free text to the best Mission locally. Its container has:

`data-integration-slot="intercom-live-hub-agent"`

That keeps a clean integration point for a future Live Hub or Intercom agent without shipping a non-functional input.

## Content and visuals

- 20 outcome-based paths
- 79 hands-on Missions
- Bright Smile Receptionist flagship build
- Verified Live Hub screenshots only; missing visuals fall back to text
- Short browser-spoken briefings and generated Mission walkthroughs
- Searchable troubleshooting book, readiness quiz, badges, and local progress
- Direct links from each Mission to the exact official TechDocs page
