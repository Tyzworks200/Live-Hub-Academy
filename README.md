# Live Hub Academy v19

Upload every file in this folder to the root of the `Tyzworks200/Live-Hub-Academy` repository. Keep `.nojekyll` and `index.html` at the repository root, then publish from the `main` branch and `/ (root)` in **Settings → Pages**.

## What this version changes

- Preserves the supplied redesign's navigation, hero, path cards, Missions, achievements, checkpoints, troubleshooting book, and local progress.
- Keeps a compact AI assistant integration slot on Home. Its local goal-to-Mission matching works immediately; the element is marked with `data-integration-slot="intercom-live-hub-agent"` for a future Live Hub or Intercom assistant.
- Shows **Suggested next** and **Completed by you** on Home.
- Groups paths by real audiences: new users, AI builders, telephony, operations, administrators, developers, and customer-experience teams.
- Rebuilds Routing as a dependency-ordered path: plain Call rule → proof → separate Transfer rule → services → production controls.
- Corrects the first phone-number path: use US or UK for the fast self-service Academy run; other countries use the request/admin-provisioning process; all new numbers still require Routing.
- Adds focused alarm Missions based on the supplied alarm setup guide, including verified guide images, email delivery, thresholds, Alarm History, call evidence, and an operating response loop.
- Separates billing continuity into its own outcome path and expands account/user/API-client access Missions.

Progress is stored in the browser on the current device. No backend is required for GitHub Pages.
