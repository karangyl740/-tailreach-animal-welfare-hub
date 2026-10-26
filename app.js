'use strict';
/* TailReach — page content lives in the DATA arrays below. Loops (map / for…of / forEach)
   turn that data into cards, chips, steps and form logic. Edit the data, not the HTML. */

/* ---------- DATA ---------- */
const photo = (id, w) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=82`;
const CATEGORIES = [
  { name: 'Feeding', dot: 'feeding' },
  { name: 'Medical care', dot: 'medical' },
  { name: 'Awareness', dot: 'awareness' }
];
const CAMPAIGNS = [
  { id: 'feeding', title: 'Neighbourhood feeding drive', category: 'Feeding', read: 3, percent: 68,
    photo: 'photo-1548199973-03cce0bbc87b', alt: 'Two dogs spending time outdoors',
    blurb: 'A coordinated feeding round with a focus on clean water and safe, familiar feeding points.',
    summary: 'A sample community feeding initiative focused on consistent care, clean water, and safe, familiar feeding points. The prototype shows how a campaign team could describe a goal and keep people informed.',
    goal: '100 care kits', activity: 'Feeding & clean water',
    updates: [['Week 1 · Planning', 'Identify safe public points and prepare a simple volunteer checklist.'], ['Week 2 · Community', 'Share a reminder about hygienic feeding and keeping public spaces clean.'], ['Next step · Demo', 'Invite interested volunteers to review the checklist and suggest improvements.']] },
  { id: 'medical', title: 'Paws to recovery', category: 'Medical care', read: 4, percent: 42,
    photo: 'photo-1543466835-00a7907e9de1', alt: 'Close-up portrait of a dog',
    blurb: 'Help people understand the steps involved in safe treatment, follow-up, and recovery support.',
    summary: 'A sample awareness campaign explaining why veterinary assessment, follow-up care, and calm recovery spaces matter. It is educational content, not medical advice or a real case record.',
    goal: '20 care visits', activity: 'Medical-care awareness',
    updates: [['Learn', 'Explain how to contact a qualified veterinarian when an animal appears injured or unwell.'], ['Share', 'Provide a short, easy-to-share awareness message for community channels.'], ['Next step · Demo', 'Invite people to help proofread the campaign wording for clarity.']] },
  { id: 'awareness', title: 'Kind streets, kind choices', category: 'Awareness', read: 2, percent: 81,
    photo: 'photo-1450778869180-41d0601e046e', alt: 'Dog sitting in a grassy outdoor space',
    blurb: 'A shareable awareness drive with simple ways to respond to animals with patience and care.',
    summary: 'A sample public-awareness drive with simple reminders about responding patiently to stray animals and sharing reliable animal-welfare information.',
    goal: '500 shares', activity: 'Community awareness',
    updates: [['Message', 'Keep the campaign copy short, empathetic, and easy to understand.'], ['Distribution', 'Make each campaign page easy to copy and share through common messaging apps.'], ['Next step · Demo', 'Try the message with a few readers and note what is unclear.']] },
  { id: 'water', title: 'A bowl of clean water', category: 'Feeding', read: 3, percent: 55,
    photo: 'photo-1537151608828-ea2b11777ee8', alt: 'A happy dog outdoors',
    blurb: 'A practical community reminder about clean water, shade, and keeping shared spaces tidy.',
    summary: 'A sample community reminder about clean water, shade, and keeping shared spaces tidy. Any real programme should follow local guidance and the animal-care team’s instructions.',
    goal: '40 water points', activity: 'Feeding & clean water',
    updates: [['Reminder', 'Refresh water bowls regularly and keep the surrounding area clean where it is safe to do so.'], ['Community', 'Share the message with neighbours and local community groups.'], ['Next step · Demo', 'Collect suggestions for clear, respectful poster wording.']] }
];
const STRIP = [['✳', 'Animal welfare awareness'], ['↗', 'Easy-to-share campaigns'], ['♡', 'Volunteer-first experience']];
const STEPS = [
  ['01', 'Discover', 'Browse campaign goals, updates, and the kind of help being requested.', '⌕'],
  ['02', 'Choose', 'Pick an action that fits your time, interests, and comfort level.', '↗'],
  ['03', 'Pass it on', 'Share an awareness campaign so useful information can travel farther.', '♡']
];
const APPROACH = [
  ['Campaigns with context', 'Goals, updates, and sample progress in one place.'],
  ['Designed for small screens', 'Readable content and clear actions on mobile.'],
  ['Sharing without friction', 'Copy a campaign link or share it through WhatsApp.']
];

/* ---------- HELPERS ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = s => String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const pad = n => String(n).padStart(2, '0');
const fill = (sel, items, template) => { $(sel).innerHTML = items.map(template).join(''); };
const DOT = Object.fromEntries(CATEGORIES.map(c => [c.name, c.dot]));
const byId = new Map(CAMPAIGNS.map(c => [c.id, c]));
for (const c of CAMPAIGNS) c.haystack = [c.title, c.category, c.blurb, c.goal,c.activity].join(' ').toLowerCase();

const grid = $('#campaignGrid'), searchInput = $('#campaignSearch'), resultsStatus = $('#resultsStatus');
const emptyState = $('#emptyState'), campaignDialog = $('#campaignDialog'), volunteerDialog = $('#volunteerDialog');
const dialogContent = $('#dialogContent'), toast = $('#toast');
const state = { category: 'All' };
let toastTimer;

function announce(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2700);
}
const setHash = h => { try { history.replaceState(null, '', h); } catch { /* file:// or sandboxed */ } };
const campaignUrl = id => `${location.href.split('#')[0]}#campaigns-${id}`;

/* ---------- RENDER: every repeated block is a loop over data ---------- */
fill('#trustStrip', STRIP, ([icon, text]) => `<div><span class="strip-symbol" aria-hidden="true">${icon}</span><span>${text}</span></div>`);
fill('#stepsList', STEPS, ([no, title, text, icon]) => `<div class="step-row"><span class="step-no">${no}</span><div><h3>${title}</h3><p>${text}</p></div><span class="step-symbol" aria-hidden="true">${icon}</span></div>`);
fill('#approachPoints', APPROACH, ([title, text]) => `<div><span class="check-mark" aria-hidden="true">✓</span><span><strong>${title}</strong><small>${text}</small></span></div>`);

const chipData = [{ name: 'All', label: 'All campaigns', n: CAMPAIGNS.length },
  ...CATEGORIES.map(c => ({ name: c.name, label: c.name, n: CAMPAIGNS.filter(x => x.category === c.name).length }))];
fill('#filterGroup', chipData, (chip, i) => `<button type="button" class="filter-chip${i ? '' : ' is-active'}" data-filter="${esc(chip.name)}" aria-pressed="${i ? 'false' : 'true'}">${chip.label} <span>${pad(chip.n)}</span></button>`);

fill('#campaignGrid', CAMPAIGNS, c => `
  <article class="campaign-card" data-id="${c.id}">
    <button type="button" class="card-image-button" data-details="${c.id}" aria-label="View ${esc(c.title)} details"><img src="${photo(c.photo, 900)}" alt="${esc(c.alt)}" loading="lazy" decoding="async" /><span class="image-tag">SAMPLE CAMPAIGN</span><span class="card-arrow" aria-hidden="true">↗</span></button>
    <div class="card-body">
      <div class="card-meta"><span class="category-dot dot-${DOT[c.category]}"></span> ${esc(c.category.toUpperCase())} <span class="meta-separator">·</span> ${c.read} MIN READ</div>
      <h3>${esc(c.title)}</h3><p>${esc(c.blurb)}</p>
      <div class="progress-head"><span>Illustrative progress</span><strong>${c.percent}%</strong></div>
      <div class="progress-track" role="progressbar" aria-label="${esc(c.title)}: illustrative progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${c.percent}" aria-valuetext="${c.percent}% (illustrative)"><span data-w="${c.percent}"></span></div>
      <div class="card-footer"><span>Goal: ${esc(c.goal)} <i>· sample</i></span><button type="button" class="text-link" data-details="${c.id}" aria-label="View details: ${esc(c.title)}">View details <span aria-hidden="true">→</span></button></div>
    </div>
  </article>`);

const cardEls = new Map();
for (const el of grid.children) cardEls.set(el.dataset.id, el);
const chips = $$('[data-filter]');

/* ---------- FILTER + SEARCH ---------- */
function updateCampaigns() {
  const q = searchInput.value.trim().toLowerCase();
  let shown = 0;
  for (const c of CAMPAIGNS) {
    const visible = (state.category === 'All' || c.category === state.category) && (!q || c.haystack.includes(q));
    cardEls.get(c.id).hidden = !visible;
    if (visible) shown++;
  }
  resultsStatus.textContent = shown ? `Showing ${shown} of ${CAMPAIGNS.length} sample campaigns` : 'No campaigns match your filters';
  emptyState.hidden = shown > 0;
  grid.hidden = shown === 0;
}
function setCategory(name) {
  state.category = name;
  for (const chip of chips) {
    const on = chip.dataset.filter === name;
    chip.classList.toggle('is-active', on);
    chip.setAttribute('aria-pressed', String(on));
  }
  updateCampaigns();
}
chips.forEach(chip => chip.addEventListener('click', () => setCategory(chip.dataset.filter)));
searchInput.addEventListener('input', updateCampaigns);
$('#resetFilters').addEventListener('click', () => { searchInput.value = ''; setCategory('All'); searchInput.focus(); });

/* Progress bars fill when they scroll into view (CSS removes the motion for reduced-motion users). */
const growBar = track => { const bar = track.firstElementChild; bar.style.width = `${bar.dataset.w}%`; };
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries, obs) => {
    for (const e of entries) if (e.isIntersecting) { growBar(e.target); obs.unobserve(e.target); }
  }, { threshold: 0.4 });
  $$('.progress-track').forEach(t => io.observe(t));
} else $$('.progress-track').forEach(growBar);

/* Images that fail to load fall back to the tinted paw placeholder instead of a broken icon. */
document.addEventListener('error', e => { if (e.target.tagName === 'IMG') e.target.classList.add('is-broken'); }, true);
for (const img of document.images) if (img.complete && !img.naturalWidth) img.classList.add('is-broken');

/* ---------- DIALOGS (one loop wires every <dialog>) ---------- */
function showDialog(d) {
  if (!d.open) d.showModal();
  document.body.classList.add('modal-open');
}
$$('dialog').forEach(d => {
  const outside = e => { const r = d.getBoundingClientRect(); return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom; };
  let pressedOnBackdrop = false;
  d.addEventListener('pointerdown', e => { pressedOnBackdrop = e.target === d && outside(e); });
  d.addEventListener('click', e => { if (pressedOnBackdrop && e.target === d && outside(e)) d.close(); pressedOnBackdrop = false; });
  d.addEventListener('close', () => { if (!$$('dialog').some(x => x.open)) document.body.classList.remove('modal-open'); });
});

function openCampaign(id) {
  const c = byId.get(id);
  if (!c) return;
  const info = [['Demo goal', `${c.goal}. Not a real fundraising target.`],
    ['Sample status', `Illustrative progress: ${c.percent}%. This figure is fictional.`],
    ['Activity', c.activity],
    ['How to participate', 'Learn about the campaign, share the message, or preview the volunteer-interest form.']]
    .map(([h, t]) => `<div class="dialog-info"><strong>${h}</strong><small>${esc(t)}</small></div>`).join('');
  const updates = c.updates.map(([h, t]) => `<li><strong>${esc(h)}</strong>${esc(t)}</li>`).join('');
  dialogContent.innerHTML = `
    <div class="campaign-modal-content">
      <div class="dialog-photo"><img src="${photo(c.photo, 1000)}" alt="${esc(c.alt)}" decoding="async" /><span>ILLUSTRATIVE DEMO DATA</span></div>
      <div class="dialog-meta">${esc(c.category)} · INDEPENDENT CONCEPT</div>
      <h2 id="dialogTitle">${esc(c.title)}</h2>
      <p class="dialog-summary">${esc(c.summary)}</p>
      <div class="dialog-info-grid">${info}</div>
      <h3>Campaign notes</h3><ol class="update-list">${updates}</ol>
      <div class="dialog-actions">
        <button type="button" class="button button-primary" data-modal-volunteer>Preview volunteer form <span aria-hidden="true">↗</span></button>
        <button type="button" class="button button-outline" data-share-campaign="${c.id}">Share on WhatsApp <span aria-hidden="true">↗</span></button>
        <button type="button" class="button button-outline" data-copy-campaign="${c.id}">Copy link <span aria-hidden="true">⧉</span></button>
      </div>
      <p class="form-disclaimer">TailReach is a portfolio prototype, not affiliated with Hope Behind Tails Foundation. No real donations are accepted; all campaign details are fictional.</p>
    </div>`;
  showDialog(campaignDialog);
  campaignDialog.scrollTop = 0;
  setHash(`#campaigns-${c.id}`);
}
campaignDialog.addEventListener('close', () => { if (location.hash.startsWith('#campaigns-')) setHash('#campaigns'); });

function openVolunteer() {
  if (campaignDialog.open) campaignDialog.close();
  showDialog(volunteerDialog);
}

/* One delegated listener handles every button, including ones created by the render loops. */
document.addEventListener('click', e => {
  const hit = sel => e.target.closest(sel);
  let el;
  if ((el = hit('[data-details]'))) openCampaign(el.dataset.details);
  else if ((el = hit('[data-share-campaign]'))) shareCampaign(el.dataset.shareCampaign);
  else if ((el = hit('[data-copy-campaign]'))) copyCampaign(el.dataset.copyCampaign);
  else if (hit('[data-modal-volunteer], [data-open-volunteer]')) openVolunteer();
  else if ((el = hit('[data-close]'))) el.closest('dialog').close();
});

/* ---------- SHARE + COPY ---------- */
async function copyCampaign(id) {
  const url = campaignUrl(id);
  try { await navigator.clipboard.writeText(url); announce('Campaign link copied.'); }
  catch { fallbackCopy(url); }
}
function fallbackCopy(text) {
  const field = document.createElement('textarea');
  field.value = text; field.setAttribute('readonly', '');
  field.style.cssText = 'position:fixed;opacity:0';
  document.body.appendChild(field); field.select();
  let copied = false;
  try { copied = document.execCommand('copy'); } catch { copied = false; }
  field.remove();
  announce(copied ? 'Campaign link copied.' : 'Copy unavailable in this browser. Use the address bar to share the demo.');
}
function shareCampaign(id) {
  const c = byId.get(id);
  const text = `Explore this TailReach sample animal-welfare campaign: ${c.title}. Demo concept only. ${campaignUrl(id)}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
}

/* ---------- VOLUNTEER FORM: rules array + loops replace five copy-pasted blocks ---------- */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FIELDS = [
  { el: 'visitorName', err: 'nameError', ok: v => v.trim().length >= 2, msg: 'Please enter at least 2 characters.' },
  { el: 'visitorEmail', err: 'emailError', ok: v => !v.trim() || EMAIL.test(v.trim()), msg: 'Enter a valid email format or leave this field blank.' },
  { el: 'interestArea', err: 'interestError', ok: v => !!v, msg: 'Please choose an activity.' },
  { el: 'availability', err: 'availabilityError', ok: v => !!v, msg: 'Please choose an option.' },
  { el: 'privacyDemo', err: 'consentError', ok: (v, f) => f.checked, msg: 'Please confirm you understand this is a demo.' }
].map(f => ({ ...f, el: document.getElementById(f.el), errEl: document.getElementById(f.err) }));
const form = $('#volunteerForm'), formSuccess = $('#formSuccess');
let submitted = false;
formSuccess.tabIndex = -1;

function validateField(f) {
  const ok = f.ok(f.el.value, f.el);
  f.errEl.textContent = ok ? '' : f.msg;
  f.el.setAttribute('aria-invalid', String(!ok));
  return ok;
}
function resetForm() {
  form.reset(); submitted = false;
  form.hidden = false; formSuccess.hidden = true;
  for (const f of FIELDS) { f.errEl.textContent = ''; f.el.removeAttribute('aria-invalid'); }
}
for (const f of FIELDS) {
  f.el.setAttribute('aria-describedby', f.errEl.id);                 // errors are now announced with their field
  f.el.addEventListener(f.el.matches('input:not([type=checkbox])') ? 'input' : 'change', () => { if (submitted) validateField(f); });
}
form.addEventListener('submit', e => {
  e.preventDefault();
  submitted = true;
  let firstBad = null;
  for (const f of FIELDS) if (!validateField(f) && !firstBad) firstBad = f.el;
  if (firstBad) { firstBad.focus(); return; }
  form.hidden = true; formSuccess.hidden = false; formSuccess.focus();
});
volunteerDialog.addEventListener('close', resetForm);
$('#closeSuccess').addEventListener('click', () => {
  volunteerDialog.close();
  requestAnimationFrame(() => $('#campaigns').scrollIntoView());
});

/* ---------- MOBILE NAV ---------- */
const menuToggle = $('#menuToggle'), primaryNav = $('#primaryNav');
function setNav(open) {
  primaryNav.classList.toggle('is-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
}
menuToggle.addEventListener('click', () => setNav(!primaryNav.classList.contains('is-open')));
$$('a, button', primaryNav).forEach(item => item.addEventListener('click', () => setNav(false)));
document.addEventListener('click', e => { if (!e.target.closest('.site-header')) setNav(false); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && primaryNav.classList.contains('is-open')) { setNav(false); menuToggle.focus(); }
});

/* ---------- SHARED LINKS: open on load AND when the hash changes in an already-open tab ---------- */
function openFromHash() {
  const m = /^#campaigns-([\w-]+)$/.exec(location.hash);
  if (m && byId.has(m[1])) { $('#campaigns').scrollIntoView({ behavior: 'instant' }); openCampaign(m[1]); }
}
window.addEventListener('hashchange', openFromHash);

updateCampaigns();
openFromHash();
