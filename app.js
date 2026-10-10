import { createInitialState, resolveIntake, approvedApplicants, assignApplicant, configureWorkshop, recordAttendance, getStats, slotLabels } from './core.mjs';

let state = createInitialState();
let view = 'intake';
let attendanceWorkshop = 'all';
const content = document.querySelector('#content');
const notice = document.querySelector('#notice');

function el(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}
function action(text, fn, className = 'primary') {
  const button = el('button', text, className);
  button.type = 'button';
  button.addEventListener('click', fn);
  return button;
}
function panel(title, description) {
  const container = el('div', undefined, 'panel');
  const header = el('div', undefined, 'panel-heading');
  const label = el('div');
  label.append(el('h2', title), el('p', description));
  header.append(label);
  const body = el('div', undefined, 'panel-body');
  container.append(header, body);
  return { container, header, body };
}
function selectControl(label, choices, selected) {
  const wrapper = el('label', label);
  const select = el('select');
  select.setAttribute('aria-label', label);
  for (const [value, name] of choices) {
    const option = el('option', name);
    option.value = value;
    option.selected = value === selected;
    select.append(option);
  }
  wrapper.append(select);
  return { wrapper, select };
}
function apply(result) {
  if (result.ok) state = result.state;
  render();
  notice.hidden = false;
  notice.className = result.ok ? 'notice' : 'notice error';
  notice.textContent = result.message;
}
function renderMetrics() {
  const stats = getStats(state);
  const metrics = document.querySelector('#metrics');
  metrics.replaceChildren();
  for (const [value, label] of [[stats.pending, 'Intake awaiting review'], [stats.approved, 'Approved applicants'], [stats.scheduled, 'Workshop assignments'], [`${stats.present + stats.absent}/${stats.scheduled}`, 'Attendance recorded']]) {
    const card = el('div', undefined, 'metric');
    card.append(el('strong', String(value)), el('span', label));
    metrics.append(card);
  }
}
function renderIntake() {
  const pending = state.intake.find((row) => row.disposition === 'pending');
  const review = panel('One decision, no silent merges.', 'A matching fictional reference is a review signal, not proof of identity.');
  if (pending) {
    review.header.append(el('span', 'Needs review', 'badge pending'));
    const grid = el('div', undefined, 'review-grid');
    for (const [id, label] of [[pending.duplicateOf, 'Existing applicant'], [pending.applicantId, 'New submission']]) {
      const person = state.applicants.find((row) => row.id === id);
      const card = el('div', undefined, id === pending.applicantId ? 'record-card flagged' : 'record-card');
      card.append(el('p', label, 'eyebrow'), el('h3', person.alias), el('p', `Fictional reference: ${person.reference}`), el('p', `Available: ${person.available.map((slot) => slotLabels[slot]).join(', ')}`));
      grid.append(card);
    }
    const buttons = el('div', undefined, 'action-row');
    buttons.append(action('Keep as separate applicant', () => apply(resolveIntake(state, pending.id, 'keep-separate'))), action('Dismiss duplicate submission', () => apply(resolveIntake(state, pending.id, 'dismiss-duplicate')), 'secondary'));
    review.body.append(grid, el('p', 'Choose a deliberate outcome. Both original records remain intact; no contact information is involved.', 'help'), buttons);
  } else {
    const done = el('div', undefined, 'empty');
    done.append(el('strong', 'Intake review complete.'), el('p', 'Continue to the schedule, or reset the fictional example.'));
    review.body.append(done, action('Open workshop schedule', () => navigate('schedule'), 'secondary full-width'));
  }
  content.append(review.container);
  const list = panel('Intake register', 'Invented aliases and review states only.');
  list.body.className = 'table-wrap';
  const table = el('table');
  const head = el('thead');
  const header = el('tr');
  for (const title of ['Applicant', 'Reference', 'Review state']) header.append(el('th', title));
  head.append(header);
  const body = el('tbody');
  for (const item of state.intake) {
    const person = state.applicants.find((row) => row.id === item.applicantId);
    const row = el('tr');
    const cell = el('td');
    cell.append(el('strong', person.alias));
    const badgeCell = el('td');
    const text = { accepted: 'Accepted', pending: 'Needs review', dismissed: 'Dismissed' }[item.disposition];
    badgeCell.append(el('span', text, `badge ${item.disposition}`));
    row.append(cell, el('td', person.reference), badgeCell);
    body.append(row);
  }
  table.append(head, body);
  list.body.append(table);
  content.append(list.container);
}
function renderSchedule() {
  const grid = el('div', undefined, 'workshop-grid');
  for (const workshop of state.workshops) {
    const mentor = state.mentors.find((row) => row.id === workshop.mentorId);
    const rows = state.assignments.filter((row) => row.workshopId === workshop.id);
    const card = panel(workshop.title, `${workshop.location} · ${slotLabels[workshop.slot]} · ${mentor.alias}`);
    card.header.append(el('span', `${rows.length}/${workshop.capacity} seats`, 'seat-count'));
    const roster = el('ul', undefined, 'roster');
    for (const row of rows) roster.append(el('li', state.applicants.find((person) => person.id === row.applicantId).alias));
    card.body.append(roster);
    const available = approvedApplicants(state).filter((person) => !state.assignments.some((row) => row.applicantId === person.id));
    const choices = [['', 'Choose an applicant'], ...available.map((person) => [person.id, `${person.alias} · ${person.available.map((slot) => slotLabels[slot]).join(', ')}`])];
    const field = selectControl(`Applicant for ${workshop.title}`, choices, '');
    const form = el('div', undefined, 'form-row');
    form.append(field.wrapper, action('Assign seat', () => apply(assignApplicant(state, field.select.value, workshop.id))));
    card.body.append(form, el('p', 'Availability and capacity are checked before the schedule changes.', 'help'));
    const settings = el('details', undefined, 'session-settings');
    settings.append(el('summary', `Edit ${workshop.title} session`));
    const mentorField = selectControl(`Mentor for ${workshop.title}`, state.mentors.map((person) => [person.id, person.alias]), workshop.mentorId);
    const slotField = selectControl(`Slot for ${workshop.title}`, Object.entries(slotLabels), workshop.slot);
    const settingsRow = el('div', undefined, 'form-row');
    settingsRow.append(mentorField.wrapper, slotField.wrapper);
    settings.append(settingsRow, action('Update session', () => apply(configureWorkshop(state, workshop.id, mentorField.select.value, slotField.select.value)), 'secondary full-width'), el('p', 'Mentor North is available in both slots; Mentor South is afternoon-only. Overlapping mentor assignments are blocked.', 'help'));
    card.body.append(settings);
    grid.append(card.container);
  }
  content.append(grid);
  const hint = el('div', undefined, 'panel');
  const body = el('div', undefined, 'panel-body');
  body.append(el('h3', 'Try a constraint'), el('p', 'Assign A05 to Device basics to fill its last seat. After keeping A06 as a separate applicant, try adding A06 to the same workshop. You can also try moving Safer passwords to Mentor North’s morning slot.', 'help'));
  hint.append(body);
  content.append(hint);
}
function renderAttendance() {
  const block = panel('Make the record match the room.', 'A missing record stays unrecorded; it is never counted as an absence.');
  const filter = selectControl('Workshop filter', [['all', 'All workshops'], ...state.workshops.map((row) => [row.id, row.title])], attendanceWorkshop);
  filter.select.addEventListener('change', () => { attendanceWorkshop = filter.select.value; render(); });
  const toolbar = el('div', undefined, 'attendance-toolbar');
  toolbar.append(filter.wrapper);
  const stats = getStats(state, attendanceWorkshop === 'all' ? undefined : attendanceWorkshop);
  const summary = el('div', undefined, 'inline-summary');
  for (const [label, count] of [['Present', stats.present], ['Absent', stats.absent], ['Unrecorded', stats.unrecorded]]) {
    const item = el('span');
    item.append(el('strong', String(count)), document.createTextNode(` ${label}`));
    summary.append(item);
  }
  const meter = el('div', undefined, 'meter');
  meter.setAttribute('aria-hidden', 'true');
  const rows = state.assignments.filter((row) => attendanceWorkshop === 'all' || row.workshopId === attendanceWorkshop);
  for (const row of rows) meter.append(el('span', undefined, `meter-segment ${state.attendance[row.id] || 'unrecorded'}`));
  block.body.append(toolbar, summary, meter);
  const wrap = el('div', undefined, 'table-wrap');
  const table = el('table', undefined, 'attendance-table');
  const head = el('thead');
  const header = el('tr');
  for (const title of ['Applicant', 'Workshop', 'Attendance']) header.append(el('th', title));
  head.append(header);
  const body = el('tbody');
  for (const row of rows) {
    const person = state.applicants.find((item) => item.id === row.applicantId);
    const workshop = state.workshops.find((item) => item.id === row.workshopId);
    const record = el('tr');
    const field = selectControl(`Attendance for ${person.alias}`, [['unrecorded', 'Unrecorded'], ['present', 'Present'], ['absent', 'Absent']], state.attendance[row.id] || 'unrecorded');
    field.select.className = 'attendance-select';
    field.select.addEventListener('change', () => {
      apply(recordAttendance(state, row.id, field.select.value));
      content.querySelector(`select[aria-label="Attendance for ${person.alias}"]`)?.focus();
    });
    const cell = el('td');
    cell.append(field.select);
    record.append(el('td', person.alias), el('td', workshop.title), cell);
    body.append(record);
  }
  table.append(head, body);
  wrap.append(table);
  block.body.append(wrap);
  content.append(block.container);
}
function navigate(next) {
  view = next;
  notice.hidden = true;
  render();
}
function render() {
  const headings = {
    intake: ['Step 01 / Review', 'A clear next step for every intake.', 'Resolve an invented duplicate before it enters the schedule.'],
    schedule: ['Step 02 / Schedule', 'The right people. A workable plan.', 'Place approved applicants while respecting capacity and availability.'],
    attendance: ['Step 03 / Record', 'Small updates. A reliable picture.', 'Record attendance and keep the totals tied to the same assignments.'],
  };
  const [label, title, description] = headings[view];
  document.querySelector('#section-label').textContent = label;
  document.querySelector('#page-title').textContent = title;
  document.querySelector('#page-description').textContent = description;
  for (const button of document.querySelectorAll('[data-view]')) {
    button.classList.toggle('active', button.dataset.view === view);
    if (button.dataset.view === view) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  }
  renderMetrics();
  content.replaceChildren();
  ({ intake: renderIntake, schedule: renderSchedule, attendance: renderAttendance })[view]();
}
document.querySelectorAll('[data-view]').forEach((button) => button.addEventListener('click', () => navigate(button.dataset.view)));
document.querySelector('#reset').addEventListener('click', () => {
  state = createInitialState();
  attendanceWorkshop = 'all';
  view = 'intake';
  apply({ ok: true, state, message: 'Demo reset. All invented records are back to their starting state.' });
});
render();
