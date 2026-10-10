# Verification and scope

Reviewed October 10, 2026. This is a separately constructed generic demo, using invented rules and fixtures. It is not the original GALS portal.

- Nine domain tests passed with Node.js 24.16.0.
- Browser review passed both explicit intake outcomes and keyboard activation; assignment of a last seat; rejection of a full workshop; rejection of a conflicting mentor update while preserving the schedule; attendance selection and filtered totals; reset; and fresh reload.
- A 390 × 844 viewport was inspected. Document and body measured 375 pixels after accounting for the vertical scrollbar, with no page-level horizontal overflow. Attendance tables may scroll within their panel.
- Browser logs in the reviewed local flows contained no errors. A content policy has `connect-src 'none'`; source contains no backend client or external service call. No full network trace was collected.
- No dependencies need installation for the app. Node built-ins support the domain tests. System fonts are used.
- The private hosted preview is a separate packaging/deployment step. Its exact version, source revision, and deployment evidence are recorded in the portfolio release report after deployment.

This review did not query a production system, inspect private records, validate the original portal's database/access settings, measure adoption/impact, or test physical devices. Source reuse licensing is unselected. All examples and operational rules are newly invented, and no original research source, migrations, integrations, datasets, exports, or history were copied.
