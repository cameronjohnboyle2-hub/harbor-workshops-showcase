import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState, resolveIntake, approvedApplicants, assignApplicant, configureWorkshop, recordAttendance, getStats } from '../core.mjs';

test('pending intake stays outside scheduling until an explicit keep-separate decision', () => {
  const initial = createInitialState();
  assert.equal(approvedApplicants(initial).length, 5);
  assert.equal(assignApplicant(initial, 'a06', 'device').ok, false);
  const result = resolveIntake(initial, 'intake-a06', 'keep-separate');
  assert.equal(result.ok, true);
  assert.equal(approvedApplicants(result.state).length, 6);
  assert.equal(assignApplicant(result.state, 'a06', 'device').ok, true);
  assert.deepEqual(initial.intake.at(-1).disposition, 'pending');
  assert.equal(result.state.applicants.length, initial.applicants.length);
});
test('dismissal preserves the original identity and cannot be resolved twice', () => {
  const initial = createInitialState();
  const result = resolveIntake(initial, 'intake-a06', 'dismiss-duplicate');
  assert.equal(result.ok, true);
  assert.equal(getStats(result.state).pending, 0);
  assert.deepEqual(result.state.applicants[0], initial.applicants[0]);
  assert.equal(approvedApplicants(result.state).length, 5);
  assert.equal(assignApplicant(result.state, 'a06', 'device').ok, false);
  assert.equal(resolveIntake(result.state, 'intake-a06', 'keep-separate').ok, false);
});
test('full workshop rejects another applicant without mutating schedule', () => {
  let state = resolveIntake(createInitialState(), 'intake-a06', 'keep-separate').state;
  state = assignApplicant(state, 'a05', 'device').state;
  const before = structuredClone(state);
  const result = assignApplicant(state, 'a06', 'device');
  assert.equal(result.ok, false);
  assert.match(result.message, /full/);
  assert.equal(result.state, state);
  assert.deepEqual(state, before);
});
test('assigned people are not added twice and unavailable applicants are rejected', () => {
  const state = createInitialState();
  assert.equal(assignApplicant(state, 'a01', 'device').ok, false);
  assert.equal(assignApplicant(state, 'a04', 'device').ok, false);
  assert.equal(assignApplicant(state, 'a04', 'passwords').ok, true);
  assert.equal(state.assignments.length, 3);
});
test('instructor conflicts preserve the session and attendance', () => {
  const state = recordAttendance(createInitialState(), 'assignment-a01', 'present').state;
  const before = structuredClone(state);
  const result = configureWorkshop(state, 'passwords', 'north', 'early');
  assert.equal(result.ok, false);
  assert.match(result.message, /already has a workshop/);
  assert.equal(result.state, state);
  assert.deepEqual(state, before);
});
test('mentor and attendee availability constrain a session change', () => {
  const state = createInitialState();
  assert.match(configureWorkshop(state, 'device', 'south', 'early').message, /mentor is unavailable/);
  assert.match(configureWorkshop(state, 'device', 'north', 'late').message, /applicant is unavailable/);
  const result = configureWorkshop(state, 'passwords', 'north', 'late');
  assert.equal(result.ok, true);
  assert.equal(result.state.workshops[1].mentorId, 'north');
  assert.equal(state.workshops[1].mentorId, 'south');
});
test('absence remains different from missing and totals partition scheduled rows', () => {
  let state = createInitialState();
  assert.deepEqual(getStats(state), { approved: 5, pending: 1, scheduled: 3, present: 0, absent: 0, unrecorded: 3 });
  state = recordAttendance(state, 'assignment-a01', 'present').state;
  state = recordAttendance(state, 'assignment-a02', 'absent').state;
  assert.deepEqual(getStats(state, 'device'), { approved: 5, pending: 1, scheduled: 2, present: 1, absent: 1, unrecorded: 0 });
  assert.equal(getStats(state).unrecorded, 1);
  state = recordAttendance(state, 'assignment-a02', 'unrecorded').state;
  assert.equal(getStats(state).absent, 0);
  assert.equal(getStats(state).unrecorded, 2);
});
test('invalid identifiers and statuses fail without changing state', () => {
  const state = createInitialState();
  const before = structuredClone(state);
  const results = [resolveIntake(state, 'missing', 'keep-separate'), resolveIntake(state, 'intake-a06', 'merge'), assignApplicant(state, 'missing', 'device'), configureWorkshop(state, 'device', 'north', '__proto__'), recordAttendance(state, 'missing', 'present'), recordAttendance(state, 'assignment-a01', 'unknown')];
  assert.ok(results.every((result) => !result.ok && result.state === state));
  assert.deepEqual(state, before);
});
test('fresh reset restores all synthetic records and no previous state survives', () => {
  let state = recordAttendance(createInitialState(), 'assignment-a01', 'present').state;
  state = resolveIntake(state, 'intake-a06', 'dismiss-duplicate').state;
  const reset = createInitialState();
  assert.equal(getStats(reset).present, 0);
  assert.equal(getStats(reset).pending, 1);
  reset.applicants[0].alias = 'changed locally';
  assert.equal(createInitialState().applicants[0].alias, 'Applicant A01');
  assert.equal(getStats(state).present, 1);
});
