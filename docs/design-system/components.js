/* Tape and Thread components.js (vanilla, load with defer). Small behaviours only; every block is guarded so pages without the component do nothing. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage blocked */ } }
  };

  /* 1. Popovers: native popover attribute; a hidden-toggle fallback when togglePopover is missing. Popovers with data-anchor="invoker" sit under the button that opened them. */
  var lastInvoker = null;
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[popovertarget]");
    if (b) lastInvoker = b;
  }, true);
  document.addEventListener("toggle", function (e) {
    var el = e.target;
    if (e.newState !== "open" || !el.matches || !el.matches("[data-anchor='invoker']") || !lastInvoker) return;
    var r = lastInvoker.getBoundingClientRect();
    el.style.position = "fixed";
    el.style.margin = "0";
    el.style.inset = "auto";
    el.style.top = Math.max(8, Math.min(r.bottom + 8, window.innerHeight - el.offsetHeight - 8)) + "px";
    el.style.left = Math.max(8, Math.min(r.left, window.innerWidth - el.offsetWidth - 8)) + "px";
  }, true);
  if (!HTMLElement.prototype.togglePopover) {
    $$("[popover]").forEach(function (p) { p.hidden = true; });
    document.addEventListener("click", function (e) {
      var b = e.target.closest("[popovertarget]");
      $$("[popover]").forEach(function (p) { if (!b || p.id !== b.getAttribute("popovertarget")) p.hidden = true; });
      if (b) { var t = document.getElementById(b.getAttribute("popovertarget")); if (t) t.hidden = !t.hidden; }
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") $$("[popover]").forEach(function (p) { p.hidden = true; }); });
  }

  /* Generic disclosure: button[data-toggle-target="id"] toggles hidden on that element and aria-expanded on itself. */
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-toggle-target]");
    if (!b) return;
    var t = document.getElementById(b.getAttribute("data-toggle-target"));
    if (!t) return;
    t.hidden = !t.hidden;
    b.setAttribute("aria-expanded", String(!t.hidden));
    var f = $("textarea", t);
    if (f && !t.hidden) f.focus();
  });

  /* 2. Decision rows: click or Enter expands, Escape cancels, Save writes the value back (in memory only). */
  $$(".pm-decisions").forEach(function (panel) {
    function close(li, save) {
      var ta = $("textarea", li), val = $(".pm-decision-value", li), tg = $(".pm-decision-toggle", li);
      if (save && ta) { val.textContent = ta.value.trim() || val.textContent; }
      li.dataset.open = "false";
      $(".pm-decision-editor", li).hidden = true;
      tg.setAttribute("aria-expanded", "false");
      tg.focus();
    }
    function open(li) {
      $$(".pm-decision[data-open='true']", panel).forEach(function (o) { if (o !== li) close(o, false); });
      var ta = $("textarea", li), val = $(".pm-decision-value", li);
      ta.value = val.textContent;
      li.dataset.open = "true";
      $(".pm-decision-editor", li).hidden = false;
      $(".pm-decision-toggle", li).setAttribute("aria-expanded", "true");
      ta.focus();
      ta.setSelectionRange(ta.value.length, ta.value.length);
    }
    panel.addEventListener("click", function (e) {
      if (panel.dataset.state === "locked") return;
      var li = e.target.closest(".pm-decision");
      if (!li) return;
      if (e.target.closest(".pm-decision-toggle")) { if (li.dataset.open === "true") close(li, false); else open(li); }
      else if (e.target.closest("[data-decision-save]")) close(li, true);
      else if (e.target.closest("[data-decision-cancel]")) close(li, false);
    });
    panel.addEventListener("keydown", function (e) {
      var li = e.target.closest(".pm-decision");
      if (e.key === "Escape" && li && li.dataset.open === "true") { e.preventDefault(); close(li, false); }
    });
  });

  /* 3. Verdict toggles: radiogroup keyboard (arrows, and 1/2/3), note reveal, count, footer thread label and disabled reason. */
  $$(".pm-checklist").forEach(function (panel) {
    var items = $$(".pm-check", panel);
    var thread = $("[data-check-thread]", panel), reason = $("[data-check-reason]", panel), anyway = $("[data-check-anyway]", panel), note = $("[data-check-sentence]", panel);
    var count = $(".pm-checklist-count", panel), fill = $(".pm-progress-fill", panel);
    /* The accept label names the sprint: button[data-accept-label="Accept sprint 2"]; default "Accept sprint 1". */
    var acceptLabel = (thread && thread.getAttribute("data-accept-label")) || "Accept sprint 1";
    function setThread(label, enabled, why) {
      if (thread) { thread.textContent = label; thread.setAttribute("aria-disabled", enabled ? "false" : "true"); }
      if (reason) { reason.textContent = why || ""; reason.hidden = !why; }
    }
    function sync() {
      var answered = 0, bad = 0;
      items.forEach(function (li) {
        var v = li.dataset.verdict || "";
        if (v) answered++;
        if (v === "not-quite" || v === "confusing") bad++;
        var n = $(".pm-verdict-note", li);
        if (n) n.hidden = !(v === "not-quite" || v === "confusing");
        $$("[role='radio']", li).forEach(function (r, i) {
          var on = r.dataset.value === v;
          r.setAttribute("aria-checked", String(on));
          r.tabIndex = on || (!v && i === 0) ? 0 : -1;
        });
      });
      if (count) count.textContent = answered + " of " + items.length + " answered";
      if (fill) fill.style.setProperty("--pm-progress", (items.length ? (answered / items.length) * 100 : 0) + "%");
      if (bad) { setThread("Ask for changes (" + bad + ")", true, ""); }
      else if (answered === items.length) { setThread(acceptLabel, true, ""); }
      else { setThread(acceptLabel, false, "Answer all " + items.length + " to accept."); }
      if (anyway) anyway.hidden = !bad;
      if (note) note.hidden = !bad;
    }
    function choose(li, radio) { li.dataset.verdict = radio.dataset.value; sync(); radio.focus(); }
    panel.addEventListener("click", function (e) {
      var r = e.target.closest("[role='radio']");
      if (r) choose(r.closest(".pm-check"), r);
    });
    panel.addEventListener("keydown", function (e) {
      var r = e.target.closest("[role='radio']");
      if (!r) return;
      var li = r.closest(".pm-check"), rs = $$("[role='radio']", li), i = rs.indexOf(r), next = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next = rs[(i + 1) % rs.length];
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = rs[(i - 1 + rs.length) % rs.length];
      else if (/^[1-3]$/.test(e.key) && rs[+e.key - 1]) next = rs[+e.key - 1];
      if (next) { e.preventDefault(); choose(li, next); }
    });
    sync();
  });

  /* 4. Gates (Law 1, D.14): an on-page decision marked [data-gate] (the roadmap gate bar, an overview banner, a done banner)
     owns the thread while it is fully in view under the top bar. Then the slot shows its [data-slot-sentence] parts and its
     own [data-thread] copy stays hidden; once the gate is even partly under the bar, the slot copy shows, the sentence hides and
     the gate's thread is hidden (data-offscreen). flow.html runs the same rule per screen in flow.js, so it is skipped there. */
  var slotCopy = $(".pm-slot [data-thread]");
  if (slotCopy && !document.getElementById("pm-flow-data") && "IntersectionObserver" in window) {
    var slotSentences = $$(".pm-slot [data-slot-sentence]");
    $$("[data-gate]").forEach(function (gate) {
      var own = gate.matches("[data-thread]") ? gate : $("[data-thread]", gate);
      if (!own) return;
      new IntersectionObserver(function (entries) {
        var e = entries[entries.length - 1], seen = e.isIntersecting && e.intersectionRatio > 0.98;
        slotCopy.hidden = seen;
        slotSentences.forEach(function (s) { s.hidden = !seen; });
        if (seen) own.removeAttribute("data-offscreen"); else own.setAttribute("data-offscreen", "");
      }, { rootMargin: "-56px 0px 0px 0px", threshold: [0, 1] }).observe(gate);
    });
  }

  /* 5. "Show my words": data-words="on" on <main>, persisted in localStorage["pm.words"]. */
  var wordsSwitch = $("[data-words-toggle]");
  if (wordsSwitch) {
    var main = $("main") || document.body;
    var stored = store.get("pm.words");
    if (stored === "on") main.setAttribute("data-words", "on");
    else if (stored === "off") main.removeAttribute("data-words");
    var paint = function () {
      var on = main.getAttribute("data-words") === "on";
      if (wordsSwitch.type === "checkbox") wordsSwitch.checked = on; else wordsSwitch.setAttribute("aria-checked", String(on));
    };
    wordsSwitch.addEventListener("click", function () {
      var on = main.getAttribute("data-words") !== "on";
      if (on) main.setAttribute("data-words", "on"); else main.removeAttribute("data-words");
      store.set("pm.words", on ? "on" : "off");
      paint();
    });
    paint();
  }

  /* 6. Chat: Ctrl+Enter submits, textarea auto-grows, "New reply below" pill. */
  $$(".pm-chat").forEach(function (chat) {
    var thread = $(".pm-chat-thread", chat), flow = $(".pm-chat-flow", chat), pill = $(".pm-newreply", chat);
    if (!thread || !flow) return;
    var form = $(".pm-composer", chat), ta = $(".pm-composer-input", chat);
    var nearBottom = function () { return thread.scrollHeight - thread.scrollTop - thread.clientHeight < 120; };
    function grow() {
      if (!ta) return;
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + (ta.offsetHeight - ta.clientHeight) + "px";
    }
    function append(who, text, you) {
      var m = document.createElement("div");
      m.className = "pm-msg" + (you ? " pm-msg--you" : "");
      m.innerHTML = '<div class="pm-msg-head"><span class="pm-msg-who"></span><span class="pm-msg-time">now</span></div><div class="pm-msg-body"><p></p></div>';
      $(".pm-msg-who", m).textContent = who;
      $("p", m).textContent = text;
      var stay = nearBottom();
      var anchor = $(".pm-qcard", flow) || $(".pm-msg-stream", flow);
      flow.insertBefore(m, you || !anchor ? null : anchor);
      if (stay || you) thread.scrollTop = thread.scrollHeight; else if (pill) pill.hidden = false;
    }
    if (ta) {
      ta.addEventListener("input", grow);
      ta.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey) && form) { e.preventDefault(); if (form.requestSubmit) form.requestSubmit(); }
      });
      grow();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(grow);
    }
    if (form) form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (ta && ta.value.trim()) { append("You", ta.value.trim(), true); ta.value = ""; grow(); }
    });
    /* Demo hook: button[data-append-reply="<chat id>"] (or inside the chat) appends a Pramaan message. */
    $$("[data-append-reply]").forEach(function (b) {
      var target = b.getAttribute("data-append-reply") ? document.getElementById(b.getAttribute("data-append-reply")) : b.closest(".pm-chat");
      if (target === chat) b.addEventListener("click", function () { append("Pramaan", "Thanks. I have saved that. Anything else you want in the first version?", false); });
    });
    if (pill) {
      pill.addEventListener("click", function () { thread.scrollTop = thread.scrollHeight; pill.hidden = true; });
      thread.addEventListener("scroll", function () { if (nearBottom()) pill.hidden = true; });
    }
    /* The thread rests at its newest item, so an open question card and its Submit (the thread) are in view on load. */
    var toEnd = function () { thread.scrollTop = thread.scrollHeight; };
    toEnd();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(toEnd);
  });

  /* 7. Reader: scroll-spy for the contents rail, selection-triggered "Comment on this passage", copy buttons.
     A contents link (or a page hash) that points into a closed details ("Advanced sections", the byline Details) opens it and
     every details around it first, so the browser can then scroll to the heading. */
  var openFor = function (id) {
    var t = id && document.getElementById(id), d = t && t.closest("details");
    while (d) { d.open = true; d = d.parentElement && d.parentElement.closest("details"); }
  };
  document.addEventListener("click", function (e) { var a = e.target.closest && e.target.closest(".pm-toc a[href^='#']"); if (a) openFor(decodeURIComponent(a.getAttribute("href").slice(1))); });
  window.addEventListener("hashchange", function () { openFor(decodeURIComponent(location.hash.slice(1))); });
  if (location.hash.length > 1) openFor(decodeURIComponent(location.hash.slice(1)));
  $$(".pm-reader").forEach(function (reader) {
    /* Only the section list takes aria-current; "Passage comments", its list (ol.pm-toc-comments) and "Details" below it are plain jump links. */
    var body = $(".pm-reader-body", reader), links = $$(".pm-toc ol:not(.pm-toc-comments) a[href^='#']", reader);
    if (body && links.length) {
      /* Measure the sections, not the headings (a stuck sticky heading always looks visible). Current = the last section whose top has passed 140px below the scroller's top; the first at the very top, the last at the very end (a short last section never reaches the band).
         Sections are .pm-reader-sec, the "Advanced sections" group (details.pm-reader-adv, id on itself) and its nested .pm-reader-sub, in document order,
         and only those with a contents link. A section inside a closed details (or with no height) is skipped, so a hidden section is never marked current. */
      var idOf = function (s) { var h = s.querySelector(":scope > h2[id]"); return h ? h.id : s.id; };
      var linked = function (id) { return links.some(function (a) { return a.getAttribute("href") === "#" + id; }); };
      var secs = $$(".pm-reader-sec, .pm-reader-sub, .pm-reader-adv[id]", body).filter(function (s) { var id = idOf(s); return id && linked(id); });
      var mark = function (id) { links.forEach(function (a) { if (a.getAttribute("href") === "#" + id) a.setAttribute("aria-current", "location"); else a.removeAttribute("aria-current"); }); };
      var queued = false, pinnedUntil = 0;
      /* A clicked contents link stays current even when the document cannot scroll that section to the top. */
      links.forEach(function (a) { a.addEventListener("click", function () { mark(a.getAttribute("href").slice(1)); pinnedUntil = Date.now() + 250; }); });
      var spy = function () {
        queued = false;
        if (Date.now() < pinnedUntil) return;
        /* Chrome lays out a closed details' content on demand (content-visibility), so a rect alone is not enough: also skip anything inside a closed details. */
        var shown = secs.filter(function (s) { return !(s.parentElement && s.parentElement.closest("details:not([open])")) && s.getBoundingClientRect().height > 0; });
        if (!shown.length) return;
        var cur = shown[0], line = body.getBoundingClientRect().top + 140;
        /* "At the very end" only counts once the reader has scrolled: a document that fits without scrolling marks its first section. */
        if (body.scrollTop > 0 && body.scrollTop + body.clientHeight >= body.scrollHeight - 2) cur = shown[shown.length - 1];
        else shown.forEach(function (s) { if (s.getBoundingClientRect().top <= line) cur = s; });
        mark(idOf(cur));
      };
      var queue = function () { if (!queued) { queued = true; requestAnimationFrame(spy); } };
      body.addEventListener("scroll", queue, { passive: true });
      /* Opening or closing a group changes which sections have height. */
      body.addEventListener("toggle", queue, true);
      spy();
    }
    /* The fixed "Comment on this passage" button is any .pm-comment-cta (not --static) inside the reader or its parent. */
    var cta = $(".pm-comment-cta:not(.pm-comment-cta--static)", reader.parentNode), article = $(".pm-article", reader), quote = "";
    if (cta && article && !cta.dataset.bound) {
      cta.dataset.bound = "1";
      var hide = function () { cta.hidden = true; };
      var show = function () {
        var s = window.getSelection();
        if (!s || s.isCollapsed || !article.contains(s.anchorNode) || s.toString().trim().length < 3) return hide();
        var r = s.getRangeAt(0).getBoundingClientRect();
        quote = s.toString().trim();
        cta.hidden = false;
        cta.style.top = Math.min(r.bottom + 8, window.innerHeight - cta.offsetHeight - 8) + "px";
        cta.style.left = Math.max(8, Math.min(r.right - cta.offsetWidth, window.innerWidth - cta.offsetWidth - 8)) + "px";
      };
      article.addEventListener("mouseup", function () { setTimeout(show, 0); });
      article.addEventListener("keyup", function (e) { if (e.shiftKey) show(); });
      body.addEventListener("scroll", hide);
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") hide(); });
      document.addEventListener("mousedown", function (e) { if (!cta.contains(e.target)) hide(); });
      cta.addEventListener("click", function () {
        var q = $("[data-comment-quote]");
        if (q) q.textContent = quote;
      });
    }
  });
  /* Generalised spy (pass 2): any [data-spy] container with links href="#id" marks aria-current="location" on the link whose
     .pm-route-node[id] (or any element with that id) is current in the page scroller; hidden targets are skipped as in the reader. */
  $$("[data-spy]").forEach(function (box) {
    var links = $$("a[href^='#']", box).filter(function (a) { return a.getAttribute("href").length > 1; });
    var pairs = links.map(function (a) { return { a: a, id: decodeURIComponent(a.getAttribute("href").slice(1)) }; });
    if (!pairs.length) return;
    var queued = false, pinnedUntil = 0, m = $("main");
    var mark = function (cur) { pairs.forEach(function (p) { if (p === cur) p.a.setAttribute("aria-current", "location"); else p.a.removeAttribute("aria-current"); }); };
    var spy = function () {
      queued = false;
      if (Date.now() < pinnedUntil) return;
      var shown = pairs.filter(function (p) {
        var t = document.getElementById(p.id);
        return t && !t.closest("details:not([open])") && t.getBoundingClientRect().height > 0 && (p.t = t);
      });
      if (!shown.length) return;
      var own = m && m.scrollHeight > m.clientHeight + 1, top = own ? m.getBoundingClientRect().top : 0, cur = shown[0];
      var st = own ? m.scrollTop : window.scrollY, vh = own ? m.clientHeight : window.innerHeight, sh = own ? m.scrollHeight : document.documentElement.scrollHeight;
      if (st > 0 && st + vh >= sh - 2) cur = shown[shown.length - 1];
      else shown.forEach(function (p) { if (p.t.getBoundingClientRect().top <= top + 140) cur = p; });
      mark(cur);
    };
    var queue = function () { if (!queued) { queued = true; requestAnimationFrame(spy); } };
    pairs.forEach(function (p) { p.a.addEventListener("click", function () { mark(p); pinnedUntil = Date.now() + 250; }); });
    document.addEventListener("scroll", queue, { capture: true, passive: true });
    window.addEventListener("resize", queue);
    spy();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(spy);
  });
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-copy]");
    if (!b) return;
    var text = b.getAttribute("data-copy");
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).catch(function () { /* clipboard blocked */ });
    if (b.dataset.copied) return;
    var label = b.getAttribute("aria-label");
    b.dataset.copied = "true";
    b.setAttribute("aria-label", "Copied");
    setTimeout(function () { delete b.dataset.copied; if (label === null) b.removeAttribute("aria-label"); else b.setAttribute("aria-label", label); }, 2000);
  });

  /* 8. Log viewer: Pause and Resume freeze auto-scroll and show the paused banner (the demo add-line button only increments). */
  $$(".pm-log").forEach(function (log) {
    var btn = $("[data-log-pause]", log), list = $(".pm-log-list", log), n = $("[data-log-new]", log), added = 0;
    var count = $(".pm-log-count", log);
    var paused = function () { return log.getAttribute("data-paused") === "true"; };
    if (btn) btn.addEventListener("click", function () {
      var p = !paused();
      log.setAttribute("data-paused", String(p));
      btn.textContent = p ? "Resume" : "Pause";
      btn.setAttribute("aria-pressed", String(p));
      /* The count sentence says what the list is doing: "Live · 69 lines" while it follows, "Paused · 69 lines" while paused (RV8, 17). */
      if (count) count.textContent = count.textContent.replace(/^\s*(Live|Paused)\b/, p ? "Paused" : "Live");
      if (!p) { added = 0; if (list) list.scrollTop = list.scrollHeight; }
      if (n) n.textContent = added;
    });
    var res = $("[data-log-resume]", log);
    if (res && btn) res.addEventListener("click", function () { btn.click(); });
    $$("[data-log-add]", log).forEach(function (b) {
      b.addEventListener("click", function () {
        if (paused()) { added++; if (n) n.textContent = added; return; }
        var last = $$(".pm-log-entry", log).pop();
        if (last && list) { list.appendChild(last.cloneNode(true)); list.scrollTop = list.scrollHeight; }
        if (count) { var m = count.textContent.match(/(\d+) lines/); if (m) count.textContent = count.textContent.replace(m[0], (+m[1] + 1) + " lines"); }
      });
    });
  });

  /* Shared helpers for sections 9 to 12 (pass 2). */
  var pinLine = function (el, text, done) { /* a Blocked (or Done) pin then the sentence, built with text nodes only */
    var pin = document.createElement("span"), s = document.createElement("span");
    pin.className = "pm-pin"; pin.setAttribute("data-status", done ? "done" : "blocked");
    pin.innerHTML = '<span class="pm-pin-head"></span><span class="pm-pin-label">' + (done ? "Done" : "Blocked") + "</span>";
    s.className = "pm-pin-sentence"; s.textContent = " " + text;
    el.textContent = ""; el.appendChild(pin); el.appendChild(s);
  };
  var setEnabled = function (btn, on, why, scope) { /* aria-disabled button with its reason in place (D.1); the reason is created when missing */
    var id = btn.getAttribute("aria-describedby") || btn.dataset.reasonId, r = id && document.getElementById(id);
    if (!r || !r.classList.contains("pm-btn-reason")) r = $(".pm-btn-reason", scope || btn.parentNode);
    if (!r && !on) { r = document.createElement("span"); r.className = "pm-btn-reason"; r.id = "pm-reason-" + Math.random().toString(36).slice(2, 7); btn.parentNode.insertBefore(r, btn); }
    if (on) btn.removeAttribute("aria-disabled"); else btn.setAttribute("aria-disabled", "true");
    if (!r) return;
    btn.dataset.reasonId = r.id;
    if (on) btn.removeAttribute("aria-describedby"); else btn.setAttribute("aria-describedby", r.id);
    r.hidden = on;
    if (why) r.textContent = why;
  };
  var mainEl = $("main") || document.body;
  /* Ruling 15: a thread on a form is enabled or absent. Enabled: filled, data-thread, main loses data-thread-none. Not yet: quiet,
     aria-disabled with its reason, no data-thread, main[data-thread-none="blocked"]. A .pm-btn--thread-demo sample swaps its look only. */
  var threadSwap = function (b, ok, why, scope) {
    var fill = b.dataset.fill || (b.dataset.fill = b.classList.contains("pm-btn--thread-demo") ? "pm-btn--thread-demo" : "pm-btn--thread");
    setEnabled(b, ok, why, scope);
    b.classList.toggle(fill, ok); b.classList.toggle("pm-btn--quiet", !ok);
    if (fill === "pm-btn--thread-demo") return;
    if (ok) { b.setAttribute("data-thread", ""); mainEl.removeAttribute("data-thread-none"); }
    else { b.removeAttribute("data-thread"); mainEl.setAttribute("data-thread-none", "blocked"); }
  };

  /* 9. Dictation: [data-dictate="#textarea-id"] button. Nothing is sent by voice: no auto-send, no auto-submit on silence. */
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var DICT = { off: "Dictation is not available in this browser. Typing works the same.", done: "Added to your reply. Check it, then send.", other: "Dictation stopped. Try again, or type.",
    on: "Listening. Press the button again to stop. Nothing is sent until you press Send.",
    quiet: "Nothing was heard. Try again, or type.", denied: "The microphone is blocked. Allow it in your browser, or type.",
    fieldOn: "Listening. Press the button again to stop.", fieldDone: "Added to the document." };
  $$("[data-dictate]").forEach(function (btn, n) {
    var ta = document.getElementById((btn.getAttribute("data-dictate") || "").replace(/^#/, ""));
    /* The status line is the nearest [data-dictate-status] around the button (its composer, request composer or field). */
    var st = null;
    for (var up = btn.parentElement; up && !st && up !== document.body; up = up.parentElement) st = $("[data-dictate-status]", up);
    if (!ta) return;
    if (st && st.dataset.hint == null) st.dataset.hint = st.textContent;
    if (st && !st.hasAttribute("aria-live")) st.setAttribute("aria-live", "polite");
    /* Field variant (a textarea with no send, screen 20: .pm-composer-row--nosend): its own label and sentences (SPEC P.4.1). */
    var field = !!btn.closest(".pm-composer-row--nosend");
    if (field && (!btn.getAttribute("aria-label") || btn.getAttribute("aria-label") === "Dictate your reply")) btn.setAttribute("aria-label", "Dictate the document");
    var M = field ? { on: DICT.fieldOn, done: DICT.fieldDone } : { on: DICT.on, done: DICT.done };
    var use = $("use", btn), label = btn.getAttribute("aria-label") || "Dictate your reply";
    btn.dataset.state = "idle";
    if (!SR) {
      btn.setAttribute("aria-disabled", "true");
      btn.dataset.state = "unavailable";
      if (st) { if (!st.id) st.id = "pm-dictate-st-" + n; btn.setAttribute("aria-describedby", st.id); st.textContent = DICT.off; }
      return;
    }
    var rec = null, on = false, heard = false, failed = false, timer = 0, head = "", tail = "", skip = 0, writing = false;
    var say = function (text, blocked, ms) {
      clearTimeout(timer);
      if (!st) return;
      if (blocked) pinLine(st, text); else st.textContent = text;
      if (ms) timer = setTimeout(function () { st.textContent = st.dataset.hint || ""; }, ms);
    };
    var paint = function (listening) {
      on = listening;
      btn.setAttribute("aria-pressed", String(listening));
      btn.dataset.state = listening ? "listening" : "idle";
      btn.setAttribute("aria-label", listening ? "Stop dictating" : label);
      if (listening) btn.setAttribute("data-live", "true"); else btn.removeAttribute("data-live");
      if (use) { use.setAttribute("href", listening ? "#pm-i-stop" : "#pm-i-mic"); use.removeAttribute("xlink:href"); }
    };
    var rebase = function () { var c = ta.selectionStart == null ? ta.value.length : ta.selectionStart; head = ta.value.slice(0, c); tail = ta.value.slice(c); };
    var render = function (e) {
      var said = "";
      for (var i = skip; i < e.results.length; i++) { var t = e.results[i][0].transcript; said += (said && !/\s$/.test(said) && !/^\s/.test(t) ? " " : "") + t; }
      if (!said.trim()) return; /* finals and the one interim span are rebuilt every time, so an interim is always replaced */
      heard = true;
      var sp = head && !/\s$/.test(head) && !/^\s/.test(said) ? " " : "";
      var caret = head.length + sp.length + said.length;
      writing = true;
      ta.value = head + sp + said + tail;
      try { ta.setSelectionRange(caret, caret); } catch (x) { /* not selectable */ }
      ta.dispatchEvent(new Event("input", { bubbles: true }));
      writing = false; rec.seen = e.results.length;
    };
    var finish = function () { /* back to idle; the done sentence only when words were added */
      if (!on) return;
      paint(false);
      if (failed) return;
      if (heard) say(M.done, false, 4000); else say(st ? st.dataset.hint || "" : "", false, 0);
    };
    var cancel = function () { var r = rec; rec = null; if (r) { try { r.abort(); } catch (x) { /* already stopped */ } } if (on) { paint(false); say(st ? st.dataset.hint || "" : "", false, 0); } };
    var start = function () {
      var r = new SR();
      r.continuous = true; r.interimResults = true; r.lang = document.documentElement.lang || "en";
      heard = false; failed = false; skip = 0; r.seen = 0;
      if (document.activeElement === ta) rebase(); else { head = ta.value; tail = ""; }
      r.onresult = function (e) { if (r === rec) render(e); };
      r.onerror = function (e) {
        if (r !== rec) return;
        failed = true;
        paint(false);
        var k = e && e.error;
        say(k === "no-speech" ? DICT.quiet : k === "not-allowed" || k === "service-not-allowed" ? DICT.denied : DICT.other, true, 6000);
      };
      r.onend = function () { if (r === rec) { finish(); rec = null; } };
      rec = r;
      try { r.start(); } catch (x) { rec = null; failed = true; say(DICT.other, true, 6000); return; }
      paint(true);
      say(M.on, false, 0);
      ta.focus({ preventScroll: true });
    };
    btn.addEventListener("click", function () {
      if (btn.getAttribute("aria-disabled") === "true") return;
      if (on) { if (rec) { try { rec.stop(); } catch (x) { /* already stopped */ } } finish(); ta.focus({ preventScroll: true }); } else start();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && on) { if (rec) { try { rec.stop(); } catch (x) { /* already stopped */ } } finish(); } });
    /* Typing while listening moves the insertion point; sending clears the field, so listening ends without adding anything. */
    ta.addEventListener("input", function () { if (on && !writing) { rebase(); skip = rec ? rec.seen : 0; } });
    var form = ta.closest("form");
    if (form) form.addEventListener("submit", cancel);
  });

  /* 10. File field, source radios, copy flow and the enabling of "Use this document". Validation follows the input's accept list
     (default .zip) and data-max-mb (default 200); the sentences are SPEC E, "Pass 2: 18c" and "18d". */
  var fmtSize = function (b) { return b < 1048576 ? Math.max(1, Math.round(b / 1024)) + " KB" : Math.round(b / 1048576) + " MB"; };
  var THREAD_REASON = { type: "Choose a .zip file first.", size: "Choose a file under 200 MB first.", none: "Choose a file first.", empty: "Choose a file first.", repo: "Pick the code to bring first." };
  var FILE_MSG = { type: "This is not a .zip file. Zip the folder and choose the .zip.", size: "This file is larger than 200 MB. Choose a smaller .zip, or leave out big folders such as media." };
  var DOC_MSG = { type: "Choose a Markdown or text file under 1 MB.", size: "Choose a Markdown or text file under 1 MB.", empty: "This document is empty." };
  var refreshEnable = function () {
    $$("[data-enable-when='text']").forEach(function (b) {
      var ta = document.getElementById(b.getAttribute("data-for") || ""), fi = $$(".pm-file input[type=file]").some(function (i) { return i.dataset.valid === "true"; });
      setEnabled(b, !!(ta && ta.value.trim()) || fi, "Add a document first.");
    });
  };
  /* The slot sentence is short (at most 16 characters, one line); the button's reason beside it stays the full sentence and is
     also the slot sentence's title, so the two never repeat each other (RV9). CSS clamps [data-slot-why] to one line. */
  var SLOT_WHY = { type: "Not a .zip.", size: "File too big.", none: "No file yet.", empty: "File is empty.", repo: "No code chosen." };
  var slotWhy = function (el, problem) { el.textContent = SLOT_WHY[problem || "none"]; el.title = THREAD_REASON[problem || "none"]; };
  var setThreadWhen = function (ok, problem) {
    var bs = $$("[data-thread-when='file']");
    bs.forEach(function (b) { threadSwap(b, ok, THREAD_REASON[problem || "none"]); });
    if (!bs.length) return;
    /* The slot follows (18 family): [data-show-when="ready"] parts show with the thread, [data-show-when="blocked"] parts without it; [data-slot-why] names the problem. */
    $$(".pm-slot [data-show-when]").forEach(function (el) { el.hidden = (el.getAttribute("data-show-when") === "ready") !== ok; });
    if (!ok) $$(".pm-slot [data-slot-why]").forEach(function (el) { slotWhy(el, problem); });
  };
  /* A page that loads blocked (18c, 18d, 18e) gets the same short sentence: the problem comes from the chosen file's
     data-problem, or "repo" when the GitHub source is checked, or "none"; a sentence with no known problem keeps its text and gains a title. */
  if (mainEl.getAttribute("data-thread-none") === "blocked") $$(".pm-slot [data-slot-why]").forEach(function (el) {
    if (el.closest("[hidden]") || !el.textContent.trim()) return;
    var fi = $(".pm-file input[type=file][data-problem]"), gh = $("input[name='source'][value='github']:checked");
    var p = gh ? "repo" : fi && fi.getAttribute("data-problem");
    if (p && SLOT_WHY[p]) slotWhy(el, p); else if (!el.title) el.title = el.textContent.trim();
  });
  $$(".pm-file input[type=file]").forEach(function (input) {
    var box = input.closest(".pm-file"), field = input.closest(".pm-field") || box.parentNode;
    var name = $("[data-file-name]", box), help = $(".pm-help", field), btn = $("label[for='" + input.id + "']", field);
    var exts = (input.getAttribute("accept") || ".zip").toLowerCase().split(",").map(function (s) { return s.trim(); }).filter(Boolean);
    var isZip = exts.length === 1 && exts[0] === ".zip", maxBytes = (+input.getAttribute("data-max-mb") || 200) * 1048576;
    if (help && help.dataset.help == null) help.dataset.help = help.textContent;
    if (btn && btn.dataset.label == null) btn.dataset.label = btn.textContent;
    input.addEventListener("change", function () {
      var f = input.files && input.files[0];
      if (!f) return;
      var text = f.name + " · " + fmtSize(f.size), problem = "";
      if (!exts.some(function (x) { return f.name.toLowerCase().slice(-x.length) === x; })) problem = "type";
      else if (f.size > maxBytes) problem = "size";
      else if (!isZip && !f.size) problem = "empty";
      if (name) name.textContent = text;
      /* Only the code field (accept=".zip") writes into the copy flow; a requirements file on 20 never touches box 1. */
      if (isZip) {
        $$("[data-flow-source-value]").forEach(function (v) { v.textContent = text; v.setAttribute("data-upload", text); });
        $$("[data-flow-source-chip]").forEach(function (c) {
          c.textContent = problem === "type" ? "Not a .zip" : problem === "size" ? "Too big" : "Read once · never changed";
          c.setAttribute("data-upload", c.textContent);
          if (problem) { c.setAttribute("data-status", "blocked"); c.setAttribute("data-upload-status", "blocked"); } else { c.removeAttribute("data-status"); c.removeAttribute("data-upload-status"); }
        });
      }
      box.classList.toggle("pm-file--error", !!problem);
      if (problem) input.setAttribute("aria-invalid", "true"); else input.removeAttribute("aria-invalid");
      if (help) {
        if (problem) pinLine(help, isZip ? FILE_MSG[problem] : input.getAttribute("data-msg-" + problem) || DOC_MSG[problem]);
        else help.textContent = help.dataset.help;
      }
      if (btn) btn.textContent = problem ? "Choose another file" : btn.dataset.label;
      input.dataset.valid = problem ? "false" : "true";
      input.dataset.problem = problem;
      setThreadWhen(!problem, problem);
      refreshEnable();
    });
  });
  $$("[data-enable-when='text']").forEach(function (b) { var ta = document.getElementById(b.getAttribute("data-for") || ""); if (ta) ta.addEventListener("input", refreshEnable); });
  /* flowTexts: at load every copy-flow box keeps both sides' text, whichever side the page starts on (18 starts on the upload,
     18b and 18e on GitHub): data-upload / data-github-value / data-github-chip, and data-upload-status / data-github-status for
     the chip tint. Pre-set attributes win; a missing side falls back to the chosen file or repository, or the SPEC E default. */
  (function flowTexts() {
    var src = $("input[name='source']:checked");
    if (!src) return;
    var ghNow = src.value === "github";
    var fn = $("[data-file-name]"), row = $("[data-source='github'] input[type='radio']:checked:not(:disabled)");
    var rowName = row && row.closest("label") && $(".pm-choice-name", row.closest("label"));
    $$("[data-flow-source-value], [data-flow-source-chip]").forEach(function (el) {
      var isVal = el.hasAttribute("data-flow-source-value"), ghAttr = isVal ? "data-github-value" : "data-github-chip", now = el.textContent;
      if (ghNow) { if (!el.hasAttribute(ghAttr)) el.setAttribute(ghAttr, now); }
      else if (!el.hasAttribute("data-upload")) el.setAttribute("data-upload", now);
      if (!el.hasAttribute("data-upload")) el.setAttribute("data-upload", isVal ? (fn && fn.textContent.trim()) || "No file chosen yet" : "Read once · never changed");
      if (!el.hasAttribute(ghAttr)) el.setAttribute(ghAttr, isVal ? (rowName && rowName.textContent.trim()) || "Not connected yet" : "Read only · unchanged");
      var st = el.getAttribute("data-status");
      if (st && !el.hasAttribute(ghNow ? "data-github-status" : "data-upload-status")) el.setAttribute(ghNow ? "data-github-status" : "data-upload-status", st);
    });
  })();
  $$("input[name='source']").forEach(function (r) {
    r.addEventListener("change", function () {
      if (!r.checked) return;
      var gh = r.value === "github";
      $$("[data-source]").forEach(function (el) { el.hidden = el.getAttribute("data-source") !== r.value; });
      $$("[data-flow-source-label]").forEach(function (el) { el.textContent = gh ? "GitHub" : "Your upload"; });
      /* Each box keeps both texts (captured at load by flowTexts) and writes the chosen side's; the chip's status tint too. */
      $$("[data-flow-source-value], [data-flow-source-chip]").forEach(function (el) {
        var side = gh ? "github" : "upload", text = el.getAttribute("data-" + side + (side === "github" ? (el.hasAttribute("data-flow-source-value") ? "-value" : "-chip") : ""));
        if (text != null) el.textContent = text;
        var st = el.getAttribute("data-" + side + "-status");
        if (st) el.setAttribute("data-status", st); else if (el.hasAttribute("data-flow-source-chip")) el.removeAttribute("data-status");
      });
      /* The thread follows the chosen source: GitHub needs a chosen, enabled row; the upload needs a valid file (the static chosen file counts). */
      if (!$("[data-thread-when='file']")) return;
      if (gh) setThreadWhen(!!$("[data-source='github'] input[type='radio']:checked:not(:disabled)"), "repo");
      else {
        var fi = $("[data-source='upload'] .pm-file input[type=file]") || $(".pm-file input[type=file]"), fn = fi && $("[data-file-name]", fi.closest(".pm-file"));
        setThreadWhen(!!fi && fi.dataset.valid !== "false" && !!(fn && fn.textContent.trim()), fi && fi.dataset.problem);
      }
    });
  });
  refreshEnable();

  /* 11. Milestone: pmMilestone(kind) sets data-milestone on the visible tape for 700ms (never on load, never under reduced motion)
     and reveals the first [data-milestone-line]. Buttons [data-milestone-trigger="<kind>"] call it once per click. */
  var msTimer = 0;
  window.pmMilestone = function (kind) {
    var tapes = $$(".pm-tape"), tape = tapes.filter(function (t) { return t.getClientRects().length > 0 && !t.closest("[hidden]"); })[0] || tapes[0];
    if (tape && !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
      clearTimeout(msTimer);
      tape.removeAttribute("data-milestone");
      void tape.offsetWidth; /* restart the sequence when it is played again */
      tape.setAttribute("data-milestone", kind);
      msTimer = setTimeout(function () { tape.removeAttribute("data-milestone"); }, 700);
    }
    /* The line of this kind only (a line of another kind is never revealed); a line with an empty value answers any kind.
       13: p.pm-milestone-line[data-milestone-line="sprint-ready"], hidden until now. 14: the banner title carries
       data-milestone-line="all-accepted" and is already shown (the static end state); a call from the flow replays its fade. */
    var line = $$("[data-milestone-line]").filter(function (l) { var k = l.getAttribute("data-milestone-line"); return k === kind || !k; })[0];
    if (line) { /* the fade plays only on this call (data-milestone-enter for 700ms), never on load */
      line.hidden = false;
      line.setAttribute("data-milestone-enter", "");
      setTimeout(function () { line.removeAttribute("data-milestone-enter"); }, 700);
    }
  };
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-milestone-trigger]");
    if (b) window.pmMilestone(b.getAttribute("data-milestone-trigger") || "milestone");
  });

  /* 12. (a) Setting switches swap their consequence sentence, (b) the request composer. The scroll spy is in section 7. */
  $$("input.pm-switch[role='switch'][aria-describedby]").forEach(function (sw) {
    /* aria-describedby may list the sentence and a reason; the sentence is the one carrying data-on and data-off. */
    var d = sw.getAttribute("aria-describedby").split(/\s+/).map(function (id) { return document.getElementById(id); }).filter(function (el) { return el && el.hasAttribute("data-on") && el.hasAttribute("data-off"); })[0];
    if (!d) return;
    var write = function () { d.textContent = d.getAttribute(sw.checked ? "data-on" : "data-off"); };
    sw.addEventListener("change", write); if (!d.textContent.trim()) write();
  });
  $$(".pm-request-composer").forEach(function (c) {
    var form = c.matches("form") ? c : $("form", c) || c.closest("form"), ta = $("textarea", c);
    var send = $("[data-request-send]", c) || $("button[type='submit']", c);
    var hint = $("[data-request-status]", c) || $("[data-dictate-status]", c) || $(".pm-composer-hint > span", c), timer = 0;
    if (!form || !ta || !send) return;
    if (hint && hint.dataset.hint == null) hint.dataset.hint = hint.textContent;
    var ready = function () { return !!ta.value.trim(); };
    /* The ink send and the thread send (data-thread-when="text", screen 22b) enable, submit and report identically;
       the thread send is also the page's thread only while it can be pressed (Ruling 15). */
    var asThread = send.getAttribute("data-thread-when") === "text";
    var sync = function () { if (asThread) threadSwap(send, ready(), "Type the change first.", c); else setEnabled(send, ready(), "Type the change first.", c); };
    var grow = function () { /* grows with the text up to 8 lines */
      var cs = getComputedStyle(ta), lh = parseFloat(cs.lineHeight) || 24, extra = ta.offsetHeight - ta.clientHeight; ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight + extra, lh * 8 + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) + extra) + "px";
    };
    ta.addEventListener("input", function () { sync(); grow(); });
    ta.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); if (form.requestSubmit) form.requestSubmit(); else form.dispatchEvent(new Event("submit", { cancelable: true })); }
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!ready()) return;
      ta.value = ""; ta.style.height = ""; sync();
      if (!hint) return;
      clearTimeout(timer);
      pinLine(hint, "Request sent. Pramaan starts on a new branch.", true);
      timer = setTimeout(function () { hint.textContent = hint.dataset.hint || ""; }, 4000);
    });
    sync();
  });
  /* (c) Device switch (screen 15): chips button[role=radio][data-device-w] in .pm-device-switch set --pm-device-w on the stage's .pm-device
     (no value = fills the stage) and its caption from data-caption; arrow keys move the choice. Only the stage size changes, nothing is stored. */
  $$(".pm-device-switch").forEach(function (sw) {
    var chips = $$("[role='radio']", sw), stage = sw.closest(".pm-stage") || document, dev = $(".pm-device", stage), cap = dev && $(".pm-device-caption", dev);
    /* The caption states the width actually shown: when the stage is narrower than the chosen device, it says so
       ("Shown at 782 px. A tablet is 820 px.") instead of claiming a width the frame does not have. */
    var caption = function () {
      var c = chips.filter(function (x) { return x.getAttribute("aria-checked") === "true"; })[0], fr = dev && $("iframe", dev);
      if (!c || !cap || !c.hasAttribute("data-caption")) return;
      var want = parseInt(c.getAttribute("data-device-w"), 10), got = fr ? fr.clientWidth : 0;
      cap.textContent = want && got && got < want - 1 ? "Shown at " + got + " px. A " + c.textContent.trim().toLowerCase() + " is " + want + " px." : c.getAttribute("data-caption");
    };
    var choose = function (c, focus) {
      chips.forEach(function (x) { x.setAttribute("aria-checked", String(x === c)); x.tabIndex = x === c ? 0 : -1; });
      if (dev) { var w = c.getAttribute("data-device-w"); if (w) dev.style.setProperty("--pm-device-w", w); else dev.style.removeProperty("--pm-device-w"); }
      caption();
      if (focus) c.focus();
    };
    if (dev && "ResizeObserver" in window) new ResizeObserver(caption).observe(dev);
    chips.forEach(function (c, i) {
      c.tabIndex = c.getAttribute("aria-checked") === "true" ? 0 : -1;
      c.addEventListener("click", function () { choose(c, false); });
      c.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
        if (d) { e.preventDefault(); choose(chips[(i + d + chips.length) % chips.length], true); }
      });
    });
  });
})();
