# Verification and scope

Reviewed October 10, 2026. Harbor Workshops is a separately constructed generic demo with invented rules and fixtures. It is not the original GALS portal.

- [Public demo](https://cameronjohnboyle2-hub.github.io/harbor-workshops-showcase/) is available without an application login.
- Nine domain tests and app syntax checks passed locally with Node.js 24.16.0 and in clean GitHub CI.
- [Source CI 38094157379](https://github.com/cameronjohnboyle2-hub/harbor-workshops-showcase/actions/runs/38094157379) and [Pages verification/deploy 38094264174](https://github.com/cameronjohnboyle2-hub/harbor-workshops-showcase/actions/runs/38094264174) succeeded at `ddb97802f9e70bac4c59288f7c46caf3ced9272b`.
- The hosted artifact contains only `index.html`, `main.css`, `app.js`, and `core.mjs`. Public source contained 13 allowlisted files at that revision; all public blob hashes matched the reviewed local bytes. No original Git history was imported.
- Hosted browser review passed both explicit intake outcomes and keyboard activation; assigning the last seat; rejecting a full workshop and a conflicting mentor update while preserving valid state; attendance selection and filtered totals; reset; and fresh reload.
- A 390 × 844 viewport was inspected. Body/document width was 375 pixels after the vertical scrollbar, with no page-level horizontal overflow. Attendance tables may scroll within their panel. No physical-device acceptance is claimed.
- Reviewed hosted flows produced no browser error logs. The content policy specifies `connect-src 'none'` and `form-action 'none'`. No full network trace was collected.
- No app dependencies need installation. Tests use Node built-ins and the UI uses system fonts. The demo makes no model, voice, database, analytics, or other billable service requests in its application source.
- A prior private Sites package remains separate; this GitHub Pages release does not change its audience or the original protected portal.

This review did not query production systems, inspect private records, validate the original portal's database/access settings, measure adoption/impact, or test physical devices. No general source-reuse license is granted; obtain permission before reuse. No original research source, migrations, integrations, datasets, exports, or history were copied.
