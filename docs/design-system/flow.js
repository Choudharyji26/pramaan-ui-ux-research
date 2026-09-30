/* Tape and Thread flow prototype (vanilla, load with defer after shell.js and components.js).
   flow.html holds every screen as a section (34: 01 to 23 with their b to e states, two lanes included). The rail, top bar, tape, thread slot and strip exist once and are rewritten here
   from the per-screen snapshot in #pm-flow-data. Exactly one section is visible at a time. Nothing here is a backend: it is a click-through. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage blocked */ } }
  };
  var DATA = JSON.parse($("#pm-flow-data").textContent), BY = {};
  DATA.forEach(function (d) { BY[d.n] = d; });
  var main = $("#pm-main"), slot = $(".pm-slot"), crumb = $(".pm-crumb ol"), tape = $(".pm-tape"), tapeOl = $("ol", tape);
  var railNav = $(".pm-rail-nav"), strip = $(".pm-strip"), stripText = $(".pm-strip-text"), histOl = $("#pm-history ol");
  var panel = $("#pm-journey"), toggle = $("#pm-journey-toggle"), body = $("#pm-journey-body"), note = $("#pm-journey-note");
  var cur = null, io = null, ran = {}, fromPanel = false;

  /* What each screen fixes: the reviewer complaint ids are the ones in the coverage matrix (SPEC F). */
  var NAME = { "01": "Projects", "02": "New project", "03": "Overview, decision needed", "04": "Overview, paused", "05": "Interview running", "05b": "Interview, just started", "06": "Interview finished", "07": "Interview locked", "08": "Documents", "09": "Document draft", "10": "Document locked", "11": "Roadmap, awaiting approval", "11b": "Roadmap, being drafted", "12": "Roadmap, approved", "13": "Sprint building", "13b": "Sprint, a check did not pass", "14": "Sprints accepted", "15": "Try it", "16": "Settings", "17": "Live logs", "18": "Hand off your code", "18b": "Hand off, from GitHub", "18c": "Hand off, file too big", "18d": "Hand off, not a .zip", "18e": "Hand off, GitHub permission", "19": "Copying your code", "20": "Your requirements", "21": "Work in a repository", "21b": "Repository, app not installed", "21c": "Repository, none found", "22": "Requests", "22b": "Requests, none yet", "23": "Request, ready to merge", "23b": "Request, check failed" };
  var FIXES = {
    "01": "S1.1 the sidebar collapses. S1.2 New project stays in the bar. S1.3 the list leads with what needs you. S1.4 search sits in the title row. S1.5 no hero. S1.6 the entry points sit under the title. L-1 all three are real entries: start a new product, hand off your code, or work in a repository.",
    "02": "S3.1 no empty space around the form. S3.2 one hint sentence replaces the explainer box. S3.3 a strong Start button in the bar.",
    "03": "S2.1 the decision starts high. S2.2 Continue the interview is the thread. S2.3 engraved digits replace weak metric cards. The repo path moves under Details. T-3 the overview is a bento: the decision leads, the digits and what happens next follow in reading order.",
    "04": "Raise the budget is the one thread, in the banner and then in the bar. The digits explain the pause; units sit under Details.",
    "05b": "Empty interview: the first question is waiting, the reply box is focused and Send is the thread. Nothing is saved yet, and the strip says so.",
    "05": "S4.1 to S4.8: the chat fills the space, one scroll, questions and Submit docked at the bottom, a compact decisions panel. T-1 dictation sits beside the reply box.",
    "06": "S4.7 Create my brief is in the top bar the moment the interview ends.",
    "07": "Interview locked: a real locked state, the tape pins Build, and a way to ask for a revision.",
    "08": "S5.1 one heading, no wrapping. S5.3 status and version are clear. B3 one status vocabulary.",
    "09": "S6.1 and S5.5 Back and the breadcrumb. S6.2 Accept stays in the sticky bar. A5 contents rail. A7 wide tables scroll sideways.",
    "10": "S5.5 a locked document says why, keeps the bar, and offers a revision.",
    "11": "S7.1 the approve button is in the gate and in the top bar. S7.2 a route with Then lines replaces chips and arrows. Try Show my words.",
    "11b": "The plan is being drafted: a Working bar, skeleton sprints, and Approve shown disabled with its reason.",
    "12": "S7.2 the approved route. Nothing to decide here, so the top bar says Working.",
    "13": "Extra 2 features ready, no percentage. S8 an activity feed instead of an empty card. T-4 Demo: sprint finishes stitches the tape shut once and shows one line.",
    "13b": "Check failed: a Blocked banner with one plain sentence and one next action. The failed cell is the only red on the board.",
    "14": "Three equal buttons became one thread and quiet actions. Going live is stated honestly. T-4 accepting from Try it plays the tape milestone once.",
    "15": "S9.1 the checklist is a side panel. S9.2 the preview fills the viewport. Verdicts become the change request.",
    "16": "Disabled buttons say why, one column, the title is never cut off. The limit reads 20 million units; what units are sits under Details. T-2 one plain autonomy setting, with its consequence.",
    "17": "Each row is time, a plain sentence and the project. Event codes, ids and the level sit under Details. One scroll.",
    "18": "L-1 a lane switcher replaces the dead-end entry. L-2 upload a .zip or import from GitHub, and the copy-flow diagram follows the form. L-8 founder words only: no repository except the two safeguard sentences.",
    "18b": "L-2 the GitHub route: one connected account, four repositories to pick from, one already a Pramaan project and disabled with its reason. The diagram's first box reads GitHub.",
    "18c": "L-3 a 312 MB file: a Blocked field, one next action (choose another file) and no thread. The disabled button keeps its reason beside it.",
    "18d": "L-3 a .rar file: the same Blocked pattern, one next action and no thread.",
    "18e": "L-3 GitHub needs permission: Needs you, and the one thread is Give permission on GitHub. Create private working copy waits, quiet, with its reason.",
    "19": "L-4 the overview as a bento while the private copy is made: Working, three steps, and locked destinations that still link. Use Demo: copy finishes in this panel.",
    "20": "L-4 the copy is done: bring a requirements document or start the interview. T-1 dictation sits in the document field. Use this document joins 08; Start the interview joins 05.",
    "21": "L-5 choose a repository and read the App check result. L-8 engineering words are allowed here. The one thread is Connect repository.",
    "21b": "L-5 the GitHub App is not installed: the check is Blocked, the thread is Install the Pramaan app on GitHub, and Connect repository waits with its reason.",
    "21c": "L-5 no repositories found: a designed empty state, the search kept, and the install link as the one thread.",
    "22": "L-6 the request loop: a composer with T-1 dictation and four requests in rank order, each with a fixed pin and a four-step measure. The one that needs you owns the thread.",
    "22b": "L-6 no requests yet: the composer's send is the thread, quiet and disabled with its reason until you type (Ruling 15).",
    "23": "L-7 one request, ready to merge: what Pramaan did, what you asked for and what stays with you, with the request tape. The thread opens the pull request; Pramaan never pushes to your default branch.",
    "23b": "L-7 a check did not pass: Blocked, no thread, the tape's Review step in the Blocked colour and a fix under way."
  };

  /* Links: every screen file link becomes a jump inside this page; "#" links in the rail, tape and breadcrumb map by their label. */
  var LABEL = { "All projects": "01", Projects: "01", Overview: "03", Interview: "05", Documents: "08", Roadmap: "11", Build: "13", "Try it": "15", Settings: "16", "Live logs": "17", Requests: "22", "Hand off your code": "18", "Work in my repository": "21", "Start a new product": "02" };
  function labelOf(a) {
    var l = $(".pm-tape-label, .pm-rail-label", a) || a, c = l.cloneNode(true);
    $$(".pm-sr, svg", c).forEach(function (x) { x.remove(); });
    return c.textContent.trim();
  }
  function targetOf(a) {
    var h = a.getAttribute("href") || "", m = h.match(/^(\d\d[a-z]?)-[\w-]+\.html/);
    if (m) return m[1];
    if (h !== "#") return null;
    if (a.classList.contains("pm-wordmark")) return "01";
    if (a.classList.contains("pm-back")) { var t = (a.getAttribute("aria-label") || "").replace(/^Back to /, ""); return LABEL[t] || (t ? "03" : null); }
    if (a.closest(".pm-crumb")) return LABEL[a.textContent.trim()] || "03";
    if (a.closest(".pm-rail-nav, .pm-tape")) return LABEL[labelOf(a)] || null;
    if (a.classList.contains("pm-card--project")) return { "ui test": "06", todo: "13", "insight-weaver-537": "22" }[a.getAttribute("data-name")] || null;
    return null;
  }
  function wire(scope) {
    $$("a[href]", scope).forEach(function (a) { var t = targetOf(a); if (t) { a.setAttribute("data-goto", t); a.setAttribute("href", "#" + t); } });
  }

  /* Exactly one h1 in the document: hidden screens carry a placeholder heading that becomes the h1 when its screen opens. */
  function setH1(sec, on) {
    $$(on ? "[data-h1]" : "h1", sec).forEach(function (el) {
      var n = document.createElement(on ? "h1" : "div");
      Array.prototype.forEach.call(el.attributes, function (a) { if (["data-h1", "role", "aria-level"].indexOf(a.name) < 0) n.setAttribute(a.name, a.value); });
      if (!on) { n.setAttribute("data-h1", ""); n.setAttribute("role", "heading"); n.setAttribute("aria-level", "1"); }
      n.innerHTML = el.innerHTML;
      el.replaceWith(n);
    });
  }
  function section(n) { return $('.pm-flow-screen[data-screen="' + n + '"]'); }

  /* The journey tape is one element: its five steps are updated in place so the pin slides (240ms) between stages. */
  function paintTape(html) {
    if (html === null) { tape.hidden = true; return; }
    var t = document.createElement("template"); t.innerHTML = html;
    var next = $$("li", t.content), have = $$("li", tapeOl);
    next.forEach(function (n, i) {
      var li = have[i] || tapeOl.appendChild(document.createElement("li"));
      li.innerHTML = n.innerHTML;
      ["data-progress", "data-v", "hidden"].forEach(function (a) { if (n.hasAttribute(a)) li.setAttribute(a, n.getAttribute(a)); else li.removeAttribute(a); });
      li.setAttribute("data-state", n.getAttribute("data-state"));
    });
    have.slice(next.length).forEach(function (li) { li.remove(); });
    tape.hidden = false;
    wire(tapeOl);
  }

  /* The top-bar copy of the thread hides while the on-page decision is in view, and the other way round: always exactly one. */
  function syncThread(sec) {
    if (io) { io.disconnect(); io = null; }
    var S = $("[data-thread]", slot), T = $$("[data-thread]", sec).filter(function (t) { return !t.closest("[hidden]"); })[0];
    if (!S || !T) return;
    var box = T.closest("[data-gate], .pm-banner, .pm-actionbar--gate") || T;
    /* Same rule as components.js section 4: the on-page decision owns the thread only while it is fully in view. */
    io = new IntersectionObserver(function (es) {
      var e = es[es.length - 1], seen = e.isIntersecting && e.intersectionRatio > 0.98;
      S.hidden = seen;
      $$("[data-slot-sentence]", slot).forEach(function (x) { x.hidden = !seen; });
      if (seen) T.removeAttribute("data-offscreen"); else T.setAttribute("data-offscreen", "");
    }, { rootMargin: "-56px 0px 0px 0px", threshold: [0, 1] });
    io.observe(box);
  }

  /* Build (13) has two states in one screen: sprint in progress and sprint ready to try. */
  function setVariant(v) {
    if (cur !== "13") return;
    $$("[data-v]").forEach(function (e) { e.hidden = e.getAttribute("data-v") !== v; });
    $$("[data-variant]").forEach(function (c) { c.setAttribute("aria-checked", String(c.getAttribute("data-variant") === v)); });
    if (v === "ready") main.removeAttribute("data-thread-none"); else main.setAttribute("data-thread-none", "working");
    if (v !== "ready") $$('[data-milestone-line="sprint-ready"]').forEach(function (l) { l.hidden = true; }); /* the line shows again only when the milestone plays */
    var tryIt = $(".pm-rail-item[data-locked], .pm-rail-item[data-was-locked]");
    if (tryIt) { if (v === "ready") { tryIt.removeAttribute("data-locked"); tryIt.setAttribute("data-was-locked", ""); } else { tryIt.setAttribute("data-locked", ""); tryIt.removeAttribute("data-was-locked"); } var lock = $(".pm-rail-lock", tryIt); if (lock) lock.hidden = v === "ready"; }
    $$(".pm-tape li[data-state=current] .pm-tape-ticks i").forEach(function (t, k) { t.classList.toggle("on", v === "ready" || k === 0); });
    if (window.pmShell) window.pmShell.positionTapes();
    syncThread(section("13"));
  }

  /* Toast: role=status, six seconds, paused on hover. */
  var PIN = { done: '<span class="pm-pin-head"><svg class="pm-pin-glyph" aria-hidden="true"><use href="#pm-g-check"/></svg></span><span class="pm-pin-label">Done</span>', working: '<span class="pm-pin-head"></span><span class="pm-pin-label">Working</span>', waiting: '<span class="pm-pin-head"></span><span class="pm-pin-label">Waiting</span>' };
  function toast(kind, text) {
    var host = $("#pm-toast-host"), t = document.createElement("div"), timer;
    t.className = "pm-toast"; t.setAttribute("role", "status"); t.setAttribute("data-state", "enter");
    t.innerHTML = '<span class="pm-pin" data-status="' + kind + '">' + PIN[kind] + "</span><span></span>";
    t.lastChild.textContent = text;
    function leave() { t.setAttribute("data-state", "leave"); setTimeout(function () { t.remove(); }, 90); }
    function arm() { timer = setTimeout(leave, 6000); }
    t.addEventListener("mouseenter", function () { clearTimeout(timer); }); t.addEventListener("mouseleave", arm);
    host.appendChild(t); arm();
  }

  /* Nothing-is-lost strip: a saved reply or verdict updates "Last saved" and the History list. */
  function touchStrip(what, row) {
    if (strip.hidden) return;
    var d = new Date(), hm = ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2), iso = d.toISOString();
    var parts = stripText.innerHTML.split("&middot;"), rest = parts.length > 1 ? parts.slice(1).join("&middot;") : "";
    stripText.innerHTML = "Last saved: " + what + ', <time datetime="' + iso + '">' + hm + "</time>" + (rest ? " &middot;" + rest : "");
    var li = document.createElement("li");
    li.innerHTML = '<time datetime="' + iso + '">' + hm + "</time><span></span><a href=\"#\">Open</a>";
    li.children[1].textContent = row;
    histOl.insertBefore(li, histOl.firstChild);
    while (histOl.children.length > 8) histOl.lastChild.remove();
  }

  /* First visit to a screen: its own page script (search, save form, logs) runs once against that screen's section. */
  function scoped(sec) {
    return new Proxy(document, { get: function (t, k) {
      if (k === "querySelector") return function (s) { return sec.querySelector(s) || document.querySelector(s); };
      if (k === "querySelectorAll") return function (s) { var a = $$(s, sec); return a.length ? a : $$(s); };
      var v = t[k]; return typeof v === "function" ? v.bind(t) : v;
    } });
  }
  function firstVisit(n, sec) {
    if (n === "02") { var nm = $("#np-name", sec), idea = $("#np-idea", sec); if (nm && !nm.value) nm.value = "test"; if (idea && !idea.value) idea.value = "a tic tac toe game"; }
    BY[n].scripts.forEach(function (code) { try { new Function("document", code)(scoped(sec)); } catch (e) { if (window.console) console.warn("Flow: screen " + n + " script skipped", e); } });
  }

  function words(on) {
    if (on) main.setAttribute("data-words", "on"); else main.removeAttribute("data-words");
    $$("[data-words-toggle]").forEach(function (s) { if (s.type === "checkbox") s.checked = on; else s.setAttribute("aria-checked", String(on)); });
  }

  function setJourney(open) {
    panel.setAttribute("data-open", String(open)); toggle.setAttribute("aria-expanded", String(open)); body.hidden = !open;
  }
  function paintJourney() {
    $("#pm-demo-copy").hidden = cur !== "19"; /* the copy-finishes demo belongs to screen 19 only */
    $$(".pm-journey-list a").forEach(function (a) { if (a.getAttribute("data-goto") === cur) a.setAttribute("aria-current", "step"); else a.removeAttribute("aria-current"); });
    $("#pm-journey-count").textContent = (DATA.indexOf(BY[cur]) + 1) + " of " + DATA.length;
    note.innerHTML = "<strong></strong><span></span>";
    note.firstChild.textContent = "Step " + cur + ": " + NAME[cur]; note.lastChild.textContent = FIXES[cur];
  }

  /* Switch screens. The shell pieces are rewritten from the snapshot; the screen's section is shown. */
  function show(n) {
    var d = BY[n]; if (!d || n === cur) return;
    var prev = cur, sec = section(n);
    if (prev) { var ps = section(prev); ps.hidden = true; setH1(ps, false); $('style[data-screen="' + prev + '"]').media = "not all"; }
    cur = n; document.documentElement.setAttribute("data-flow-screen", n);
    $('style[data-screen="' + n + '"]').media = "all"; sec.hidden = false; setH1(sec, true);
    main.className = d.mainClass;
    ["data-thread-none"].forEach(function (a) { if (d.thread) main.setAttribute(a, d.thread); else main.removeAttribute(a); });
    words(d.words !== null && store.get("pm.words") !== "off");
    if (d.words === null) main.removeAttribute("data-words");
    railNav.innerHTML = d.railNav; $(".pm-rail-budget").outerHTML = d.budget; wire(railNav);
    $$(".pm-rail-item", railNav).forEach(function (a) { a.tabIndex = a.getAttribute("aria-current") === "page" ? 0 : -1; });
    $(".pm-back").outerHTML = d.back; crumb.innerHTML = d.crumb; slot.innerHTML = d.slot; wire($(".pm-topbar"));
    paintTape(d.tape);
    if (d.strip) { strip.hidden = false; stripText.innerHTML = d.strip.text; histOl.innerHTML = d.strip.history; } else strip.hidden = true;
    document.title = d.title;
    if (window.pmShell) { window.pmShell.ensurePen(); window.pmShell.setRail(window.pmShell.desiredRail()); }
    main.scrollTop = 0;
    if (!ran[n]) { ran[n] = 1; firstVisit(n, sec); }
    if (prev && !fromPanel) setJourney(false);
    fromPanel = false; paintJourney();
    $$(".pm-tape--large", sec).forEach(function () { if (window.pmShell) window.pmShell.positionTapes(); });
    requestAnimationFrame(function () {
      if (window.pmShell) window.pmShell.positionTapes();
      var th = $(".pm-chat-thread", sec); if (th) th.scrollTop = th.scrollHeight;
      var rb = $(".pm-reader-body", sec); if (rb) { rb.scrollTop = 0; rb.dispatchEvent(new Event("scroll")); }
      syncThread(sec);
    });
  }
  function go(n, o) {
    if (!BY[n]) return;
    fromPanel = !!(o && o.fromPanel); show(n); fromPanel = false;
    try { history.pushState(null, "", "#" + n); } catch (e) { location.hash = n; }
  }
  function fromHash() { var n = location.hash.slice(1); if (BY[n]) show(n); }
  window.addEventListener("popstate", fromHash); window.addEventListener("hashchange", fromHash);

  /* Milestones (SPEC P.4.4): the tape stitches shut once, only on a state change made here, never on load. */
  function milestone(kind) { if (typeof window.pmMilestone === "function") window.pmMilestone(kind); }

  /* Real transitions, keyed by screen and button label. */
  var RULES = [
    ["02", /^Start the interview/, function () { go("05b"); }],
    ["05b", /^(Submit answers|Send reply)/, function () { go("05"); touchStrip("your answers", "Saved your answers"); }],
    ["03", /^Continue the interview/, function () { go("05"); }],
    ["05", /^Submit answers/, function () { go("06"); }],
    ["06", /^Create my (product )?brief/, function () { go("09"); toast("done", "Draft 1 of your product brief is ready to read."); }],
    ["09", /^Accept this draft/, function () { go("11"); toast("done", "Draft 1 accepted. The plan opens next."); }],
    ["11", /^Approve the plan/, function () { go("12"); }],
    ["13", /^Try sprint 1/, function () { go("15"); }],
    ["15", /^Ask for changes/, function () { go("13"); setVariant("progress"); toast("working", "Your notes went to Pramaan as the next fix. Sprint 1 is being fixed."); }],
    ["15", /^Accept (anyway|sprint)/, function () { go("14"); toast("done", "Sprint 1 accepted."); milestone("all-accepted"); }],
    ["18", /^Create private working copy/, function () { go("19"); toast("working", "Copying your code."); }],
    ["18b", /^Create private working copy/, function () { go("19"); toast("working", "Copying your code."); }],
    ["20", /^Start the interview/, function () { go("05"); }],
    ["20", /^Use this document/, function () { go("08"); }],
    ["21", /^Connect repository/, function () { go("22"); }],
    ["14", /^Open your product/, function () { toast("waiting", "Opening your product is not part of this prototype. Pick another step in the Journey panel."); }]
  ];
  document.addEventListener("click", function (e) {
    var el = e.target.closest ? e.target : e.target.parentElement;
    var wt = el && el.closest("[data-words-toggle]");
    if (wt) { e.stopImmediatePropagation(); var on = main.getAttribute("data-words") !== "on"; store.set("pm.words", on ? "on" : "off"); words(on); return; }
  }, true);
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[href]");
    if (a && a.closest(".pm-rail-item[data-locked]")) { e.preventDefault(); return; }
    if (a && a.getAttribute("data-goto")) { e.preventDefault(); go(a.getAttribute("data-goto"), { fromPanel: a.getAttribute("data-from") === "panel" }); return; }
    if (a) {
      var h = a.getAttribute("href");
      if (h === "#") { e.preventDefault(); if (a.hasAttribute("data-thread")) toast("waiting", "That opens GitHub in the real product. It is not part of this prototype."); return; }
      if (h.charAt(0) === "#" && h.length > 1) { e.preventDefault(); var t = document.getElementById(decodeURIComponent(h.slice(1))); if (t) t.scrollIntoView({ block: "start" }); return; }
    }
    var b = e.target.closest("button, a.pm-btn");
    if (b && b.getAttribute("aria-disabled") !== "true") {
      var txt = (b.textContent || "").replace(/\s+/g, " ").trim();
      for (var i = 0; i < RULES.length; i++) if (RULES[i][0] === cur && RULES[i][1].test(txt)) { e.preventDefault(); RULES[i][2](); return; }
    }
    var v = e.target.closest("[data-variant]"); if (v) setVariant(v.getAttribute("data-variant"));
    var r = e.target.closest(".pm-check [role='radio']");
    if (r) { var li = r.closest(".pm-check"), k = $$(".pm-check", li.parentNode).indexOf(li) + 1, lab = r.textContent.trim(); touchStrip("your answer to check " + k, "Saved answer to check " + k + ", " + lab); }
  });
  document.addEventListener("submit", function (e) {
    var f = e.target;
    if (f.classList && f.classList.contains("pm-composer")) { var ta = $("textarea", f); if (ta && ta.value.trim()) touchStrip("your reply", "Saved your reply"); }
  }, true);

  /* Journey panel */
  toggle.addEventListener("click", function () { setJourney(panel.getAttribute("data-open") !== "true"); });
  $("#pm-demo-finish").addEventListener("click", function () { fromPanel = true; go("13"); setVariant("ready"); fromPanel = false; milestone("sprint-ready"); });
  $("#pm-demo-copy").addEventListener("click", function () { fromPanel = true; go("20"); fromPanel = false; });
  $("#pm-demo-restart").addEventListener("click", function () { fromPanel = true; go("01"); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && panel.getAttribute("data-open") === "true" && panel.contains(document.activeElement)) { setJourney(false); toggle.focus(); } });

  /* Start: the hash keeps your place on refresh. */
  DATA.forEach(function (d) { wire(section(d.n)); });
  var start = location.hash.slice(1);
  if (BY[start] && start !== "01") { cur = "01"; show(start); } else { cur = null; show("01"); }
  wire($(".pm-topbar")); wire(railNav);
})();
