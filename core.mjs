// All records and rules below are invented for this generic demonstration.
export function createInitialState() {
  return {
    applicants: [
      { id: 'a01', alias: 'Applicant A01', reference: 'HBR-001', available: ['early'] },
      { id: 'a02', alias: 'Applicant A02', reference: 'HBR-002', available: ['early'] },
      { id: 'a03', alias: 'Applicant A03', reference: 'HBR-003', available: ['late'] },
      { id: 'a04', alias: 'Applicant A04', reference: 'HBR-004', available: ['late'] },
      { id: 'a05', alias: 'Applicant A05', reference: 'HBR-005', available: ['early'] },
      { id: 'a06', alias: 'Applicant A06', reference: 'HBR-001', available: ['early'] },
    ],
    intake: [
      ...['a01', 'a02', 'a03', 'a04', 'a05'].map((id) => ({ id: `intake-${id}`, applicantId: id, disposition: 'accepted' })),
      { id: 'intake-a06', applicantId: 'a06', disposition: 'pending', duplicateOf: 'a01' },
    ],
    mentors: [
      { id: 'north', alias: 'Mentor North', available: ['early', 'late'] },
      { id: 'south', alias: 'Mentor South', available: ['late'] },
    ],
    workshops: [
      { id: 'device', title: 'Device basics', location: 'North Studio', slot: 'early', capacity: 3, mentorId: 'north' },
      { id: 'passwords', title: 'Safer passwords', location: 'South Library', slot: 'late', capacity: 2, mentorId: 'south' },
    ],
    assignments: [
      { id: 'assignment-a01', applicantId: 'a01', workshopId: 'device' },
      { id: 'assignment-a02', applicantId: 'a02', workshopId: 'device' },
      { id: 'assignment-a03', applicantId: 'a03', workshopId: 'passwords' },
    ],
    attendance: {},
  };
}

export const slotLabels = { early: 'Morning', late: 'Afternoon' };
const failure = (state, message) => ({ ok: false, state, message });
const success = (state, message) => ({ ok: true, state, message });

export function resolveIntake(state, itemId, decision) {
  const item = state.intake.find((row) => row.id === itemId);
  if (!item || item.disposition !== 'pending') return failure(state, 'This item is already resolved or unavailable.');
  if (!['keep-separate', 'dismiss-duplicate'].includes(decision)) return failure(state, 'Choose a review outcome.');
  const disposition = decision === 'keep-separate' ? 'accepted' : 'dismissed';
  const next = { ...state, intake: state.intake.map((row) => row.id === itemId ? { ...row, disposition } : row) };
  return success(next, decision === 'keep-separate' ? 'Kept as a separate applicant. No identities were merged.' : 'Dismissed the duplicate submission. The original applicant is unchanged.');
}

export function approvedApplicants(state) {
  const ids = new Set(state.intake.filter((row) => row.disposition === 'accepted').map((row) => row.applicantId));
  return state.applicants.filter((row) => ids.has(row.id));
}

export function assignApplicant(state, applicantId, workshopId) {
  const person = approvedApplicants(state).find((row) => row.id === applicantId);
  const workshop = state.workshops.find((row) => row.id === workshopId);
  if (!person || !workshop) return failure(state, 'Choose an approved applicant and an available workshop.');
  if (state.assignments.some((row) => row.applicantId === applicantId)) return failure(state, 'This applicant already has a workshop assignment.');
  const assigned = state.assignments.filter((row) => row.workshopId === workshopId);
  if (assigned.length >= workshop.capacity) return failure(state, 'This workshop is full. The schedule was not changed.');
  if (!person.available.includes(workshop.slot)) return failure(state, 'This applicant is unavailable in that slot. The schedule was not changed.');
  const assignment = { id: `assignment-${applicantId}`, applicantId, workshopId };
  return success({ ...state, assignments: [...state.assignments, assignment] }, `${person.alias} was assigned to ${workshop.title}.`);
}

export function configureWorkshop(state, workshopId, mentorId, slot) {
  const workshop = state.workshops.find((row) => row.id === workshopId);
  const mentor = state.mentors.find((row) => row.id === mentorId);
  if (!workshop || !mentor || !Object.hasOwn(slotLabels, slot)) return failure(state, 'Choose a workshop, mentor, and slot.');
  if (!mentor.available.includes(slot)) return failure(state, 'The mentor is unavailable in that slot. The session was not changed.');
  if (state.workshops.some((row) => row.id !== workshopId && row.mentorId === mentorId && row.slot === slot)) return failure(state, 'That mentor already has a workshop in this slot. The session was not changed.');
  const attendees = state.assignments.filter((row) => row.workshopId === workshopId).map((row) => state.applicants.find((person) => person.id === row.applicantId));
  if (attendees.some((person) => !person.available.includes(slot))) return failure(state, 'An assigned applicant is unavailable in that slot. The session was not changed.');
  return success({ ...state, workshops: state.workshops.map((row) => row.id === workshopId ? { ...row, mentorId, slot } : row) }, 'Session updated. Existing attendance was preserved.');
}

export function recordAttendance(state, assignmentId, status) {
  if (!state.assignments.some((row) => row.id === assignmentId) || !['present', 'absent', 'unrecorded'].includes(status)) return failure(state, 'Choose a scheduled applicant and a valid attendance status.');
  const attendance = { ...state.attendance };
  if (status === 'unrecorded') delete attendance[assignmentId];
  else attendance[assignmentId] = status;
  return success({ ...state, attendance }, 'Attendance updated. The totals now match these assignments.');
}

export function getStats(state, workshopId) {
  const rows = state.assignments.filter((row) => !workshopId || row.workshopId === workshopId);
  const present = rows.filter((row) => state.attendance[row.id] === 'present').length;
  const absent = rows.filter((row) => state.attendance[row.id] === 'absent').length;
  return { approved: approvedApplicants(state).length, pending: state.intake.filter((row) => row.disposition === 'pending').length, scheduled: rows.length, present, absent, unrecorded: rows.length - present - absent };
}
