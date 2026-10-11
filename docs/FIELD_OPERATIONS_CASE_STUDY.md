# From fragmented spreadsheets to a field-operations portal

**Cameron Boyle · AI-assisted product development and field operations**

A small Cambodian workshop team needed a shared view of who was scheduled, who attended, and who needed follow-up. Cameron reports that this work had been spread across roughly twenty spreadsheets. He built a staff portal to bring the operational workflows together while helping the team use it in the field.

## The problem

Attendance records, group assignments, venue/location information and contacting history were difficult to reconcile across separate sheets. A coordinator needed to answer practical questions: can this person attend the available session, which venue is suitable, did they attend, and what should staff do next?

The recruitment discussions also exposed a product constraint: people need concrete scheduling information before committing. A technically complete intake form does not solve a workflow that leaves its users uncertain about the next step.

## Cameron's contribution

Cameron led the portal's product direction and AI-assisted implementation. He reports directly managing four Cambodian staff, coordinating workshops and working with participants in Khmer. His work combined field requirements, workflow design, data organization, troubleshooting and iterative improvements. Codex supported implementation and review; the portfolio does not claim that every line was written manually.

The original private source uses React, TypeScript and Supabase/PostgreSQL, with staff-facing workflows for intake, group/session organization, attendance and follow-up. Source and project discussions support this feature breadth. They do not independently establish current deployment security or measured productivity gains.

## Product decisions

| Staff need | Design decision | Intended benefit |
| --- | --- | --- |
| Find the next action without reconciling many sheets | Connect intake, group membership, sessions, attendance and follow-up in one workspace | Give staff a consistent operational view |
| Make workable workshop assignments | Consider availability and venue/location context when organizing groups | Reduce avoidable scheduling confusion |
| Keep attendance meaningful | Treat unrecorded attendance separately from present/absent and from later follow-up | Avoid turning missing information into a false outcome |
| Know whom to contact next | Record contacting outcomes and the next staff action | Preserve continuity when work changes hands |
| Resolve conflicting intake records | Require explicit review instead of assuming every apparent match is the same person | Keep uncertainty visible |
| Limit access to private contact details | Separate ordinary operational records from restricted contact workflows | Make privacy part of the workflow design |

These are product decisions and design intentions. No percentage reduction in errors or hours saved is claimed.

## Results and evidence

Cameron reports that the portal solved substantial attendance, contacting and group-organization problems and became his largest product project. The supported outcome is consolidation of operational workflows previously scattered across about twenty spreadsheets. The four-person staff-management figure and the spreadsheet estimate are user-reported, rather than independently audited metrics.

The reviewed source and historical chats show ongoing support and iteration. Measured before/after time, an independently confirmed active-staff count and a quantified reliability improvement remain unavailable. Workshop delivery counts in older career notes conflict, so this case study does not select one as an audited result. Research outcomes are outside the public case study.

## A public example of the decisions

[Harbor Workshops](https://cameronjohnboyle2-hub.github.io/harbor-workshops-showcase/) demonstrates three general lessons: explicit intake decisions, assignment constraints, and consistent attendance totals. It uses invented applicants, venues, capacities and rules. It is a separate reconstruction, with nine tested domain behaviors; its screens are not screenshots of the operational portal.

Try assigning an unavailable applicant or filling the final workshop seat. The demo explains a rejected change and preserves the previous valid state. Then record attendance and see totals computed from the same assignments.

## Lessons

The strongest product work happened at the intersection of software and operations: identify what staff could not reliably answer, make the next action clear, and revise the workflow after real field feedback. Shared data also requires careful handling of uncertain identities, access boundaries and record preservation.

The public release contains no participant records, contact details, operational exports, private endpoints, study methods or original Git history. The private portal and its original rights remain separate. This case study summarizes Cameron's operational contribution; it does not publish research or certify the original system's security.
