/* Split-screen skeleton: one data object (SCREENS), a tiny renderer, small handlers. Vanilla, no build. */
(() => {
'use strict';

/* ---------- ids, names, groups ---------- */
const NAMES = { '01':'projects','02':'new-project','03':'overview-decision','04':'overview-paused','05b':'interview-empty','05':'interview-running','06':'interview-finished','07':'interview-locked','08':'documents','09':'document-draft','10':'document-locked','11b':'roadmap-drafting','11':'roadmap-awaiting','12':'roadmap-approved','13':'sprints-building','13b':'sprints-blocked','14':'sprints-accepted','15':'try-it','16':'settings','17':'live-logs','18':'handoff-source','18b':'handoff-github','18c':'too-big','18d':'not-zip','18e':'github-permission','19':'handoff-copying','20':'handoff-requirements','21':'repo-connect','21b':'repo-connect-permission','21c':'repo-connect-empty','22':'repo-requests','22b':'repo-requests-empty','23':'repo-request','23b':'repo-request-blocked' };
const GROUPS = [
  ['Founder journey', ['01','02','03','04','05b','05','06','07','08','09','10','11b','11','12','13','13b','14','15','16','17'], 'col1'],
  ['Lane A: hand off', ['18','18b','18c','18d','18e','19','20'], 'col2'],
  ['Lane B: repository', ['21','21b','21c','22','22b','23','23b'], 'col3'],
];

/* ---------- tiny helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
const pin = (p) => `<span class="pin" data-pin="${p}"><i></i>${p}</span>`;
const cell = (p) => `<span class="cell" data-pin="${p}">${p}</span>`;
const box = (label, cls = '') => `<div class="box ${cls}">${label}</div>`;
const det = (sum, body, open) => `<details class="det"${open ? ' open' : ''}><summary>${sum}</summary><div>${body}</div></details>`;
const q = (label, attrs = '', cls = 'quiet') => `<button type="button" class="${cls}" ${attrs}>${label}</button>`;
const gob = (label, id, extra = '') => q(label, `data-go="${id}" ${extra}`);
const dis = (label, reason) => `<span class="row">${q(label, 'aria-disabled="true"')}<small>${reason}</small></span>`;
const head = (t, s) => `<div><h1>${t}</h1>${s ? `<p class="sub">${s}</p>` : ''}</div>`;
const ticks = (a) => `<ul class="ticks">${a.map((x) => `<li>${x}</li>`).join('')}</ul>`;
const lanes = (cur) => `<div class="row" role="group" aria-label="Where to start"><button type="button" class="chip ${cur === 0 ? 'on' : ''}" data-go="02">Describe your idea</button><button type="button" class="chip ${cur === 1 ? 'on' : ''}" data-go="18">Hand off your code</button><small>For engineering teams</small><button type="button" class="chip ${cur === 2 ? 'on' : ''}" data-go="21">Work in my repository</button></div>`;
const stepRow = (p, t, fact, extra = '') => `<li ${extra}>${pin(p)}<b>${t}</b>${fact ? `<small>${fact}</small>` : ''}</li>`;
const ai = (t) => ({ k:'ai', t });
const user = (t) => ({ k:'user', t });
const saved = (t) => ({ k:'saved', t });
const st = (p, t) => ({ k:'status', p, t });
const act = (t, p) => ({ k:'act', t, p });
const chips = (...items) => ({ k:'chips', items });
const ctx = (t) => ({ k:'ctx', t });
const STUB = st('Waiting', 'That opens GitHub in the real product. It is not part of this prototype.');

/* ---------- state ---------- */
const S = { id:'', v:'', sc:null, csc:null, chat:[], nextFn:null, comp:{}, saved:'', hist:[], prevId:'01', opts:{}, ready:false,
  draft:{ name:'test', idea:'a tic tac toe game' }, draftSet:false, fromCode:false, imported:false,
  file:'ok', gh:true, ghRepo:0, repo:0, doc:'', docFile:'', verdicts:[], notes:{}, newReqs:[], device:'Computer', words:false,
  paused:false, auto:true, projSort:'needs', projQ:'' };

/* ---------- fixtures ---------- */
const PROJECTS = [
  ['test','Needs you','Answer the next interview question.','0 of 3 documents accepted · Updated 3 days ago','03',4320],
  ['ui test','Needs you','Create your product brief; the interview is finished.','0 of 3 documents accepted · Updated 42 minutes ago','06',42],
  ['insight-weaver-537','Needs you',"Merge 'Let admins archive old workspaces' (pull request #42).",'4 requests · 1 merged · Updated 2 hours ago','22',120],
  ['todo','Working','Pramaan is building sprint 1 of 4 (building). Nothing needed from you.','3 of 3 documents accepted · Sprint 1 of 4 · Updated 22 minutes ago','13',22],
  ['WP VC app','Working','Pramaan is drafting your product brief (defining).','0 of 3 documents accepted · Updated 1 day ago','09',1440],
  ['provider-update-demo-npm-stack','Waiting','Plan approved. Sprint 1 starts in a moment.','0 of 3 documents accepted · Updated 6 days ago','12',8640],
  ['omnibound-vlmk-craft','Waiting','Plan approved. Sprint 1 starts in a moment.','0 of 3 documents accepted · Updated 1 week ago','12',10080],
  ['Todo list','Paused','Paused because the monthly budget is used up. Raise it in Settings to continue.','3 of 3 documents accepted · Updated 22 hours ago','04',1320],
  ['test first','Done','All 1 planned sprints accepted. Open your product any time.','3 of 3 documents accepted · Sprint 1 of 1 · Updated 22 hours ago','14',1321],
];
const RANK = { 'Needs you':0, 'Blocked':1, 'Working':2, 'Waiting':3, 'Paused':4, 'Done':5 };
const GLOSS = [['One-sentence outcome','The one thing it should do.'],['Evidence of the problem','What led to this brief.'],['Success contract','How we will know it works.'],['Guardrails','What must not get worse.'],['Acceptance signal','A check you can run yourself.'],['Constraints and non-goals','Its limits and what it skips.']];
const SPRINTS = [
  ['Your private checklist',['Sign up with an email and password','Log in with a wrong password and see a clear error','Log in with the right password and see your empty checklist'],'sign up, log in, land on your own empty checklist, and add your own tasks to it.','users can sign up or log in and see only their own tasks'],
  ['Keep your list',['Rename a task and see the new name in the same place','Check a task and see it marked as done','Delete a task, confirming first, and see only that task disappear'],'rename, check off, uncheck and delete your tasks. Nobody else can see or change your tasks.','add, rename, delete, and check off tasks'],
  ['Fresh checks every day',['Leave a checked list open through your local midnight and see the checks clear','Open your list after a missed midnight and see the checks already cleared','Confirm all your tasks are still there in the same order after a reset'],'start each local day with unchecked tasks, while your tasks and their order stay.','checks that clear each day'],
  ['Password recovery and every device',['Ask for a password recovery email and see it arrive','Follow the email link, set a new password, and log in with it','Open your checklist on a phone, a tablet and a computer'],'get back into your account, and use the finished checklist on every device.',null],
];
const CHECKS = [
  ['Open the calculator in your browser.','You see an empty calculation box.','a simple calculator'],
  ['Enter 1 + 2 and press Calculate.','You see 3.','just simple mathematical functions'],
  ['Enter 2 + 3 × 4 and press Calculate.','You see 14.','just simple mathematical functions'],
  ['Enter 1 ÷ 0 and press Calculate.','You see the exact message you asked for.',null],
  ["Add the calculator to your phone's home screen and open it.",'It opens with no login.','no login or anything'],
];
const H = {
  early:[['14:02',"Saved decision 'Product idea'",'05'],['Sunday',"Started the project 'test'",'03']],
  brief:[['14:10',"Saved decision 'First turn'",'06'],['14:07',"Saved decision 'Start over early'",'06'],['14:04',"Saved decision 'Who plays'",'06'],['14:01',"Saved decision 'End of game'",'06'],['13:55',"Saved decision 'Screen purpose'",'06'],['13:52',"Saved decision 'Product idea'",'06']],
  docs:[['Tuesday','Accepted User journey, draft 1','08'],['Tuesday','Accepted Requirements, draft 1','08'],['Tuesday','Accepted Product brief, draft 1','08']],
  plan:[['31 min ago','Accepted Sprint plan, draft 2','12'],['Tuesday','Accepted Product brief, draft 1','08'],['Tuesday','Accepted Requirements, draft 1','08'],['Tuesday','Accepted User journey, draft 1','08']],
  build:[['Tuesday','Approved the plan','12'],['Tuesday','Accepted Sprint plan, draft 2','12'],['Tuesday','Accepted User journey, draft 1','08'],['Tuesday','Accepted Requirements, draft 1','08'],['Tuesday','Accepted Product brief, draft 1','08'],['Tuesday',"Saved decision 'Daily reset'",'07']],
  done:[['Tuesday 14:10','Accepted Sprint 1, Calculator on every device','14'],['Tuesday','Approved the plan','12'],['Tuesday','Accepted Product brief, draft 1','08'],['Tuesday','Accepted Requirements, draft 1','08']],
  tryit:[['14:10','Saved answer to check 3, Not quite','15'],['14:08','Saved answer to check 2, Yes','15'],['14:06','Saved answer to check 1, Yes','15'],['Tuesday','Accepted Sprint plan, draft 2','12']],
  settings:[['13:35','Saved your settings','16'],['Tuesday','Approved the plan','12'],['Tuesday','Accepted Sprint plan, draft 2','12']],
  copy:[], code:[['Today','Received your upload customer-portal.zip','20']],
  repo:[['Today',"Sent 'Search across notes'",'22'],['Today',"Sent 'Send a summary email every Monday'",'23b'],['Tuesday',"Sent 'Let admins archive old workspaces'",'23'],['Tuesday',"Merged 'Export the weekly report as CSV', 14:10",'22']],
};
const MERGED = "Last merged: 'Export the weekly report as CSV', Tuesday 14:10";

/* ---------- tape and tabs ---------- */
const T = (cur, links, lock, reasons = {}) => ({ cur, links, lock, reasons });
const LOCK_PLAN = 'Opens after the plan is approved';
const LOCK_TRY = 'Opens when sprint 1 is ready to try';
const STEPS = [['interview','Interview'],['documents','Documents'],['roadmap','Roadmap'],['build','Build'],['tryit','Try it']];
const TABKEYS = ['decisions','documents','roadmap','build','tryit'];
const TABNAMES = { overview:'Overview', decisions:'Decisions', documents:'Documents', roadmap:'Roadmap', build:'Build', tryit:'Try it' };

function tapeOf(sc) {
  let t = sc.tape; if (!t) return null;
  if (S.id === '08' && S.imported) t = T(1, ['05','08','11','13',null], LOCK_PLAN, { 0:'Interview: you brought a document instead' });
  if (S.ready) t = T(3, ['07','08','12','13','15'], LOCK_TRY);
  return t;
}
function stepState(t, i) {
  if (t.cur > 4) return 'done';
  if (i === t.cur) return 'current';
  if (t.links[i] == null) return 'locked';
  return i < t.cur ? 'done' : 'upcoming';
}
function stepReason(t, i, label) {
  if (t.reasons[i]) return t.reasons[i];
  const s = stepState(t, i);
  if (s === 'locked') return i === 4 && t.lock === 'Opens when your private copy is ready' ? LOCK_PLAN : t.lock;
  if (s === 'upcoming') return label + ' has not started yet.';
  return label;
}

/* ---------- right views ---------- */
const V = {};

V.projects = () => `${head('Projects', 'Everything you are building, and what needs you first.')}
  <div class="row between"><div class="row field"><input type="search" id="pq" placeholder="Find a project" aria-label="Find a project" style="width:220px" value="${esc(S.projQ)}"><select id="psort" aria-label="Sort projects"><option value="needs">Needs you first</option><option value="name">Name</option><option value="updated">Last updated</option></select></div><span id="pcount" class="meta"></span></div>
  <div id="plist" class="grid2"></div>`;
function renderProjects() {
  const list = $('#plist'); if (!list) return;
  const qs = S.projQ.trim().toLowerCase();
  let rows = PROJECTS.filter((p) => !qs || p[0].toLowerCase().includes(qs));
  const by = S.projSort;
  rows = rows.slice().sort((a, b) => by === 'name' ? a[0].toLowerCase().localeCompare(b[0].toLowerCase()) : by === 'updated' ? a[5] - b[5] : (RANK[a[1]] - RANK[b[1]]));
  list.innerHTML = rows.length ? rows.map((p) => `<button type="button" class="card" data-go="${p[4]}"><div class="row between"><b>${esc(p[0])}</b>${pin(p[1])}</div><div>${p[2]}</div><small>${p[3]}</small></button>`).join('')
    : `<div class="empty" style="grid-column:1/-1"><p>0 of 9 match '${esc(S.projQ)}'.</p><p class="meta">Try another name, or start a new project.</p>${q('Clear search', 'data-act="clearSearch"')}</div>`;
  $('#pcount').textContent = qs ? `${rows.length} of 9 match` : '9 projects';
  $('#psort').value = by;
}

V.newProject = () => `${head('New project', 'Say what you want built, the way you would tell a friend.')}
  ${lanes(0)}
  <div class="cols"><div class="stack">
    <div class="field"><label for="f-name">Product name</label><input type="text" id="f-name" data-draft="name" value="${esc(S.draft.name)}"></div>
    <div class="field"><label for="f-idea">What you want built</label><textarea id="f-idea" data-draft="idea">${esc(S.draft.idea)}</textarea><small>Who it is for, what they do, and what the first version must do. Two to five sentences is plenty.</small></div>
    <div class="panel"><h3>What Pramaan does with this</h3>${ticks(['Pramaan reads it once.','The interview asks the rest.','Nothing is built until you approve a plan.'])}</div>
  </div><div class="panel"><h3>What happens next</h3><ol><li><b>Interview.</b> Answer a few questions about your idea. Your answers are saved as you go.</li><li><b>Documents.</b> Read and accept three documents.</li><li><b>Roadmap.</b> Approve a plan of sprints.</li><li><b>Build.</b> Pramaan builds one sprint at a time. You try each one before the next starts.</li></ol></div></div>`;

const digit = (title, n, unit, line, extra = '') => `<div class="panel"><small>${title}</small><div class="digit">${n}<small> ${unit}</small></div><small>${line}</small>${extra}</div>`;
V.overview = (o) => {
  const d = o.v;
  const lead = d === 'paused' ? `<div class="panel lead state-line strong">${pin('Paused')}<div><b>The monthly budget is used up.</b><br>Raise it in Settings to continue. Everything you accepted is kept.<br>${gob('Open Settings', '16', 'data-keep="1"')}</div></div>`
    : d === 'copying' ? `<div class="panel lead"><div class="row">${pin('Working')}<b>Pramaan is making your private copy.</b></div><ol class="steps">${stepRow('Done','Received customer-portal.zip (38 MB)')}${stepRow('Done','Unpacked it. Dependencies, build output and the .git folder are left out.')}${stepRow('Working','Making your private copy')}</ol></div>`
    : `<div class="panel lead state-line strong">${pin('Needs you')}<div><b>Let's get clear on the product.</b><br>Answer the next interview question. You set the direction; Pramaan handles the technical setup.</div></div>`;
  const dg = d === 'paused' ? ['3','/ 3','All three unlock the plan.'] : d === 'copying' ? ['0','/ 3','Come after the interview.'] : ['0','/ 3','The plan comes after the three documents.'];
  const sp = d === 'decision' ? 'No sprints yet.' : d === 'paused' ? 'No sprints yet. Plan drafting is paused.' : 'No sprints yet.';
  const bud = d === 'paused' ? ['100','%','Used up for this month. Resets 1 October.'] : d === 'copying' ? ['0','%','Resets 1 October.'] : ['2','%','Resets 1 October.'];
  const next = d === 'paused' ? ['Budget. Raise the monthly budget in Settings.','Roadmap. Pramaan drafts your plan from the three accepted documents.','Approval. You read the plan and approve it. Nothing is built until you do.','Build. Pramaan builds one sprint at a time. You try each one.']
    : d === 'copying' ? ['Bring your requirements or answer questions about your code.','Documents. Read and accept three documents.','Roadmap. Approve a plan of sprints.','Build. Pramaan builds one sprint at a time.']
    : ['Interview. Answer a few questions about your idea. Your answers are saved as you go.','Documents. Read and accept three documents: product brief, requirements and user journey.','Roadmap. Approve a plan of sprints. Nothing is built until you say so.','Build. Pramaan builds one sprint at a time. You try each one before the next starts.'];
  const info = d === 'copying' ? `<div class="panel wide"><h3>Where your code goes</h3><div class="row"><div class="box">Your upload<br><small>customer-portal.zip · 38 MB</small></div><span>&rarr;</span><div class="box" style="border-style:dotted">Pramaan's private copy<br><small>Being made now</small></div></div><p>Your original code stays unchanged.</p>${det('Details','Private copy: pramaan-build/customer-portal-3f9a1c2e · from your upload customer-portal.zip (38 MB), received today')}</div>`
    : `<div class="panel wide"><h3>${d === 'paused' ? 'Your private workspace is ready.' : 'Your private workspace comes next.'}</h3><p>${d === 'paused' ? 'Pramaan builds in it, one sprint at a time.' : 'Pramaan sets it up once the interview is done.'}</p>${det('Details', d === 'paused' ? 'Private repository: pramaan-build/todo-list-4c81e0a7. You do not need to open it.' : 'Private repository: created after the interview. There is nothing to open yet.')}</div>`;
  return `<div class="bento">${lead}${digit('Documents accepted', dg[0], dg[1], dg[2])}${digit('Sprints', 'none', 'yet', sp)}${digit('Monthly budget used', bud[0], bud[1], bud[2], det('Details', 'Budget: 20,000,000 tokens a month. Resets 1 October.'))}<div class="panel wide"><h3>What happens next</h3>${ticks(next)}</div>${info}</div>`;
};

const decRow = (t, v, edit) => `<div class="panel" data-dec="${esc(t)}"><div class="row between"><b>${t}</b>${edit ? q('Edit', 'data-act="editDec"') : ''}</div><div class="dv">${v}</div></div>`;
const brief = (n, done) => `<div class="panel"><h3>Where your answers go</h3>${done ? `<div class="row">${pin('Done')}<span>Your 6 decisions feed all six sections.</span></div>` : ''}<ul class="ticks">${GLOSS.map((g, i) => `<li${!done && i < n ? ' style="font-weight:600"' : ''}>${g[0]} <small>${g[1]}</small></li>`).join('')}</ul></div>`;
V.decisions = (o) => {
  const foot = '<p class="meta">Saved automatically. Edit any decision any time.</p>';
  if (o.v === 'empty') return `${head('Your decisions', '1 of about 6 saved')}${decRow('Product idea', 'a tic tac toe game', true)}${box('Your next answers appear here.')}${brief(1)}${foot}`;
  if (o.v === 'running') return `${head('Your decisions', '2 of about 6 saved')}${decRow('Product idea', 'a tic tac toe game', true)}${decRow('Screen purpose', 'Two people take turns on one screen.', true)}${box('Your next answers appear here.')}${brief(2)}${foot}`;
  if (o.v === 'finished') return `${head('Your decisions', '6 of 6 saved')}${['Product idea|a tic tac toe game','Screen purpose|Two people take turns on one screen.','End of game|The screen shows the result and stops further moves.','Who plays|Two people on the same screen.','Start over early|Players can start a new game at any time.','First turn|X takes the first turn in every new game.'].map((x) => decRow(x.split('|')[0], x.split('|')[1], true)).join('')}${brief(6, true)}${det('Details', 'Workspace sized automatically. Private repository: pramaan-build/ui-test-52da6713')}${foot}`;
  if (o.v === 'locked') return `<div class="state-line strong">${pin('Locked')}<div><b>The interview is read only while sprint 1 is being built.</b><br>Your saved decisions are below.</div></div>
    <div class="grid3"><div class="card"><b>Read your decisions</b><br><small>Nothing you decided is lost.</small><br>${gob('Read your decisions', '07', 'data-jump="decs"')}</div><div class="card"><b>Request a revision</b><br><small>Pramaan drafts the change after the sprint.</small><br>${q('Request a revision', 'data-act="ask" data-arg="revision"')}</div><div class="card"><b>Open Build</b><br><small>See how sprint 1 is going.</small><br>${gob('Open Build', '13')}</div></div>
    <div id="decs" class="stack"><h2>Your decisions</h2>${[['Product idea','a private daily checklist'],['Sign-up and log-in','users can sign up or log in and see only their own tasks'],['Tasks','add, rename, delete, and check off tasks'],['Daily reset','checks that clear each day']].map((x) => decRow(x[0], x[1], false)).join('')}<p class="meta">4 of 4 · Locked · Read only while sprint 1 is built.</p></div>
    <div class="panel"><h3>This sprint</h3><p>When this sprint is done you can:</p>${ticks(['Sign up with an email and password','Log in and land on your own empty checklist','Add your own tasks, each one going to the bottom of the list'])}<p class="meta">Then: Try sprint 1 appears on Build and in the top bar. Sprint 2 waits until you accept sprint 1.</p></div>
    <div class="panel"><h3>Happening in your sprint</h3><ol class="steps">${stepRow('Working','Testing your own checklist','1 minute ago')}${stepRow('Done','Your own checklist is built','2 minutes ago')}${stepRow('Done','Sign-up and log-in is ready','4 minutes ago')}</ol></div>`;
  return '';
};

V.requirements = () => `${head('Your requirements', 'Bring a document, or answer questions about your code.')}
  <div class="cols"><div class="stack">
    <div class="field"><label>Have a requirements document? (.md or .txt, under 1 MB)</label><div class="filebox"><button type="button" class="quiet" data-act="pickDoc">Choose a file</button><span id="docfile">${esc(S.docFile) || 'No file chosen yet'}</span></div></div>
    <div class="field"><label for="f-doc">Or paste it here</label><textarea id="f-doc" data-doc="1" style="height:150px" placeholder="Paste the document, or dictate it.">${esc(S.doc)}</textarea><div class="row"><button type="button" class="quiet" data-act="dictate" aria-pressed="false">Dictate the document</button><small>Paste the document, or dictate it. Skip it if you have none. The interview asks instead.</small></div></div>
    <div class="row"><button type="button" class="quiet" data-act="useDoc" data-needs="doc" aria-disabled="true">Use this document</button><small data-needs-reason="doc">Add a document first.</small></div>
  </div><div class="panel flow"><h3>Where your code goes</h3><div class="row">${pin('Done')}<span>Your private copy is ready.</span></div><div class="box"><b>Your upload</b><br><small>customer-portal.zip · 38 MB</small></div><div class="arrow">v</div><div class="box"><b>Pramaan's private copy</b><br><small>Ready</small></div><p>Your original code stays unchanged.</p>${det('Details','Private copy: pramaan-build/customer-portal-3f9a1c2e')}</div></div>`;

V.documents = () => {
  const imp = S.imported;
  const row = (n, why, p, ps, ver, upd, to) => `<tr><td>${gob(n, to, 'style="font-weight:600;border:0;padding:0;text-decoration:underline;background:none"')}<small>${why}</small></td><td>${pin(p)}<small>${ps}</small></td><td>${ver}</td><td>${upd}</td></tr>`;
  const rd = imp ? 'Waiting' : 'Done';
  const rows = imp
    ? [row('Product brief','What the product is for and how we will know it works.','Waiting','Starts after you accept the requirements.','Not started','Not yet','10'),
       row('Requirements','What the first version must do and must not do.','Needs you','Draft 1, imported by you from customer-portal-requirements.md','Draft 1','Just now','09'),
       row('User journey','What a person does in the product, step by step.','Waiting','Starts after the requirements.','Not started','Not yet','10'),
       row('Sprint plan','Which sprints build it, in what order.','Waiting','Starts after the three documents.','Not started','Not yet','12')]
    : [row('Product brief','What the product is for and how we will know it works.','Done','Accepted Tuesday','Draft 1','21 hours ago','10'),
       row('Requirements','What the first version must do and must not do.','Done','Accepted Tuesday','Draft 1','21 hours ago','10'),
       row('User journey','What a person does in the product, step by step.','Done','Accepted Tuesday','Draft 1','21 hours ago','10'),
       row('Sprint plan','Which sprints build it, in what order.','Done','Accepted Tuesday','Draft 2 <small>newest</small>','Tuesday','12')];
  const adv = ['System design|How the parts fit together.','Data model|What is stored and how it relates.','API specification|How the parts talk to each other.','Test plan|What is checked before a sprint is ready.'].map((x) => `<tr><td><b>${x.split('|')[0]}</b><small>${x.split('|')[1]}</small></td><td>${pin(rd)}<small>${imp ? 'Starts later.' : 'Written and checked'}</small></td><td>${imp ? 'Not started' : 'Draft 1'}</td><td>${imp ? 'Not yet' : '21 hours ago'}</td></tr>`).join('');
  const th = '<tr><th>Document</th><th>Status</th><th>Version</th><th>Updated</th></tr>';
  return `${head('Documents', imp ? 'Requirements are waiting for you. The other two come after.' : '3 of 3 accepted, and the sprint plan too. Sprint 1 is being built.')}<table>${th}${rows.join('')}</table>${det('Review advanced technical documents (4)', `<table>${th}${adv}</table>`, true)}`;
};

V.reader = (o) => {
  const locked = o.v === 'locked';
  const bar = locked
    ? `<div class="stack"><div class="state-line">${pin('Locked')}<span>Read only while sprint 1 is being built.</span></div><div class="state-line">${pin('Done')}<span>Accepted by you Tuesday 14:10.</span></div><div class="row">${gob('Open Build', '13')}${q('Request a revision', 'data-act="ask" data-arg="revision"')}<small>Comments reopen after the sprint.</small></div></div>`
    : `<div class="state-line strong">${pin('Needs you')}<span>Draft 1. Nobody has accepted it yet.</span>${q('Ask for changes (1)', 'data-act="ask" data-arg="changes"')}</div>`;
  const rail = `<aside class="rail"><h3>In this document</h3><ul>${GLOSS.map((g, i) => `<li><button type="button" class="link" data-jump="sec${i}">${g[0]}</button></li>`).join('')}<li><button type="button" class="link" data-jump="adv">Advanced sections</button></li></ul><h3 style="margin-top:10px">${locked ? 'No passage comments.' : 'Passage comments (1)'}</h3>${locked ? '' : `<ul><li><button type="button" class="link" data-act="goComment">1 · Constraints: 'I don't think this is a constraint'</button></li></ul>`}<p style="margin-top:8px"><button type="button" class="link" data-jump="det">Details</button></p></aside>`;
  const secs = GLOSS.map((g, i) => `<section class="sect" id="sec${i}"><h2>${g[0]}</h2><small>${['The one thing this product should do.','What you told us that led to this brief.','How we will know the product works.','Things that must not get worse while we build.','The check you can run yourself to accept the result.','What the product must stay within, and what it will not do.'][i]}</small>${i === 5
    ? `<p>Constraint: ${locked ? '' : '<mark class="cm" data-act="goComment" title="Passage comment 1" style="background:var(--sunk);cursor:pointer;border:1px solid var(--ink);padding:0 3px">1</mark> '}This is a browser-based web app that works on phones, tablets, and computers. It is not a native or app-store app.</p><p>Constraint: Two people play on the same screen; X takes the first turn in every new game.</p>`
    : box(`Product brief, reading view: ${g[0].toLowerCase()}`)}</section>`).join('');
  return `${bar}<div class="reader">${rail}<div class="stack"><div class="panel"><div class="row between"><h1 style="margin:0">Product brief</h1><span class="row"><span class="chip on">Draft 1 newest</span></span></div><small>Pramaan wrote draft 1 on Tuesday at 20:59.</small><div id="det">${det('Details', 'Repository: pramaan-build/ui-test-52da6713 · File: product/brief.md · Version: draft 1 · The file\'s own labels: Product brief, core document 1 of 3')}</div></div>${secs}<section id="adv">${det('Advanced sections (how Pramaan will work)', 'Execution contract, Frozen autonomous decision policy, Authority envelope, Readiness gate.')}</section></div></div>`;
};

const route = (v) => {
  const sprint = (s, i) => {
    const p = v === 'approved' && i === 0 ? 'Working' : v === 'done' ? 'Done' : 'Waiting';
    const note = v === 'done' ? 'Accepted by you Tuesday 14:10.' : p === 'Working' ? 'Pramaan is building it. Nothing needed from you.' : i === 0 ? 'Starts after you approve the plan.' : `Starts after sprint ${i} is accepted.`;
    return `<li id="sprint${i + 1}"><div class="panel"><div class="row between"><b>Sprint ${i + 1} · ${s[0]}</b>${pin(p)}</div><small>${note}</small><div><small>You will be able to:</small>${ticks(s[1])}</div>${s[3] && S.words ? `<small>You said: '${s[3]}' <button type="button" class="link" data-go="07">${v === 'awaiting' ? 'Edit that decision' : 'See that decision'}</button></small>` : ''}<div class="try"><b>You can try:</b> ${s[2]}</div><div class="then">${i < 3 ? `Then: try sprint ${i + 1}, share what you found, accept it. Sprint ${i + 2} starts when you accept.` : 'Then: try sprint 4, share what you found, accept it.'}</div></div></li>`;
  };
  return `<ol class="route">${(v === 'done' ? SPRINTS.slice(0, 1) : SPRINTS).map(sprint).join('')}<li><div class="panel dashed state-line dashed">After sprint 4, all planned sprints are accepted. You can open your product any time and plan more.</div></li></ol>`;
};
const glance = (v) => `<div class="panel"><h3>Plan at a glance</h3><ol class="steps">${SPRINTS.map((s, i) => `<li><button type="button" class="link" data-jump="sprint${i + 1}">${i + 1} ${s[0]}</button>${pin(v === 'approved' && i === 0 ? 'Working' : 'Waiting')}</li>`).join('')}</ol><p class="meta">${v === 'approved' ? 'Sprint 1 is being built. Sprint 2 starts when you accept sprint 1.' : 'Nothing is built until you approve.'}</p><p class="meta">Pramaan checks with you before each sprint starts. Change this in ${gob('Settings', '16', 'data-keep="1"')}.</p></div>`;
V.roadmap = (o) => {
  if (o.v === 'drafting') return `<div class="cols"><div class="stack">${head('Roadmap', 'Pramaan is turning your three documents into sprints.')}<div class="state-line">${pin('Working')}<span>Pramaan is drafting your plan. Opens when the draft is ready.</span></div>${box('Skeleton sprint card', 'skel')}${box('Skeleton sprint card', 'skel')}${box('Skeleton sprint card', 'skel')}<p class="meta"><b>What you do next:</b> read the plan and approve it. Nothing is built until you do.</p></div>
    <div class="panel"><h3>What Pramaan is reading</h3><ol class="steps">${stepRow('Done','Product brief')}${stepRow('Done','Requirements')}${stepRow('Done','User journey')}</ol><p class="meta">Accepted Tuesday.</p><div class="row">${pin('Working')}<small>Pramaan is drafting your plan from these.</small></div></div></div>`;
  const approved = o.v === 'approved';
  const words = `<div class="switch"><button type="button" role="switch" aria-checked="${S.words}" data-act="words" aria-label="Show my words"></button><span>Show my words</span></div>`;
  const top = approved
    ? `<div class="state-line">${pin('Done')}<span>Plan approved Tuesday 14:10. Sprint 1 is being built.</span>${q('Ask for a change to the plan', 'data-act="ask" data-arg="plan2"')}</div>`
    : `<div class="state-line strong">${pin('Needs you')}<div><b>Approve this plan?</b><br>4 sprints. Sprint 1 builds your private checklist. Nothing is built until you approve, and you can ask for changes first.<br>${q('Ask for changes to the plan', 'data-act="ask" data-arg="plan"')}</div></div>`;
  return `${head('Roadmap', 'Four sprints, one at a time. You try each one before the next starts.')}${words}${top}<div class="cols">${route(o.v)}${glance(o.v)}</div>`;
};

const FEATS = [['Sign-up and log-in','You can create an account with your email and password, log back in later, and see a clear error if the password is wrong.'],['Your own checklist','After you log in you land on your own empty checklist.'],['Add tasks to your list','Starts when Your own checklist is ready.']];
const board = (rows, extra) => `<table><tr><th>Feature</th><th>Building</th><th>Testing</th><th>Reviewing</th><th>Ready</th></tr>${rows.map((r, i) => `<tr><td><b>${r[0]}</b><small>${r[1]}</small>${extra && extra[i] ? det('Details', extra[i]) : ''}</td>${r[2].map((c) => `<td>${cell(c)}</td>`).join('')}</tr>`).join('')}</table>`;
V.build = (o) => {
  const feed = `<div class="panel"><h3>Happening in your sprint</h3><ol class="steps">${S.ready ? stepRow('Done','Sprint 1 is ready to try','just now') : ''}${stepRow(o.v === 'blocked' ? 'Blocked' : 'Working','Testing your own checklist','1 minute ago')}${stepRow('Done','Your own checklist is built','2 minutes ago')}${stepRow('Done','Sign-up and log-in is ready','4 minutes ago')}</ol></div>`;
  if (o.v === 'accepted') return `<div class="state-line strong">${pin('Done')}<div><b>All planned sprints accepted.</b><br>Nothing further is scheduled.</div></div>
    <div class="cols"><div class="stack">${route('done')}<h2>What was built in sprint 1</h2>${board([['Calculator screen','You type a calculation with two or more numbers, press Calculate and see it with its correct result.',['Done','Done','Done','Done']],['Order of operations','Multiplication and division are done first, then addition and subtraction.',['Done','Done','Done','Done']],['Home-screen install',"You open the calculator from your phone's home screen, with no login.",['Done','Done','Done','Done']]])}</div>
    <div class="panel"><h3>What was built</h3><p>1 sprint · 3 features · Accepted Tuesday 14:10</p><div class="row">${pin('Waiting')}<small>Going live is not available yet. Your accepted sprints are kept.</small></div>${q('Take a copy (.zip)', 'data-act="stubCopy"')}</div></div>`;
  const ready = S.ready, blocked = o.v === 'blocked';
  const rows = ready ? [[FEATS[0][0], FEATS[0][1], ['Done','Done','Done','Done']],[FEATS[1][0], 'Your own checklist is built, tested and reviewed.', ['Done','Done','Done','Done']],[FEATS[2][0], 'You can add tasks and see each one at the bottom of the list.', ['Done','Done','Done','Done']]]
    : blocked ? [[FEATS[0][0], FEATS[0][1], ['Done','Done','Done','Done']],[FEATS[1][0], 'A check did not pass. Pramaan is fixing it.', ['Done','Blocked','Waiting','Waiting']],[FEATS[2][0], FEATS[2][1], ['Waiting','Waiting','Waiting','Waiting']]]
    : [[FEATS[0][0], FEATS[0][1], ['Done','Done','Done','Done']],[FEATS[1][0], 'Your own checklist is built, tested and reviewed.', ['Done','Done','Working','Waiting']],[FEATS[2][0], FEATS[2][1], ['Waiting','Waiting','Waiting','Waiting']]];
  const extra = [null, blocked ? 'Check: page tests for your own checklist. 1 of 4 did not pass: the empty list message did not show. · 1m ago' : 'Reviewing: the built page is being read for problems.', null];
  const top = blocked ? `<div class="state-line strong">${pin('Blocked')}<div><b>A check did not pass on your own checklist.</b><br>Pramaan is fixing it and runs the check again. Nothing needed from you.<br>${gob('See what happened', '17', 'data-keep="1"')}</div></div>`
    : ready ? `<div class="stack"><div class="state-line">${pin('Done')}<span>Sprint 1 is ready to try.</span></div><div class="state-line strong">${pin('Needs you')}<span>Ready. Press Try sprint 1 below.</span></div></div>`
    : `<div class="state-line">${pin('Working')}<span>Pramaan is building it. Nothing needed from you.</span></div>`;
  return `${head('Build', 'Every feature has a visible state. Pramaan handles the technical details.')}<div class="row between"><h2 style="margin:0">Sprint 1 · Your private checklist</h2><b>${ready ? '3' : '1'} of 3 features ready</b></div>${top}${board(rows, extra)}${blocked ? '' : feed}`;
};

V.try = () => {
  const vd = S.verdicts, n = vd.filter(Boolean).length;
  const dw = { Phone:'phone', Tablet:'tablet', Computer:'' }[S.device];
  const list = CHECKS.map((c, i) => `<div class="panel" data-check="${i}"><b>${i + 1}. ${c[0]}</b><div class="meta">${c[1]}</div>${c[2] && S.words ? `<small>You said: '${c[2]}' ${gob('See that decision', '07')}</small>` : ''}<div class="verdicts" role="group" aria-label="Your answer to check ${i + 1}">${['Yes','Not quite','Confusing'].map((x) => `<button type="button" aria-pressed="${vd[i] === x}" data-act="verdict" data-arg="${i}|${x}">${x}</button>`).join('')}</div>${vd[i] && vd[i] !== 'Yes' ? `<div class="field"><label>What happened?</label><input type="text" class="in" value="${esc(S.notes[i] || '')}" data-note="${i}"></div>` : ''}</div>`).join('');
  return `<div class="row between"><h1 style="margin:0">Try it</h1><div class="switch"><button type="button" role="switch" aria-checked="${S.words}" data-act="words" aria-label="Show my words"></button><span>Show my words</span></div></div>
  <div class="panel"><div class="row between"><b>Private preview · Sprint 1</b><span class="row" role="group" aria-label="Preview width">${['Phone','Tablet','Computer'].map((d) => `<button type="button" class="chip ${S.device === d ? 'on' : ''}" data-act="device" data-arg="${d}">${d}</button>`).join('')}${q('Open in a new tab', 'data-act="stubTab"')}</span></div>
  <div class="device-wrap"><div class="device" data-w="${dw}"><iframe title="Preview of sprint 1" style="width:100%;height:150px;border:1px solid var(--line-soft);background:#fff" srcdoc="<body style='font:14px system-ui;padding:10px'>Calculator preview<br><br>[ 1 + 2 ] [ Calculate ]</body>"></iframe></div></div><small>${S.device === 'Phone' ? '390 px' : S.device === 'Tablet' ? '820 px' : 'Fills the stage'}</small></div>
  <div class="row between"><h2 style="margin:0">Try these</h2><b>${n} of 5 answered</b></div>${list}`;
};

V.settings = () => `<div class="cols"><div class="stack">${head('Settings', 'For this project.')}
  <div class="panel"><h2>Project name</h2><div class="field"><label for="s-name">Project name</label><input type="text" id="s-name" value="todo" data-saves="name"></div><div class="row"><button type="button" class="quiet" data-act="saveSec" data-arg="name" aria-disabled="true">Save name</button><small data-reason="name">Nothing changed yet.</small></div></div>
  <div class="panel"><h2>Monthly budget</h2><div class="field"><label for="s-budget">Monthly limit</label><div class="row"><input type="text" id="s-budget" value="20" data-saves="budget" style="width:90px" class="in"><span>million units</span></div></div><small>18% used this month. Resets 1 October.</small>${det('Details', 'Units are tokens, the pieces of text the AI reads and writes. 5,415,812 of 20,000,000 used this month.')}<div class="row"><button type="button" class="quiet" data-act="saveSec" data-arg="budget" aria-disabled="true">Save budget</button><small data-reason="budget">Nothing changed yet.</small></div></div>
  <div class="panel"><h2>Before each sprint</h2><div class="switch"><button type="button" role="switch" aria-checked="${S.auto}" data-act="auto" aria-label="Check with me before each sprint starts"></button><div><b>Check with me before each sprint starts</b><br><small id="autotxt">${S.auto ? 'Pramaan waits for you to try and accept a sprint before the next one starts.' : 'Pramaan starts the next sprint as soon as the previous one is built and checked. You can still ask for changes at any time.'}</small></div></div></div>
  <div class="panel"><h2>Dependency monitoring</h2><div class="switch"><button type="button" role="switch" aria-checked="false" data-act="monitor" aria-label="Turn on monitoring"></button><div><b>Turn on monitoring</b><br><small>Monitoring is off for this project. Turn it on to see your dependencies and updates.</small></div></div></div>
  <div class="panel"><h2>Your code</h2><p>The code is yours. Take a copy whenever you want.</p>${q('Take a copy (.zip)', 'data-act="stubCopy"')}<div class="row">${pin('Waiting')}<small>Export to GitHub is not available yet. Your code stays yours; take a copy any time.</small></div></div>
  <div class="panel danger"><h2>Delete this project</h2><p>Deleting removes the private copy and every document. This cannot be undone.</p>${q('Delete this project', 'data-act="delAsk"')}<div id="del" class="panel" hidden role="dialog" aria-label="Delete this project?"><b>Delete this project?</b><p>Deleting removes the private copy and every document. This cannot be undone.</p><div class="row">${q('Keep the project', 'data-act="delNo"')}${q('Delete this project', 'data-act="delYes"')}</div></div></div>
  </div><div class="panel"><h3>This project</h3><div class="row">${pin('Working')}<span>Sprint 1 of 4 is being built.</span></div><small>Monthly budget 18% used</small><div class="measure" aria-label="18% used"><span class="d"></span><span></span><span></span><span></span><span></span></div><small>Settings last changed 35 minutes ago</small><p>Started from an idea. No original code.</p></div></div>`;

const LOGS = [['21:00 UTC'],['21:19:00','Job finished: plan sprint','todo','INFO','event builder.job.finished · job ddde3283 · kind plan_sprint · 95 s'],['21:19:01','Code received from GitHub','','INFO','event webhook.write.received · delivery 63948f0a · push'],['21:19:25','Preview opened','test first','INFO','event builder.preview.access_issued · sprint 1'],['21:19:25','Preview access granted','test first','INFO','event builder.preview.access_granted · sprint 1'],['21:19:53','Preview opened','test first','INFO','event builder.preview.access_issued · sprint 1'],['21:26:03','Job finished: build feature','todo','INFO','event builder.job.finished · job 4b1c9a02 · kind build_feature · 212 s'],['22:00 UTC'],['22:02:41','Job finished: check feature','todo','WARN','event builder.job.finished · job 7e50d3f8 · kind verify_feature · 61 s · 1 check failed'],['22:08:10','Job finished: review feature','todo','INFO','event builder.job.finished · job a91c5b77 · kind review_feature · 48 s'],['22:11:30','Request received','insight-weaver-537','INFO','event requests.created · request r-3 · requests']];
V.logs = () => `<div class="row between"><div><h1 style="margin:0">Live logs</h1><span id="logcount" class="meta">${S.paused ? `Paused · ${S.logN} new lines` : 'Live · 69 lines · times are UTC'}</span></div><span class="row">${S.paused ? q('Resume', 'data-act="logpause"') : q('Pause', 'data-act="logpause"')}</span></div>
  <div class="row field"><label>Level <select id="lv"><option>All levels</option><option>Info</option><option>Warn</option><option>Error</option></select></label><label>Project <select id="lp"><option>All projects</option><option>todo</option><option>test first</option></select></label><label class="row" style="font-weight:400"><input type="checkbox" id="lr"> Show requests</label></div>
  <div id="loglist">${LOGS.map((r) => r.length === 1 ? `<div class="sep" style="position:sticky;top:0;background:var(--bg);font-weight:600;padding:3px 0;border-bottom:1px solid var(--line)">${r[0]}</div>` : `<div class="logrow" data-level="${r[3]}" data-project="${r[2]}" data-req="${/Request/.test(r[1]) ? 1 : 0}"><span class="meta">${r[0]}</span><span>${r[1]}</span><span class="meta">${r[2]}</span>${det('Details', `${r[4]}<br>level ${r[3]} · ${q('Copy job id', 'data-act="stubCopy"')}`)}</div>`).join('')}</div>`;

V.handoff = (o) => {
  const gh = o.v === 'github' || o.v === 'ghperm';
  const choice = (on, t, sub, to) => `<button type="button" class="choice" role="radio" aria-checked="${on}" data-go="${to}"><b>${t}</b><small>${sub}</small></button>`;
  const f = S.file, big = f === 'big', rar = f === 'rar';
  const fname = rar ? 'customer-portal.rar' : big ? 'customer-portal-full.zip · 312 MB' : 'customer-portal.zip · 38 MB';
  const file = `<div class="field ${big || rar ? 'err' : ''}"><label>Your code (.zip, up to 200 MB)</label><div class="filebox ${big || rar ? 'err' : ''}">${q(big || rar ? 'Choose another file' : 'Choose a file', 'data-act="pickFile"')}<span>${fname}</span></div>${big ? `<div class="row">${pin('Blocked')}<small>This file is larger than 200 MB. Choose a smaller .zip, or leave out big folders such as media.</small></div>` : rar ? `<div class="row">${pin('Blocked')}<small>This is not a .zip file. Zip the folder and choose the .zip.</small></div>` : '<small>Zip your project folder, then choose the .zip.</small>'}</div>`;
  const repos = [['studio-demo/customer-portal',0],['test-org/todo',1],['test-org/provider-update-demo-npm-stack',0],['test-org/omnibound-vlmk-craft',0]].map((r, i) => r[1] ? `<button type="button" class="choice" role="radio" aria-checked="false" aria-disabled="true">${r[0]}<small>already a Pramaan project. Pick another one.</small></button>` : `<button type="button" class="choice" role="radio" aria-checked="${S.ghRepo === i}" data-act="ghRepo" data-arg="${i}">${r[0]}</button>`).join('');
  const ghBlock = o.v === 'ghperm'
    ? `<div class="state-line strong">${pin('Needs you')}<div><b>GitHub needs your permission first.</b><br>Pramaan asks GitHub to read your code. GitHub shows you exactly what it asks for.</div></div><div class="field"><label>Pick the code to bring</label><div class="state-line dashed">${pin('Waiting')}<span>Your GitHub projects appear here after you give permission.</span></div></div>`
    : `<div class="state-line">${pin('Done')}<span>GitHub · Connected as Aditya Choudhary</span>${q('Use another account', 'data-go="18e"')}</div><div class="field"><label>Pick the code to bring</label><div class="stack" role="radiogroup">${repos}</div><small>Pramaan reads it once. Your repository is never changed.</small></div>`;
  const repoName = ['studio-demo/customer-portal','','test-org/provider-update-demo-npm-stack','test-org/omnibound-vlmk-craft'][S.ghRepo] || 'studio-demo/customer-portal';
  const b1 = o.v === 'ghperm' ? ['GitHub', 'Not connected yet', 'Waiting for permission'] : gh ? ['GitHub', repoName, 'Read only · unchanged'] : ['Your upload', fname, big ? 'Too big' : rar ? 'Not a .zip' : 'Read once · never changed'];
  return `${head('Hand off your code', "Pramaan builds in its own private copy from here.")}${lanes(1)}
  <div class="cols"><div class="stack">
    <fieldset style="border:0;padding:0;margin:0"><legend><b>Where is your code?</b></legend><div class="grid2" role="radiogroup">${choice(!gh, 'Upload a .zip', 'No GitHub account needed.', '18')}${choice(gh, 'Import from GitHub', 'Pramaan reads it once. Your repository is never changed.', S.gh ? '18b' : '18e')}</div></fieldset>
    ${gh ? ghBlock : file}
    <div class="field"><label for="h-name">Project name</label><input type="text" id="h-name" value="Customer portal"></div>
    <div class="field"><label for="h-desc">What it does (optional)</label><textarea id="h-desc">Our customers log in to see their orders and invoices.</textarea></div>
    <p class="meta">Pramaan never writes back to where the code came from.</p>
    ${det('Details', "Dependencies, build output and the .git folder are left out of the copy; the ZIP can unpack to at most 1 GB and 50,000 files.<br>Bringing back a copy you exported? It starts a new project. The original project's documents and history stay with it.")}
  </div><div class="panel flow"><h3>Where your code goes</h3><div class="box"><b>${b1[0]}</b><br>${b1[1]}<br><small>${b1[2]}</small></div><div class="arrow">v</div><div class="box"><b>Pramaan's private copy</b><br>A private copy named after your project<br><small>All work happens here</small></div><p class="meta">The code stays yours. Take a copy any time.</p>${det('Details', 'The private copy is a private repository Pramaan holds, named after your project. Take a copy downloads a .zip. Export to GitHub is not available yet.')}</div></div>`;
};

const REPOS = ['test-org/insight-weaver-537','test-org/todo','studio-demo/customer-portal','test-org/provider-update-demo-npm-stack','test-org/omnibound-vlmk-craft','test-org/pramaan-web'];
V.repoConnect = (o) => {
  const list = o.v === 'empty' ? `<div class="empty"><b>No repositories found.</b><p>Your GitHub account has no repositories Pramaan can see. Install the Pramaan app on the organisation that owns your code.</p></div>`
    : `<div class="stack" id="rlist" role="radiogroup">${REPOS.map((r, i) => i === 1 ? `<button type="button" class="choice" role="radio" aria-checked="false" aria-disabled="true" data-r="${r}">${r}<small>already a Pramaan project</small></button>` : `<button type="button" class="choice" role="radio" aria-checked="${S.repo === i}" data-act="repoPick" data-arg="${i}" data-r="${r}">${r}</button>`).join('')}</div><small>Showing 6 of 33</small>`;
  const blocked = o.v === 'permission' || o.v === 'empty';
  const chk = o.v === 'permission' ? `<div class="check">${pin('Blocked')}<div><b>Pramaan cannot open pull requests in test-org/insight-weaver-537 yet.</b><br>The Pramaan GitHub App is not installed for this repository.</div></div>`
    : o.v === 'empty' ? '' : `<div class="check">${pin('Done')}<div><b>Pramaan can open pull requests in test-org/insight-weaver-537.</b><br>It never pushes to your default branch (main).</div></div>`;
  return `${head('Work in your repository', 'For engineering teams. Pramaan proposes changes as pull requests; you review, merge and deploy.')}${lanes(2)}
  <div class="cols"><div class="stack"><h2>Choose your repository</h2><div class="field"><label for="rq">Find a repository</label><div class="row"><input type="search" id="rq" style="flex:1"><button type="button" class="quiet" data-act="clearRepo">Clear</button></div></div>${list}
    <p class="meta">Next, Pramaan checks that its GitHub App can write to the repository you choose. It opens pull requests there and never pushes to your default branch.</p>${chk}</div>
    <div class="stack"><div class="panel"><h3>How this works</h3>${ticks(['Makes the change on a new branch in your repository','Tests the change it made','Opens a pull request and has it reviewed','Fixes what the review finds, and has it reviewed again'])}</div><div class="panel"><h3>What stays with you</h3>${ticks(['Merging the pull request','Deploying, and testing your running app'])}<p><b>Pramaan never pushes to your default branch.</b></p></div></div></div>`;
};

const REQS = [['Let admins archive old workspaces','Needs you','Reviewed twice and ready. Merge it when you are ready.','Started Tuesday · feature/2-archive-workspaces · Pull request #42','23','dddw'],['Send a summary email every Monday','Blocked','A check did not pass. Pramaan is fixing it; nothing needed from you.','Started today · feature/3-weekly-summary','23b','ddbx'],['Search across notes','Waiting',"Starts after 'Send a summary email every Monday'.",'Queued today','23','xxxx'],['Export the weekly report as CSV','Done','Merged by you Tuesday 14:10.','feature/1-export-csv · Pull request #38 · merged Tuesday','23','dddd']];
const measure = (m) => `<span class="measure" aria-label="Build, Test, Review, Merge">${m.split('').map((c) => `<span class="${c === 'd' ? 'd' : c === 'w' ? 'w' : c === 'b' ? 'b' : ''}"></span>`).join('')}</span>`;
V.requests = (o) => {
  const rows = [...S.newReqs.map((t) => ['@' + t, 'Waiting', 'Pramaan starts on a new branch.', 'Sent just now', '23', 'xxxx']), ...(o.v === 'empty' ? [] : REQS)];
  const n = rows.length, needs = rows.filter((r) => r[1] === 'Needs you').length;
  const sub = n ? `${n} requests. ${needs} needs you.` : 'No requests yet.';
  const list = n ? `<div class="stack">${rows.map((r) => `<button type="button" class="card" data-go="${r[4]}"><div class="row between"><span class="row"><b>${esc(r[0].replace(/^@/, ''))}</b>${pin(r[1])}</span>${measure(r[5])}</div><div>${r[2]}</div><small>${r[3]}</small></button>`).join('')}</div>`
    : `<div class="empty"><b>No requests yet.</b><p>Describe the first change you want. Pramaan makes it on a new branch and opens a pull request.</p></div><div class="panel"><h3>What happens after you send</h3>${ticks(['Makes the change on a new branch in your repository','Tests the change it made','Opens a pull request and has it reviewed','Fixes what the review finds, and has it reviewed again'])}<p class="meta">Merging, deploying and testing your running app stay with you. Pramaan never pushes to your default branch.</p></div>`;
  return `${head('Requests', sub)}<div class="panel"><b>Request a change</b><p class="meta">Describe the change in the chat on the left, the way you would in a ticket. One change per request.</p></div>${list}`;
};

V.request = (o) => {
  const blocked = o.v === 'blocked';
  const title = blocked ? 'Send a summary email every Monday' : 'Let admins archive old workspaces';
  const steps = `<ol class="steps">${stepRow('Done','Made the change on a new branch','feature/2-archive-workspaces','id="st-build"')}${stepRow('Done','Tested the change it made','Checks passed on the branch','id="st-test"')}${stepRow('Done','Opened a pull request and had it reviewed','Pull request #42, opened Tuesday','id="st-review"')}${blocked ? stepRow('Working','Fixing what the review found','Failing check: the test run on the branch','id="st-merge"') : stepRow('Done','Fixed what the review found, and had it reviewed again','Round 1 asked for an empty-state test. Round 2 passed.','id="st-merge"')}</ol>`;
  return `<div class="row">${gob('Back to Requests', '22')}</div>${head(title, blocked ? 'Started today. One check did not pass.' : 'Started Tuesday. Reviewed twice.')}
  <div class="cols"><div class="stack">
    ${blocked ? `<div class="state-line strong">${pin('Blocked')}<div><b>A check did not pass in round 2.</b><br>Pramaan is fixing it on the branch; nothing needed from you.<br>${gob('See what happened', '17', 'data-keep="1"')}</div></div>` : `<div class="state-line strong">${pin('Needs you')}<div><b>Ready to merge.</b><br>Reviewed twice. Merge it when you are ready. Pramaan never pushes to your default branch.</div></div>`}
    <h2>What Pramaan did</h2>${steps}<h2>What you asked for</h2><div class="panel sunk">Admins should be able to archive workspaces that have had no activity for 90 days. Archived workspaces stay readable but cannot be edited. Add an Archive button on the workspace settings page and an Archived filter on the list.</div>
    ${det('Details', 'Branch feature/2-archive-workspaces · Pull request #42 · request id r-2 · jobs implement_feature, verify_feature, review_feature, publish_feature')}
  </div><div class="stack"><div class="panel"><h3>This request</h3><dl style="margin:0"><dt class="meta">Branch</dt><dd style="margin:0 0 4px">feature/2-archive-workspaces</dd><dt class="meta">Pull request</dt><dd style="margin:0 0 4px">#42</dd><dt class="meta">Started</dt><dd style="margin:0 0 4px">${blocked ? 'Today' : 'Tuesday'}</dd><dt class="meta">Review</dt><dd style="margin:0 0 4px">${blocked ? 'Round 2, a check did not pass' : '2 rounds'}</dd><dt class="meta">Checks</dt><dd style="margin:0">${blocked ? 'One failing' : 'Passed on the branch'}</dd></dl>${det('Details', 'Default branch: main')}</div>
  <div class="panel"><h3>What stays with you</h3>${ticks(['Merging the pull request','Deploying, and testing your running app'])}<p><b>Pramaan never pushes to your default branch.</b></p></div></div></div>`;
};

/* ---------- chat builders reused ---------- */
const qcard = (title, qs, sub) => ({ k:'q', title, qs, sub });
const askMsg = (key) => ({ k:'ask', key });
const ASK = {
  changes: { q:'What should change?', note:'Your comments are sent together when you ask for changes.', send:'Send changes', reply:'Got it. I will send your changes together and draft 2 comes back for you to read.' },
  plan: { q:'What should change in the plan?', note:'Nothing is built until you approve.', send:'Send changes', reply:'Got it. I will change the plan and bring it back for you to read.' },
  plan2: { q:'What should change in the plan?', note:'Creates a revision after the current sprint.', send:'Send changes', reply:'Noted. Pramaan finishes the current sprint first, then drafts the change for you to accept.' },
  revision: { q:'What should change?', note:'Pramaan finishes the current sprint first, then drafts the change for you to accept.', send:'Send the request', reply:'Noted. I will draft the change after the sprint.' },
};
const interviewQs = qcard('Two quick questions', [{ t:'Who plays?', o:['Two people on the same screen','Two people on different devices','One person against the computer'] }, { t:'What happens when someone wins?', free:true }], 'Your answers are saved as decisions.');

/* ---------- screens ---------- */
const nextA = (label, sub, go, extra = {}) => ({ kind:'action', label, sub, go, ...extra });
const nextS = (p, text, extra = {}) => ({ kind:'status', pin:p, text, ...extra });
const BLD = 'Building sprint 1.';
const SC = {};
const add = (id, o) => { SC[id] = Object.assign({ mode:'idea', crumb:[], tabs:null, active:null, ov:'03', tape:null, view:null, vo:{}, saved:'', hist:null, comp:{} }, o); };
const proj = (name, leaf) => ['Projects', name, leaf].filter(Boolean);
const ph = 'Message Pramaan';

add('01', { mode:'home', crumb:['Projects'], tabs:[['Projects', null]], active:'0', view:'projects',
  chat:() => [ai('What do you want to build?'), chips({ l:'Start a new product', go:'02', title:'Describe your idea. Pramaan builds it, and you try it every sprint.' }, { l:'Hand off your code', go:'18', title:'Upload it or import it from GitHub. Pramaan takes it from there, and you can take a copy back any time.' }, { l:'Work in my repository', sub:'For engineering teams', go:'21', title:'Request features in a repository you own. Pramaan opens reviewed pull requests; you merge and deploy.' }), ai('Or open a project on the right. Projects that need you come first.')],
  next:() => nextA('Continue: test', 'Answer the next interview question.', '03', { quiet:{ label:'New project', go:'02' } }),
  comp:{ ph:'Describe your idea to start', hint:'Typing an idea here starts a new project.', send:'Send', key:'home' } });

add('02', { mode:'new', crumb:['Projects', 'New project'], tabs:[['Projects', '01'], ['New project', null]], active:'1', view:'newProject',
  init:(s) => { if (!s.draftSet) s.draft = { name:'test', idea:'a tic tac toe game' }; s.draftSet = false; },
  chat:(s) => { const m = [];
    if (!s.draft.name) { m.push(user(esc(s.draft.idea)), ai('Got it. What should I call your project?'));
    } else { m.push(ai("Let's set up your new project. What should I call it?"), user(esc(s.draft.name))); if (s.draft.idea) m.push(ai('What do you want built? Say it the way you would tell a friend.'), user(esc(s.draft.idea)), ai('Got it. Pramaan reads it once, and the interview asks the rest. Press Start the interview when you are ready.')); else m.push(ai('What do you want built? Say it the way you would tell a friend.')); }
    return m; },
  next:(s) => s.draft.name && s.draft.idea ? nextA('Start the interview', 'Pramaan starts reading as soon as you press this. Nothing is built yet.', '05b') : nextS(null, 'Nothing is built yet.', { quiet:{ label:'Start the interview', reason:'Add a name and an idea first.' } }),
  comp:{ ph:'Type a name or your idea', hint:'Say it the way you would tell a friend. Dictation works too.', send:'Send', key:'new' } });

add('03', { crumb:proj('test', 'Overview'), tabs:'proj', active:'overview', ov:'03', tape:T(0, ['05','08','11','13',null], LOCK_PLAN), view:'overview', vo:{ v:'decision' },
  saved:"Last saved: your decision 'Product idea', 14:02 · Nothing accepted yet", hist:'early',
  chat:() => [ai('A decision is waiting.'), ai('Answer the next interview question. You set the direction; Pramaan handles the technical setup.')],
  next:() => nextA('Continue the interview', '1 of about 6 interview topics answered.', '05', { pin:'Needs you', sentence:'Answer the next interview question.' }), comp:{ ph, key:'free' } });

add('04', { crumb:proj('Todo list', 'Overview'), tabs:'proj', active:'overview', ov:'04', tape:T(2, ['06','08','11b','13',null], LOCK_PLAN), view:'overview', vo:{ v:'paused' },
  saved:'Everything is saved. Last accepted: User journey draft 1, Tuesday', hist:'docs',
  chat:() => [ai('Budget used up.'), st('Paused', 'The monthly budget is used up. Raise it in Settings to continue. Everything you accepted is kept.')],
  next:() => nextA('Raise the budget', 'Everything you accepted is kept.', '16', { pin:'Paused', sentence:'Budget used up.', opts:{ focus:'budget' } }), comp:{ ph, key:'free' } });

const intHead = (n, extra) => ({ t:'Your product partner', n:`${n} of about 6 topics covered`, add:true, ...extra });
add('05b', { crumb:proj('test', 'Interview'), tabs:'proj', active:'decisions', ov:'03', tape:T(0, ['05b','08','11','13',null], LOCK_PLAN), view:'decisions', vo:{ v:'empty' },
  saved:"Last saved: your decision 'Product idea', 14:02 · Nothing accepted yet", hist:'early',
  chat:() => [ctx('Earlier messages'), user('a tic tac toe game'), ai('Hi. I read your idea: a tic tac toe game. I ask about one topic at a time. Every answer is saved as a decision you can change later.'), saved('Saved to your decisions: Product idea'), ai('First: who plays, and where? For example, two people on one phone, or two players on different devices.'), interviewQs],
  head:() => intHead(1),
  next:() => nextS('Needs you', 'Answer 2 questions.'), comp:{ ph:'Type a reply', hint:'Ctrl+Enter sends. Your decisions save as you go.', send:'Send reply', key:'reply05b' } });

add('05', { crumb:proj('test', 'Interview'), tabs:'proj', active:'decisions', ov:'03', tape:T(0, ['05','08','11','13',null], LOCK_PLAN), view:'decisions', vo:{ v:'running' },
  saved:"Last saved: your decision 'Screen purpose', 14:06 · Nothing accepted yet", hist:'early',
  chat:(s) => [ctx('Earlier messages'), user('a tic tac toe game'), ai(s.fromCode ? 'I read your code once. It stays unchanged. What would you like to add or improve first?' : 'Thanks. I have saved the product idea.'), user('Two people take turns on one screen.'), saved('Saved to your decisions: Screen purpose'), ai('Next: who plays, and what happens at the end of a game?'), interviewQs],
  head:(s) => intHead(2, s.fromCode ? { t:'Working from your code and your answers' } : {}),
  next:() => nextS('Needs you', 'Answer 2 questions.'), comp:{ ph:'Type a reply', hint:'Ctrl+Enter sends. Your decisions save as you go.', send:'Send reply', key:'reply' } });

add('06', { crumb:proj('ui test', 'Interview'), tabs:'proj', active:'decisions', ov:'03', tape:T(1, ['06','08','11','13',null], LOCK_PLAN), view:'decisions', vo:{ v:'finished' },
  saved:"Last saved: your decision 'First turn', 14:10 · Nothing accepted yet", hist:'brief',
  chat:() => [ctx('Earlier messages'), user('First turn: X takes the first turn in every new game.'), ai("I've saved that X takes the first turn in every new game."), ai('That is everything I need.'), st('Done', 'We have a direction. Your brief uses your latest saved decisions.')],
  head:() => ({ t:'Your product partner', n:'6 of 6 topics covered', add:true }),
  next:() => nextA('Create my product brief', 'Pramaan writes draft 1 from your 6 decisions. You read it before anything else happens.', '09', { pin:'Done', sentence:'Create your brief.', opts:{ pre:[st('Done', 'Draft 1 of your product brief is ready to read.')] } }),
  comp:{ ph:'Add anything else before the brief is written', hint:'Ctrl+Enter sends. Your decisions save as you go.', send:'Send reply', key:'free' } });

add('07', { crumb:proj('todo', 'Interview'), tabs:'proj', active:'decisions', ov:'03', tape:T(3, ['07','08','12','13',null], LOCK_TRY), view:'decisions', vo:{ v:'locked' },
  saved:"Last saved: your decision 'Daily reset', Tuesday · Last accepted: Sprint plan draft 2, Tuesday", hist:'build',
  chat:() => [ai('The interview is read only while sprint 1 is being built. Sprint 1 is being built. 1 of 3 features ready.'), ai('You can still read your decisions, ask for a revision, or open Build.'), chips({ l:'Request a revision', act:'ask', arg:'revision' }, { l:'Read your decisions', go:'07', opts:{ jump:'decs' } }, { l:'Open Build', go:'13' })],
  next:() => nextS('Working', BLD), comp:{ ph:'', disabled:'Read only while sprint 1 is being built.', key:'none', send:'Send' } });

add('08', { crumb:proj('todo', 'Documents'), tabs:'proj', active:'documents', ov:'03', tape:T(3, ['07','08','12','13',null], LOCK_TRY), view:'documents',
  saved:'Last accepted: Sprint plan draft 2, Tuesday', hist:'build',
  chat:(s) => s.imported ? [st('Done', 'Requirements draft 1 imported. It is waiting for you to read it.'), ai('Your requirements document is in Documents, waiting for you.')] : [ai('Your documents: 3 of 3 accepted, and the sprint plan too. Sprint 1 is being built.')],
  next:(s) => s.imported ? nextA('Read the requirements', 'Draft 1 is waiting for you to read it.', '09', { pin:'Needs you', sentence:'Requirements, draft 1.' }) : nextS('Working', BLD), comp:{ ph, key:'free' } });

add('09', { crumb:[['Projects','01'], 'ui test', ['Documents','08'], 'Product brief'], tabs:'proj', active:'documents', ov:'03', tape:T(1, ['06','09','11','13',null], LOCK_PLAN), view:'reader', vo:{ v:'draft' },
  saved:"Last saved: your decision 'First turn', 14:10 · Nothing accepted yet", hist:'brief',
  chat:() => [st('Done', 'Draft 1 of your product brief is ready to read.'), ai('Read it on the right. Select a passage to comment on it.'), { k:'comment', t:"Constraints: 'I don't think this is a constraint'" }, chips({ l:'Ask for changes (1)', act:'ask', arg:'changes' })],
  next:() => nextA('Accept this draft', 'Draft 1. Nobody has accepted it yet.', '11', { pin:'Needs you', sentence:'Review this draft.', opts:{ pre:[st('Done', 'Draft 1 accepted. The plan opens next.')] } }), comp:{ ph:'Say what to change, or ask a question', key:'free' } });

add('10', { crumb:[['Projects','01'], 'todo', ['Documents','08'], 'Product brief'], tabs:'proj', active:'documents', ov:'03', tape:T(3, ['07','10','12','13',null], LOCK_TRY), view:'reader', vo:{ v:'locked' },
  saved:'Last accepted: Sprint plan draft 2, Tuesday', hist:'build',
  chat:() => [ai('This document is read only while sprint 1 is being built.'), ai('You can still read it. To change it, ask for a revision.'), chips({ l:'Request a revision', act:'ask', arg:'revision' }, { l:'Open Build', go:'13' })],
  next:() => nextS('Working', BLD), comp:{ ph, key:'free' } });

add('11b', { crumb:proj('todo', 'Roadmap'), tabs:'proj', active:'roadmap', ov:'03', tape:T(2, ['07','08','11b','13',null], LOCK_PLAN), view:'roadmap', vo:{ v:'drafting' },
  saved:'Last accepted: User journey draft 1, Tuesday', hist:'docs',
  chat:() => [ai('I am drafting your plan.'), st('Working', 'Pramaan is drafting your plan from the three accepted documents. Nothing needed from you.'), chips({ l:'Read the documents', go:'08' })],
  next:() => nextS('Working', 'Drafting your plan.', { quiet:{ label:'Approve the plan', reason:'Opens when the draft is ready.' } }), comp:{ ph, key:'free' } });

add('11', { crumb:proj('todo', 'Roadmap'), tabs:'proj', active:'roadmap', ov:'03', tape:T(2, ['07','08','11','13',null], LOCK_PLAN), view:'roadmap', vo:{ v:'awaiting' },
  saved:'Last accepted: Sprint plan draft 2, 31 minutes ago', hist:'plan',
  chat:() => [ai('Your plan is ready.'), ai('4 sprints. Sprint 1 builds your private checklist. Nothing is built until you approve.'), chips({ l:'Ask for changes to the plan', act:'ask', arg:'plan' })],
  next:() => nextA('Approve the plan and start building', 'Pramaan checks with you before each sprint starts. Change this in Settings.', '12', { pin:'Needs you', sentence:'Approve the plan.', opts:{ pre:[st('Done', 'Plan approved. Sprint 1 is being built.')] } }), comp:{ ph:'Say what to change, or ask a question', key:'free' } });

add('12', { crumb:proj('todo', 'Roadmap'), tabs:'proj', active:'roadmap', ov:'03', tape:T(3, ['07','08','12','13',null], LOCK_TRY), view:'roadmap', vo:{ v:'approved' },
  saved:'Last accepted: Sprint plan draft 2, Tuesday', hist:'build',
  chat:() => [ai('Plan approved.'), st('Working', 'Sprint 1 is being built. Sprint 2 starts when you accept sprint 1.'), chips({ l:'Open Build', go:'13' }, { l:'Ask for a change to the plan', act:'ask', arg:'plan2' })],
  next:() => nextS('Working', BLD), comp:{ ph, key:'free' } });

add('13', { crumb:proj('todo', 'Build'), tabs:'proj', active:'build', ov:'03', tape:T(3, ['07','08','12','13',null], LOCK_TRY), view:'build', vo:{ v:'building' },
  saved:'Last accepted: Sprint plan draft 2, Tuesday', hist:'build',
  chat:(s) => [act('Sign-up and log-in is ready · 4 minutes ago', 'Done'), act('Your own checklist is built · 2 minutes ago', 'Done'), act(s.ready ? 'Testing your own checklist · done' : 'Testing your own checklist · 1 minute ago', s.ready ? 'Done' : 'Working'), ...(s.ready ? [act('Sprint 1 is ready to try · just now', 'Done'), st('Done', 'Sprint 1 is ready to try.')] : [st('Working', 'Pramaan is building sprint 1. Nothing needed from you.')])],
  next:(s) => s.ready ? nextA('Try sprint 1', 'Try it against 5 checks. Sprint 2 waits until you accept sprint 1.', '15', { pin:'Needs you', sentence:'Ready. Press Try sprint 1.' }) : nextS('Working', BLD), comp:{ ph, key:'free' } });

add('13b', { crumb:proj('todo', 'Build'), tabs:'proj', active:'build', ov:'03', tape:T(3, ['07','08','12','13b',null], LOCK_TRY), view:'build', vo:{ v:'blocked' },
  saved:'Last accepted: Sprint plan draft 2, Tuesday', hist:'build',
  chat:() => [ai('A check did not pass.'), st('Blocked', 'A check did not pass on your own checklist. Pramaan is fixing it and runs the check again. Nothing needed from you.'), chips({ l:'See what happened', go:'17', opts:{ keep:true, ctx:'Live logs' } })],
  next:() => nextS('Blocked', 'Fixing a check.'), comp:{ ph, key:'free' } });

add('14', { crumb:proj('test first', 'Build'), tabs:'proj', active:'build', ov:'03', tape:T(5, ['06','08','12','14','15'], ''), view:'build', vo:{ v:'accepted' },
  saved:'Last accepted: Sprint 1, Calculator on every device, Tuesday 14:10', hist:'done',
  chat:() => [ai('All sprints accepted.'), st('Done', 'All planned sprints accepted. Nothing further is scheduled.')],
  next:() => nextA('Open your product', 'You can open your product any time and plan more.', null, { pin:'Done', sentence:'All planned sprints accepted.', act:'noProduct' }), comp:{ ph, key:'free' } });

add('15', { crumb:proj('test first', 'Try it'), tabs:'proj', active:'tryit', ov:'03', tape:T(4, ['06','08','12','13','15'], ''), view:'try',
  init:(s) => { s.verdicts = ['Yes', 'Yes', 'Not quite', null, null]; s.notes = { 2:'I saw 20' }; s.device = 'Computer'; s.words = false; },
  saved:"Last saved: your answer to check 3, 14:10 · Last accepted: Sprint plan draft 2, Tuesday", hist:'tryit',
  chat:() => [ai('Try sprint 1 on the right, then tell me how each check went.'), saved('Saved answer to check 1, Yes'), saved('Saved answer to check 2, Yes'), saved('Saved answer to check 3, Not quite')],
  next:(s) => tryNext(s), comp:{ ph:'Anything else to tell Pramaan?', key:'free' } });
function tryNext(s) {
  const v = s.verdicts, n = v.filter(Boolean).length, bad = v.filter((x) => x && x !== 'Yes').length;
  if (bad) return nextA(`Ask for changes (${bad})`, 'Your notes go to Pramaan as the next fix.', '13', { pin:'Needs you', sentence:`${n} of 5 answered.`, opts:{ pre:[st('Working', 'Your notes went to Pramaan as the next fix. Sprint 1 is being fixed.')] }, quiet:{ label:'Accept anyway', go:'14', opts:{ pre:[st('Done', 'Sprint 1 accepted.')] } } });
  if (n === 5) return nextA('Accept sprint 1', 'All 5 checks answered Yes.', '14', { pin:'Needs you', sentence:'5 of 5 answered.', opts:{ pre:[st('Done', 'Sprint 1 accepted.')] } });
  return nextS('Needs you', `${n} of 5 answered.`, { quiet:{ label:'Accept sprint 1', reason:'Answer all 5 to accept.' } });
}

add('16', { crumb:proj('todo', 'Settings'), tabs:'proj', active:null, ov:'03', tape:T(3, ['07','08','12','13',null], 'Opens when sprint 1 is ready'), view:'settings',
  saved:'Last saved: your settings, 35 minutes ago · Last accepted: Sprint plan draft 2, Tuesday', hist:'settings',
  chat:() => [ai('Settings for this project.')], next:() => nextS('Working', BLD), comp:{ ph, key:'free' } });

add('17', { mode:'home', crumb:['Projects', 'Live logs'], tabs:[['Projects', '01']], active:null, view:'logs',
  chat:() => [ai('Live logs are open on the right, in plain rows.'), ctx('Now showing: Live logs')], next:() => nextS('Working', 'Live. 69 lines so far.'), comp:{ ph, key:'free' } });

const hand = (v, file) => ({ mode:'handoff', crumb:['Projects', 'Hand off your code'], tabs:[['Projects', '01'], ['Hand off your code', null]], active:'1', view:'handoff', vo:{ v }, init:(s) => { s.file = file; if (v === 'github') s.gh = true; if (v === 'ghperm') s.gh = false; if (v === 'upload') s.gh = true; } });
add('18', { ...hand('upload', 'ok'), chat:() => [ai('Where is your code?'), chips({ l:'Upload a .zip', go:'18', on:true }, { l:'Import from GitHub', go:'18b' }, { l:'Choose a different file', act:'pickFile' })],
  next:() => nextA('Create private working copy', 'Your code is read once.', '19'), comp:{ ph, key:'free' } });
add('18b', { ...hand('github', 'ok'), chat:() => [ai('Pick the code to bring.'), chips({ l:'Upload a .zip', go:'18' }, { l:'Import from GitHub', go:'18b', on:true })],
  next:() => nextA('Create private working copy', 'Your code is read once.', '19'), comp:{ ph, key:'free' } });
add('18c', { ...hand('upload', 'big'), chat:() => [st('Blocked', 'That file is too big. Choose a file under 200 MB.'), chips({ l:'Choose another file', act:'pickFile' }, { l:'Import from GitHub', go:'18b' })],
  next:() => nextS('Blocked', 'File too big. Choose a file under 200 MB.', { quiet:{ label:'Create private working copy', reason:'Choose a file under 200 MB first.' } }), comp:{ ph, key:'free' } });
add('18d', { ...hand('upload', 'rar'), chat:() => [st('Blocked', 'That file is a .rar, not a .zip. Choose a .zip file.'), chips({ l:'Choose another file', act:'pickFile' }, { l:'Import from GitHub', go:'18b' })],
  next:() => nextS('Blocked', 'Not a .zip. Choose a .zip file.', { quiet:{ label:'Create private working copy', reason:'Choose a .zip file first.' } }), comp:{ ph, key:'free' } });
add('18e', { ...hand('ghperm', 'ok'), chat:() => [st('Needs you', 'GitHub needs your permission first.'), ai('Pramaan asks GitHub to read your code. GitHub shows you exactly what it asks for.'), chips({ l:'Upload a .zip', go:'18' }, { l:'Import from GitHub', go:'18b', on:true })],
  next:() => nextA('Give permission on GitHub', 'Allow Pramaan to read your code.', null, { pin:'Needs you', sentence:'GitHub needs your permission first.', act:'stub', quiet:{ label:'Create private working copy', reason:'Give permission first.' } }), comp:{ ph, key:'free' } });

add('19', { mode:'handoff', crumb:proj('Customer portal', 'Overview'), tabs:'proj', active:'overview', ov:'19', tape:T(0, [null, null, null, null, null], 'Opens when your private copy is ready', { 0:'Opens when your private copy is ready', 4:LOCK_PLAN }), view:'overview', vo:{ v:'copying' },
  saved:'Nothing saved yet. Your code is being copied.', hist:'copy',
  chat:() => [st('Working', 'Copying your code.'), act('Received customer-portal.zip (38 MB)', 'Done'), act('Unpacked it. Dependencies, build output and the .git folder are left out.', 'Done'), act('Making your private copy', 'Working')],
  next:() => nextS('Working', 'Copying your code.'), comp:{ ph, key:'free' } });

add('20', { mode:'handoff', crumb:proj('Customer portal', 'Your requirements'), tabs:'proj', active:'decisions', ov:'19', tape:T(0, ['20','08','11','13',null], LOCK_PLAN), view:'requirements',
  init:(s) => { s.doc = ''; s.docFile = ''; s.imported = false; s.fromCode = false; },
  saved:'Last saved: your upload customer-portal.zip, today · Nothing accepted yet', hist:'code',
  chat:() => [ai('Your private copy is ready. Your original code stays unchanged.'), ai('Have a requirements document? Bring it, or answer questions about your code.'), chips({ l:'Use this document', act:'useDoc', needs:'doc', disabled:true, reason:'Add a document first.' })],
  next:() => nextA('Start the interview', 'About your code and what to build next.', '05', { pin:'Done', sentence:'Your private copy is ready.', opts:{ fromCode:true } }), comp:{ ph, key:'free' } });

const repoc = (v) => ({ mode:'repo', crumb:['Projects', 'Work in my repository'], tabs:[['Projects', '01'], ['Choose your repository', null]], active:'1', view:'repoConnect', vo:{ v } });
add('21', { ...repoc('ok'), chat:() => [ai('Choose your repository.')], next:() => nextA('Connect repository', 'Pramaan opens pull requests here.', '22'), comp:{ ph, key:'free' } });
add('21b', { ...repoc('permission'), chat:() => [ai('Choose your repository.'), st('Blocked', 'Pramaan cannot open pull requests in test-org/insight-weaver-537 yet.')], next:() => nextA('Install the app on GitHub', 'The Pramaan GitHub App is not installed for this repository.', null, { pin:'Blocked', sentence:'App not installed.', act:'stub', quiet:{ label:'Connect repository', reason:'Install the app first.' } }), comp:{ ph, key:'free' } });
add('21c', { ...repoc('empty'), chat:() => [ai('No repositories found.'), ai('Your GitHub account has no repositories Pramaan can see. Install the Pramaan app on the organisation that owns your code.')], next:() => nextA('Install the app on GitHub', 'Then your repositories appear here.', null, { act:'stub', quiet:{ label:'Connect repository', reason:'Install the app first.' } }), comp:{ ph, key:'free' } });

const reqm = { ph:'Describe the change the way you would in a ticket. One change per request.', hint:'Pramaan starts on a new branch as soon as you send. Nothing touches main.', send:'Send the request', reason:'Type the change first.', key:'req' };
add('22', { mode:'repo', crumb:proj('insight-weaver-537', 'Requests'), tabs:[['Requests', null]], active:'0', view:'requests', vo:{ v:'list' }, saved:MERGED, hist:'repo',
  chat:() => [ai('What should change? Describe it below and I will start on a new branch.')],
  next:() => nextA('Open pull request #42', "Merge 'Let admins archive old workspaces'.", null, { pin:'Needs you', sentence:'Ready to merge.', act:'stub' }), comp:reqm });
add('22b', { mode:'repo', crumb:proj('insight-weaver-537', 'Requests'), tabs:[['Requests', null]], active:'0', view:'requests', vo:{ v:'empty' }, saved:'Nothing merged yet. Your first request is kept the moment you send it.', hist:'repo0',
  chat:() => [ai('What should change? Describe it below and I will start on a new branch.')],
  next:() => nextS(null, 'Nothing needs you. Describe the first change.'), comp:{ ...reqm, thread:true } });

const rtape = (cur, mer, rev) => ({ cur, links:['#st-build','#st-test','#st-review', mer ? null : '#st-merge'], lock:'Opens when the review passes', reasons:{ 2:rev }, req:true });
add('23', { mode:'repo', crumb:[['Projects','01'], 'insight-weaver-537', ['Requests','22'], 'Let admins archive old workspaces'], tabs:[['Requests', '22']], active:'0', tape:rtape(3, false, 'Review: 2 rounds'), view:'request', vo:{ v:'ready' }, saved:MERGED, hist:'repo',
  chat:() => [ai('Ready to merge.'), st('Done', 'Made the change on a new branch'), st('Done', 'Tested the change it made'), st('Done', 'Opened a pull request and had it reviewed'), st('Done', 'Fixed what the review found, and had it reviewed again')],
  next:() => nextA('Open pull request #42', 'Reviewed twice. Merge it when you are ready. Pramaan never pushes to your default branch.', null, { pin:'Needs you', sentence:'Ready to merge.', act:'stub' }), comp:{ ...reqm, send:'Send the request' } });
add('23b', { mode:'repo', crumb:[['Projects','01'], 'insight-weaver-537', ['Requests','22'], 'Send a summary email every Monday'], tabs:[['Requests', '22']], active:'0', tape:rtape(2, true, 'Review: round 2, a check did not pass'), view:'request', vo:{ v:'blocked' }, saved:MERGED, hist:'repo',
  chat:() => [ai('A check did not pass in round 2.'), st('Blocked', 'Fixing what the review found. Pramaan is fixing it on the branch; nothing needed from you.')],
  next:() => nextS('Blocked', 'Fixing round 2.'), comp:reqm });

/* ---------- renderers ---------- */
function parseHash() {
  const m = location.hash.match(/s=(\d\d[a-e]?)(?:&v=(\w+))?/);
  return { id: m && SC[m[1]] ? m[1] : '01', v: m ? m[2] || '' : '' };
}
function go(id, o = {}) {
  S.opts = o;
  const h = '#s=' + id + (o.v ? '&v=' + o.v : '');
  if (location.hash === h) render(); else location.hash = h;
}
const leaf = (id) => { if (id === '16') return 'Settings'; if (id === '17') return 'Live logs'; const c = SC[id].crumb.slice(-1)[0]; return Array.isArray(c) ? c[0] : c; };
const nextOf = () => (S.nextFn ? S.nextFn(S) : null);

function render() {
  const { id, v } = parseHash(); const sc = SC[id]; const o = S.opts || {}; S.opts = {};
  const prev = S.id; S.id = id; S.v = v; S.sc = sc; S.ready = id === '13' && v === 'ready';
  const keep = o.keep && S.csc;
  const sp = (x) => x === '16' || x === '17';
  if (keep && sp(id) && !sp(prev) && prev) S.prevId = prev;
  S.back = !!(keep && sp(id) && S.prevId && S.prevId !== id);
  S.fromCode = id === '05' && o.fromCode === true;
  if (id === '08') S.imported = o.imported === true || (S.imported && prev === '08' && !!o.ctx) || (S.imported && !!keep);
  if (!(['22','22b','23','23b'].includes(id) && ['22','22b','23','23b'].includes(prev))) S.newReqs = [];
  if (!keep) {
    if (sc.init) sc.init(S);
    S.csc = sc; S.nextFn = sc.next; S.comp = sc.comp || {}; S.saved = sc.saved || '';
    S.hist = sc.hist ? (sc.hist === 'repo0' ? [] : H[sc.hist] || []) : [];
    S.chat = sc.chat(S).slice();
    if (o.pre) S.chat.unshift(...o.pre);
    if (o.say) S.chat.push(...o.say);
  }
  if (o.ctx) S.chat.push(ctx('Now showing: ' + o.ctx));
  document.body.dataset.screen = id; document.body.dataset.mode = sc.mode;
  document.body.dataset.variant = S.ready ? 'ready' : S.imported && id === '08' ? 'imported' : '';
  renderTop(); renderTabs(); renderView(o); renderChat(); renderDock(); renderComposer();
  { const m = $('#msgs'); m.scrollTop = m.scrollHeight; checkPill(); }
  $('#badge').textContent = `maps to ${id} ${NAMES[id]}`;
  $$('.drawer a').forEach((a) => (a.href.endsWith('#s=' + id) ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current')));
  $('#drawer').hidden = true; $('#sb-pop').hidden = true; $('#hist').hidden = true;
  $('#btn-settings').setAttribute('aria-pressed', id === '16'); $('#btn-logs').setAttribute('aria-pressed', id === '17');
}

function renderTop() {
  const sc = S.sc;
  $('#crumb').innerHTML = sc.crumb.map((c, i, a) => { const last = i === a.length - 1; const lab = Array.isArray(c) ? c[0] : c; const to = Array.isArray(c) ? c[1] : (i === 0 ? '01' : null);
    return to && !last ? `<a data-go="${to}" role="link" tabindex="0">${esc(lab)}</a>` : last ? `<b>${esc(lab)}</b>` : esc(lab); }).join(' / ');
  const t = tapeOf(sc); const el = $('#tape');
  if (!t) { el.hidden = true; el.innerHTML = ''; return; }
  el.hidden = false;
  if (t.req) { el.setAttribute('aria-label', 'This request');
    el.innerHTML = ['Build','Test','Review','Merge'].map((n, i) => { const state = i === t.cur ? 'current' : t.links[i] == null ? 'locked' : i < t.cur ? 'done' : 'upcoming'; const why = t.reasons[i] || (state === 'locked' ? t.lock : n);
      return `<li><button type="button" class="step" data-state="${state}" data-rstep="${i}" title="${esc(why)}">${n}</button></li>`; }).join(''); return; }
  el.setAttribute('aria-label', 'Stages');
  el.innerHTML = STEPS.map((s, i) => { const state = stepState(t, i); const why = stepReason(t, i, s[1]);
    return `<li><button type="button" class="step" data-state="${state}" data-step="${i}" title="${esc(why)}">${s[1]}</button></li>`; }).join('');
}
function renderTabs() {
  const sc = S.sc; const el = $('#tabs'); let tabs;
  if (sc.tabs === 'proj') {
    const t = tapeOf(sc);
    tabs = [['overview', 'Overview', sc.ov, 'done'], ...TABKEYS.map((k, i) => [k, TABNAMES[k], t.links[i], stepState(t, i), stepReason(t, i, STEPS[i][1])])];
    if (S.id === '08' && S.imported) tabs[1][3] = 'done';
    el.innerHTML = tabs.map((x) => `<button type="button" role="tab" class="tab" data-state="${x[0] === 'overview' ? 'done' : x[3]}" aria-selected="${sc.active === x[0]}" ${x[2] ? `data-tab="${x[2]}"` : `data-locked="1"`} data-name="${x[1]}" title="${esc(x[4] || '')}">${x[1]}</button>`).join('');
  } else {
    el.innerHTML = sc.tabs.map((x, i) => `<button type="button" role="tab" class="tab" aria-selected="${String(sc.active) === String(i)}" ${x[1] ? `data-tab="${x[1]}"` : ''} data-name="${x[0]}">${x[0]}</button>`).join('');
  }
}
function renderView(o) {
  const sc = S.sc; const el = $('#view');
  const fn = { projects:V.projects, newProject:V.newProject, overview:V.overview, decisions:V.decisions, requirements:V.requirements, documents:V.documents, reader:V.reader, roadmap:V.roadmap, build:V.build, try:V.try, settings:V.settings, logs:V.logs, handoff:V.handoff, repoConnect:V.repoConnect, requests:V.requests, request:V.request }[sc.view];
  let html = fn(sc.vo);
  if (S.back && S.prevId !== S.id && SC[S.prevId]) html = `<div>${gob('Back to ' + NAMES[S.prevId], S.prevId, 'data-keep="1"')}</div>` + html;
  el.innerHTML = html; el.scrollTop = 0;
  if (sc.view === 'projects') renderProjects();
  if (sc.view === 'requirements') refreshDoc();
  if (o.focus === 'budget') { const b = $('#s-budget'); if (b) { b.focus(); b.select(); } }
  if (o.jump) jump(o.jump);
}
function renderChat() {
  const sc = S.csc; const el = $('#msgs');
  const hd = sc.head ? sc.head(S) : null;
  $('#chathead').innerHTML = hd ? `<b>${hd.t}</b> <span class="meta">${hd.n}</span> ${hd.add ? q('Have a document already? Add it', 'data-act="attach"', 'link') : ''}` : '';
  $('#chathead').hidden = !hd;
  $('#strip').hidden = !S.saved;
  $('#strip-t').textContent = S.saved;
  $('#hist').innerHTML = `<b>History</b><ol style="list-style:none;padding:0;margin:4px 0 0">${(S.hist || []).slice(0, 8).map((h) => `<li class="row between"><span><small>${h[0]}</small> ${h[1]}</span>${gob('Open', h[2], 'data-keep="1"')}</li>`).join('') || '<li class="meta">Nothing saved yet.</li>'}</ol>`;
  el.innerHTML = S.chat.map((m, i) => msgHTML(m, i)).join('');
  el.scrollTop = el.scrollHeight;
  checkPill();
}
function msgHTML(m, i) {
  switch (m.k) {
    case 'ai': return `<div class="m ai">${m.t}</div>`;
    case 'user': return `<div class="m user">${m.t}</div>`;
    case 'saved': return `<div class="m saved">${m.t}</div>`;
    case 'status': return `<div class="m status">${m.p ? pin(m.p) + ' ' : ''}${m.t}</div>`;
    case 'act': return `<div class="m act">${m.p ? pin(m.p) + ' ' : ''}${m.t}</div>`;
    case 'ctx': return `<div class="m ctx">${m.t}</div>`;
    case 'att': return `<div class="m att">${m.t}</div>`;
    case 'comment': return `<div class="m comment" id="cm1">${m.t}<div class="meta">You, draft 1 ${q('Remove comment', 'data-act="rmComment"', 'link')}</div></div>`;
    case 'chips': return `<div class="chips">${m.items.map((it, j) => { const dis = it.disabled && !(it.needs === 'doc' && docReady()); return `<button type="button" class="chip ${it.on ? 'on' : ''}" ${it.title ? `title="${esc(it.title)}"` : ''} data-chip="${i}:${j}" ${dis ? 'aria-disabled="true"' : ''} ${it.needs ? `data-needs="${it.needs}"` : ''}>${it.l}</button>${it.sub ? `<small>${it.sub}</small>` : ''}${it.reason ? `<small data-needs-reason="${it.needs || ''}" ${dis ? '' : 'hidden'}>${it.reason}</small>` : ''}`; }).join('')}</div>`;
    case 'ask': { const a = ASK[m.key]; return `<div class="m card" data-ask="${i}"><b>${a.q}</b><div class="meta">${a.note}</div><div class="field"><input type="text" class="in" aria-label="${a.q}"></div><div class="row">${q(a.send, `data-act="askSend" data-arg="${i}"`)}${q('Cancel', `data-act="askCancel" data-arg="${i}"`)}</div></div>`; }
    case 'q': return `<div class="m q"><b>${m.title}</b>${m.qs.map((x, n) => `<fieldset><legend>${x.t}</legend>${x.free ? `<input type="text" placeholder="Type your answer">` : x.o.map((op) => `<label><input type="radio" name="q${n}"> ${op}</label>`).join('')}</fieldset>`).join('')}<button type="button" class="primary-action" data-act="submit" style="padding:7px 12px;font-weight:600">Submit answers</button><div class="meta">${m.sub}</div></div>`;
    default: return '';
  }
}
function addMsg(m) { S.chat.push(m); const el = $('#msgs'); el.insertAdjacentHTML('beforeend', msgHTML(m, S.chat.length - 1)); el.scrollTop = el.scrollHeight; }
function setSaved(t) { S.saved = t; $('#strip').hidden = !t; $('#strip-t').textContent = t; }

function dockHTML(n) {
  if (!n || n.kind === 'none') return '';
  const qr = n.quiet ? `<div class="quiet-row">${q(n.quiet.label, `data-dock="quiet" ${n.quiet.reason ? 'aria-disabled="true"' : ''}`)}${n.quiet.reason ? `<span class="reason">${n.quiet.reason}</span>` : ''}</div>` : '';
  if (n.kind === 'action') return `<div class="dock-tag">Next step</div>${n.pin ? `<div class="status-line" style="margin-bottom:6px">${pin(n.pin)}<span>${n.sentence || ''}</span></div>` : ''}<button type="button" class="primary-action" data-dock="primary">${n.label}</button>${n.sub ? `<p class="sub-sentence">${n.sub}</p>` : ''}${qr}`;
  return `<div class="dock-tag">Next step</div><div class="status-line">${n.pin ? pin(n.pin) : ''}<span>${n.text}</span></div>${qr}`;
}
function renderDock() { const d = $('#dock'); d.innerHTML = dockHTML(nextOf()); d.dataset.kind = (nextOf() || {}).kind || 'none'; }

function renderComposer() {
  const c = S.comp; const ta = $('#msg');
  ta.value = ''; ta.placeholder = c.ph || ''; ta.disabled = !!c.disabled;
  $('#hint-t').textContent = c.disabled || c.hint || ''; $('#dict-status').textContent = '';
  $('#send').textContent = c.send || 'Send';
  $('#dictate').setAttribute('aria-pressed', 'false');
  updateSend();
}
function updateSend() {
  const c = S.comp; const has = $('#msg').value.trim().length > 0 && !c.disabled; const b = $('#send');
  const thread = c.thread && has;
  b.className = thread ? 'primary-action' : 'quiet';
  b.setAttribute('aria-disabled', has ? 'false' : 'true');
  $('#send-reason').textContent = !has && !c.disabled && c.reason ? c.reason : '';
  if (c.disabled) b.setAttribute('aria-disabled', 'true');
}
function checkPill() { const el = $('#msgs'); const far = el.scrollHeight - el.scrollTop - el.clientHeight > 60; $('#pill').hidden = !(far && S.csc && S.csc.head); }

/* ---------- behaviour ---------- */
const docReady = () => !!(S.doc.trim() || S.docFile);
function refreshDoc() {
  const ok = docReady();
  $$('[data-needs="doc"]').forEach((b) => b.setAttribute('aria-disabled', ok ? 'false' : 'true'));
  $$('[data-needs-reason="doc"]').forEach((b) => (b.hidden = ok));
}
function jump(id) { const t = document.getElementById(id); if (t) t.scrollIntoView({ block:'start' }); }
function fire(it) { if (!it) return; if (it.act) ACT[it.act](it); else if (it.go) go(it.go, it.opts || {}); }

const ACT = {
  stub() { addMsg(STUB); },
  noProduct() { addMsg(st('Waiting', 'Opening your product is not part of this prototype.')); },
  stubCopy() { addMsg(st('Waiting', 'Taking a copy is not part of this prototype.')); },
  stubTab() { addMsg(st('Waiting', 'Opening a new tab is not part of this prototype.')); },
  clearSearch() { S.projQ = ''; $('#pq').value = ''; renderProjects(); },
  clearRepo() { $('#rq').value = ''; filterRepos(''); },
  repoPick(el) { S.repo = +el.dataset.arg; $$('#rlist [role=radio]:not([aria-disabled])').forEach((b) => b.setAttribute('aria-checked', b.dataset.arg === el.dataset.arg)); },
  ghRepo(el) { S.ghRepo = +el.dataset.arg; $$('[data-act=ghRepo]').forEach((b) => b.setAttribute('aria-checked', b.dataset.arg === el.dataset.arg)); },
  pickFile() { addMsg(ai('Which file do you want to try? (Review only: pretend to choose.)')); addMsg(chips({ l:'customer-portal.zip (38 MB)', go:'18' }, { l:'customer-portal-full.zip (312 MB)', go:'18c' }, { l:'customer-portal.rar', go:'18d' })); },
  pickDoc() { S.docFile = 'customer-portal-requirements.md'; $('#docfile').textContent = S.docFile; refreshDoc(); },
  useDoc() { if (!docReady()) return; go('08', { imported:true }); },
  attach() { addMsg({ k:'att', t:'customer-portal-notes.txt (attached)' }); },
  dictate(el) { const on = el.getAttribute('aria-pressed') !== 'true'; el.setAttribute('aria-pressed', on); $('#dict-status').textContent = on ? 'Listening. Press the button again to stop. Nothing is sent until you press Send.' : 'Nothing was heard. Try again, or type.'; },
  ask(el) { const key = el.dataset ? el.dataset.arg : el.arg; const tgt = ASK[key] ? key : 'changes'; addMsg(askMsg(tgt)); const f = $('#msgs .m[data-ask]:last-child input'); if (f) f.focus(); },
  askSend(el) { const i = +el.dataset.arg; const m = S.chat[i]; const a = ASK[m.key]; const card = el.closest('.m'); const txt = card.querySelector('input').value.trim() || '(no text)'; S.chat[i] = { k:'saved', t:'Request sent.' }; card.remove(); addMsg(user(esc(txt))); addMsg(ai(a.reply)); },
  askCancel(el) { const i = +el.dataset.arg; S.chat[i] = { k:'ctx', t:'Cancelled.' }; el.closest('.m').remove(); },
  rmComment() { $('#cm1')?.remove(); S.chat = S.chat.filter((m) => m.k !== 'comment'); },
  goComment() { const c = $('#cm1'); if (c) { c.scrollIntoView({ block:'center' }); c.style.outline = '2px solid var(--ink)'; setTimeout(() => (c.style.outline = ''), 1200); } },
  submit() { if (S.id === '05b') go('05'); else go('06'); },
  words() { S.words = !S.words; renderView({}); },
  device(el) { S.device = el.dataset.arg; renderView({}); },
  verdict(el) { const [i, x] = el.dataset.arg.split('|'); S.verdicts[+i] = x; addMsg(saved(`Saved answer to check ${+i + 1}, ${x}`)); setSaved(`Last saved: your answer to check ${+i + 1}, now · Last accepted: Sprint plan draft 2, Tuesday`); S.hist = [['now', `Saved answer to check ${+i + 1}, ${x}`, '15'], ...S.hist].slice(0, 8); const y = $('#view').scrollTop; renderView({}); $('#view').scrollTop = y; renderDock(); },
  editDec(el) { const p = el.closest('[data-dec]'); const dv = p.querySelector('.dv'); p.dataset.old = dv.textContent; dv.innerHTML = `<input type="text" class="in" value="${esc(dv.textContent)}"> <button type="button" class="quiet" data-act="decSave">Save</button> <button type="button" class="quiet" data-act="decCancel">Cancel</button>`; },
  decSave(el) { const p = el.closest('[data-dec]'); const val = p.querySelector('input').value; p.querySelector('.dv').textContent = val; setSaved(`Last saved: your decision '${p.dataset.dec}', now · Nothing accepted yet`); },
  decCancel(el) { const p = el.closest('[data-dec]'); p.querySelector('.dv').textContent = p.dataset.old; },
  auto(el) { S.auto = !S.auto; el.setAttribute('aria-checked', S.auto); $('#autotxt').textContent = S.auto ? 'Pramaan waits for you to try and accept a sprint before the next one starts.' : 'Pramaan starts the next sprint as soon as the previous one is built and checked. You can still ask for changes at any time.'; },
  monitor(el) { el.setAttribute('aria-checked', el.getAttribute('aria-checked') !== 'true'); },
  saveSec(el) { if (el.getAttribute('aria-disabled') === 'true') return; const k = el.dataset.arg; const r = $(`[data-reason=${k}]`); el.replaceWith(Object.assign(document.createElement('span'), { innerHTML: pin('Done') + ' Saved 14:10' })); if (r) r.remove(); setSaved('Last saved: your settings, now · Last accepted: Sprint plan draft 2, Tuesday'); },
  delAsk() { $('#del').hidden = false; }, delNo() { $('#del').hidden = true; },
  delYes() { $('#del').hidden = true; addMsg(st('Waiting', 'Deleting is not part of this prototype.')); },
  logpause() { S.paused = !S.paused; if (S.paused) S.logN = 12; renderView({}); },
  darkTheme(el) { const on = el.getAttribute('aria-checked') !== 'true'; el.setAttribute('aria-checked', on); document.body.classList.toggle('dark', on); },
  accountStub() { addMsg(st('Waiting', 'That is not part of this prototype.')); $('#sb-pop').hidden = true; },
};

function filterRepos(t) { $$('#rlist [data-r]').forEach((b) => (b.hidden = !b.dataset.r.toLowerCase().includes(t.toLowerCase()))); }
function filterLogs() {
  const lv = $('#lv').value, lp = $('#lp').value, rq = $('#lr').checked;
  $$('#loglist .logrow').forEach((r) => { const okL = lv === 'All levels' || r.dataset.level === lv.toUpperCase(); const okP = lp === 'All projects' || r.dataset.project === lp; const okR = rq || r.dataset.req === '0'; r.hidden = !(okL && okP && okR); });
}

function stepGo(i) {
  const t = tapeOf(S.sc); const label = STEPS[i][1]; const to = t.links[i];
  if (to) go(to, { ctx:label }); else addMsg(ctx(`${label}: ${stepReason(t, i, label)}`));
}

function onSend() {
  const ta = $('#msg'); const text = ta.value.trim(); const c = S.comp;
  if (!text || c.disabled) return; const t = esc(text); ta.value = ''; updateSend();
  switch (c.key) {
    case 'home': S.draft = { name:'', idea:text }; S.draftSet = true; go('02'); return;
    case 'new': addMsg(user(t)); if (!S.draft.name) { S.draft.name = text; addMsg(ai('Saved the name. What do you want built?')); } else { S.draft.idea = text; addMsg(ai('Saved. Press Start the interview when you are ready.')); }
      $('#f-name').value = S.draft.name; $('#f-idea').value = S.draft.idea; renderDock(); return;
    case 'reply05b': go('05', { say:[user(t)] }); return;
    case 'reply': addMsg(user(t)); addMsg(saved('Saved to your decisions: your reply')); addMsg(ai('Thanks. I have saved that.')); setSaved("Last saved: your decision 'your reply', now · Nothing accepted yet"); return;
    case 'req': S.newReqs.unshift(text);
      if (S.id === '22b') { go('22', { say:[user(t), st('Done', 'Request sent. Pramaan starts on a new branch.')] }); return; }
      addMsg(user(t)); addMsg(st('Done', 'Request sent. Pramaan starts on a new branch.')); renderView({}); return;
    default: addMsg(user(t)); addMsg(ai('Noted. I will take that into account.'));
  }
}

/* ---------- wiring ---------- */
document.addEventListener('click', (e) => {
  const t = e.target.closest('button, a, [data-go], [data-act], [data-jump], mark'); if (!t) { closePops(e); return; }
  if (t.getAttribute('aria-disabled') === 'true') return;
  if (t.dataset.dock) { const n = nextOf(); const tg = t.dataset.dock === 'quiet' ? n.quiet : n; if (tg.reason) return; fire({ act:tg.act, go:tg.go, opts:tg.opts }); return; }
  if (t.dataset.chip) { const [i, j] = t.dataset.chip.split(':'); fire(S.chat[+i].items[+j]); return; }
  if (t.dataset.step) { stepGo(+t.dataset.step); return; }
  if (t.dataset.rstep) { const ids = ['st-build','st-test','st-review','st-merge']; const el = document.getElementById(ids[+t.dataset.rstep]); if (el) el.scrollIntoView({ block:'center' }); return; }
  if (t.dataset.tab !== undefined) { if (t.dataset.tab) go(t.dataset.tab, { ctx:t.dataset.name }); return; }
  if (t.classList.contains('tab') && t.dataset.locked) { addMsg(ctx(`${t.dataset.name}: ${t.title}`)); return; }
  if (t.dataset.jump) { jump(t.dataset.jump); return; }
  if (t.dataset.act) { ACT[t.dataset.act](t); return; }
  if (t.dataset.go) { go(t.dataset.go, t.dataset.keep ? { keep:true, ctx:leaf(t.dataset.go) } : {}); return; }
  const sw = t.closest('.switch button'); if (sw && !t.dataset.act) sw.setAttribute('aria-checked', sw.getAttribute('aria-checked') !== 'true');
});
function closePops(e) {
  if (!e.target.closest('#drawer, #btn-screens')) $('#drawer').hidden = true;
  if (!e.target.closest('#sb-pop, #btn-acct')) $('#sb-pop').hidden = true;
  if (!e.target.closest('#hist, #btn-hist')) $('#hist').hidden = true;
}
document.addEventListener('input', (e) => {
  const t = e.target;
  if (t.id === 'msg') { updateSend(); return; }
  if (t.dataset.draft) { S.draft[t.dataset.draft] = t.value; renderDock(); return; }
  if (t.dataset.doc) { S.doc = t.value; refreshDoc(); return; }
  if (t.dataset.saves) { const b = $(`[data-arg=${t.dataset.saves}]`); const r = $(`[data-reason=${t.dataset.saves}]`); if (b) b.setAttribute('aria-disabled', 'false'); if (r) r.textContent = ''; return; }
  if (t.id === 'pq') { S.projQ = t.value; renderProjects(); return; }
  if (t.id === 'rq') { filterRepos(t.value); return; }
  if (t.dataset.note) { S.notes[t.dataset.note] = t.value; }
});
document.addEventListener('change', (e) => { if (e.target.id === 'psort') { S.projSort = e.target.value; renderProjects(); } if (['lv','lp','lr'].includes(e.target.id)) filterLogs(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.ctrlKey && e.target.id === 'msg') { e.preventDefault(); onSend(); } if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('#crumb a')) { e.preventDefault(); e.target.click(); } });
document.addEventListener('mouseup', () => {
  const sel = getSelection(); const pop = $('#selpop'); const txt = sel ? sel.toString().trim() : '';
  if (S.id === '09' && txt && sel.anchorNode && $('#view').contains(sel.anchorNode)) { const r = sel.getRangeAt(0).getBoundingClientRect(); pop.style.top = Math.max(r.top - 34, 50) + 'px'; pop.style.left = Math.min(r.left, innerWidth - 220) + 'px'; pop.hidden = false; pop.dataset.q = txt.slice(0, 80); } else if (!pop.matches(':hover')) pop.hidden = true;
});

function init() {
  $('#send').addEventListener('click', onSend);
  $('#msgs').addEventListener('scroll', checkPill);
  $('#pill').addEventListener('click', () => { const el = $('#msgs'); el.scrollTop = el.scrollHeight; });
  $('#selpop').addEventListener('click', () => { const p = $('#selpop'); addMsg({ k:'att', t:`Comment on this passage: &ldquo;${esc(p.dataset.q)}&rdquo;<br><small>Your comments are sent together when you ask for changes.</small>` }); p.hidden = true; getSelection().removeAllRanges(); });
  $('#dictate').addEventListener('click', (e) => ACT.dictate(e.currentTarget));
  $('#attach').addEventListener('click', () => ACT.attach());
  $('#btn-hist').addEventListener('click', () => { $('#hist').hidden = !$('#hist').hidden; });
  $('#btn-screens').addEventListener('click', () => { $('#drawer').hidden = !$('#drawer').hidden; });
  $('#btn-acct').addEventListener('click', () => { $('#sb-pop').hidden = !$('#sb-pop').hidden; });
  const toggle = (id, name) => () => { if (S.id === id) { go(S.prevId, { keep:true, ctx:leaf(S.prevId) }); return; } go(id, { keep:true, ctx:name }); };
  $('#btn-settings').addEventListener('click', toggle('16', 'Settings'));
  $('#btn-logs').addEventListener('click', toggle('17', 'Live logs'));
  $('#drawer').innerHTML = GROUPS.map((g) => `<div class="${g[2]}"><h3>${g[0]}</h3><ul>${g[1].map((id) => `<li><a href="#s=${id}"><b>${id}</b>${NAMES[id]}</a></li>`).join('')}</ul></div>`).join('')
    + `<div style="grid-column:1/-1;border-top:1px solid var(--line);padding-top:6px" class="row"><b>Review only: demos</b>${q('Demo: sprint finishes', 'data-demo="sprint"')}${q('Demo: copy finishes', 'data-demo="copy"')}</div>`;
  $('#drawer').addEventListener('click', (e) => { const d = e.target.closest('[data-demo]'); if (!d) return; $('#drawer').hidden = true; if (d.dataset.demo === 'sprint') go('13', { v:'ready' }); else go('20'); });
  $('#drawer').addEventListener('click', (e) => { if (e.target.closest('a')) setTimeout(() => ($('#drawer').hidden = true), 0); });
  window.addEventListener('hashchange', render);
  render();
}
window.PRAMAAN_SPLIT = { SC, NAMES };
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
