# Product case study: Harbor Workshops

## Context

I built and supported operational tooling for the GALS Cambodia project. The original portal and research materials remain private. Harbor Workshops is independently constructed from generic workflow goals so an employer can inspect product and engineering decisions without private source, records, or study rules.

## Product decisions

| Need | Decision | Observable behavior |
| --- | --- | --- |
| Review ambiguous intake | Explicit keep-separate or dismiss decision | No identity merge occurs silently |
| Fill limited seats | Validate capacity and availability before assigning | A rejected assignment preserves the existing roster |
| Avoid conflicting mentorship | Check a proposed schedule as a whole | A mentor conflict rejects the change and retains the valid schedule |
| Interpret attendance accurately | Preserve present, absent, and unrecorded separately | Missing attendance does not inflate absence |
| Make public exploration safe | Invented fixtures and in-memory state only | Reload restores fixtures; there are no production connections |

## Scope and tradeoffs

The demonstration prioritizes three complete workflows over a broad imitation of the protected portal. No real research randomization, treatments, protocol thresholds, communications, participant information, financial data, or private integrations are reproduced. The invented organization and validation rules are not claims about original research procedures.

State reset makes the demo easy to explore and removes the need to collect identities. It also means there is no collaboration, persistent scheduling, or production audit trail. These would need separately reviewed authentication, authorization, persistence, and privacy controls.

## Contributions and outcomes

I supplied operations context, product direction, and privacy constraints. Codex constructed the generic fixtures, implementation, documentation, and checks. The result demonstrates workflow judgment and AI-assisted implementation. Nine domain checks and local browser review establish behavior of the invented showcase. They do not establish original-system adoption, time savings, field reliability, or user acceptance.

Proposed future evaluation: observe coordinators completing intake, roster, and attendance tasks; measure task success, mistakes, and explanation clarity; compare missing-data interpretation before and after training. These are evaluation plans, not measured outcomes.

## Lessons and next steps

Explicit ambiguity handling and rejection messages help an operator understand the next step. Validating before state changes prevents partial failures. A field-reviewed Khmer interface and actual usability sessions remain future work. The [original GALS case study](FIELD_OPERATIONS_CASE_STUDY.md) explains my contribution and qualitative outcomes. Measured before/after results and independently confirmed adoption remain future evidence.
