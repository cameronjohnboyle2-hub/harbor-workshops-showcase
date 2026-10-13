# GALS Operations Portal: bringing field operations together

**Cameron Boyle · Product direction, AI-assisted development and field operations**

A Cambodian business-training team needed to know who was scheduled, who attended and who needed follow-up. I led product direction and AI-assisted development of a private staff portal that connected those workflows, while managing four local staff and working with participants in Khmer.

[Explore the public workflow demo](https://cameronjohnboyle2-hub.github.io/harbor-workshops-showcase/)

The demo, Harbor Workshops, is a separate fictional reconstruction of three workflow ideas. This case study describes the broader original portal, whose source and operational records remain private.

## The problem

Attendance, group assignments, venue information and contact history were spread across separate sheets. Staff had to answer practical questions: can this person attend the available session, which venue works, did they attend, and what should we do next?

I learned that people needed concrete scheduling information before committing. An intake form alone could not solve a workflow that left the next step unclear.

## My contribution

I translated field requirements into workflows, organized data, troubleshot issues and refined the portal with staff feedback. I used Codex for AI-assisted implementation and review. The original uses React, TypeScript and Supabase/PostgreSQL for intake, cohort/session planning, attendance and follow-up.

My role combined building with operations: making the tool useful required listening to the people using it and helping them adopt the workflow.

## Decisions that mattered

| Staff need | My design decision | Why it mattered |
| --- | --- | --- |
| Find the next action | Connect intake, group membership, sessions, attendance and follow-up | Give staff one consistent operational view |
| Make workable assignments | Consider availability and venue/location context | Surface scheduling constraints before staff commit |
| Interpret attendance correctly | Keep unrecorded distinct from present and absent | Avoid treating missing information as an outcome |
| Continue follow-up across staff | Record contact outcomes and the next action | Preserve context when work changes hands |
| Handle conflicting intake | Require explicit review of apparent duplicates | Keep uncertainty visible and preserve original records |
| Handle private contact details | Separate ordinary operations from restricted contact workflows | Make privacy part of the workflow |

## Outcome and what I can support

The portal brought together workflows that I estimate had been spread across roughly 20 spreadsheets. It helped address attendance, contacting and group-organization problems and became my largest product project.

Team and spreadsheet counts are my approximate account of the work. I have not established measured before/after time savings or error reductions. Workshop counts in older career materials have different accounts, so I do not use them here as an audited outcome. Research findings are outside this case study.

## Try a product decision

In the fictional demo, open Workshop schedule and attempt an assignment that conflicts with availability or capacity. The demo explains the rejected change and preserves the valid schedule. Record attendance to see totals calculated from the same assignments.

Harbor uses invented applicants, venues, capacities and rules, with nine documented domain checks. Its screenshots and code are a reconstruction; they do not certify the original portal's production reliability or security.

## What I learned

Useful software starts with the questions people struggle to answer. Making the next action clear, preserving uncertainty and iterating with field staff mattered as much as adding features.

The public release includes no participant records, contact details, operational exports, private endpoints, study methods or original Git history. Original rights and access remain separate.
