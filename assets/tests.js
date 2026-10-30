/* Rise Personal · generic test engine. One shell for every free test: intro, one question per card, gate, result, print to PDF. Nothing is stored except on this device. */
(function () {
  "use strict";
  var RP = window.RP || {}, $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var D = JSON.parse($("#test-data").textContent), root = $("#test-root"), reduced = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  var SLUG = (RP.slugNow ? RP.slugNow() : D.slug), MINS = D.kind === "builder" ? "3 minutes" : (D.id === "big-five-aspects" ? "15 minutes" : "4 minutes");
  var KEY = "rp_test_" + D.id, st = { a: [], i: 0 };
  try { var sv = JSON.parse(localStorage.getItem(KEY) || "null"); if (sv && sv.a) st = sv; } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function T(n, p) { try { if (RP.track) RP.track(n, p || {}); } catch (e) {} }
  function waLink(msg) { return RP.waUrl ? RP.waUrl(msg) : "https://wa.me/971506832835?text=" + encodeURIComponent(msg); }
  function fill(t, m) { return String(t).replace(/\{(\w+)\}/g, function (x, k) { return m[k] !== undefined ? m[k] : x; }); }
  function copyTxt(txt, btn) {
    var done = function () { var o = btn.textContent; btn.textContent = "Copied"; setTimeout(function () { btn.textContent = o; }, 1800); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, done); else { var ta = document.createElement("textarea"); ta.value = txt; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch (e) {} ta.remove(); done(); }
  }
  function focusTop() { var h = $("h2, h1", root); if (h) { h.setAttribute("tabindex", "-1"); try { h.focus({ preventScroll: true }); } catch (e) {} } window.scrollTo({ top: Math.max(0, root.getBoundingClientRect().top + window.scrollY - 90), behavior: reduced ? "auto" : "smooth" }); }
  function ctaBlock(msg, extra) {
    var c = D.cta || {};
    return '<div class="next-card rv-step"><div><h3>' + esc(c.heading || "Want to talk it through?") + '</h3><p>' + esc(c.text || c.body || "") + '</p></div><div class="res-actions"><a class="btn btn-wa" data-track="test_wa_click" data-where="' + esc(D.slug) + '" rel="noopener" href="' + waLink(msg) + '">' + esc(c.button || "Send my result to our team") + '</a>' +
      (c.secondary && c.secondary_href ? '<a class="btn btn-ghost" href="' + esc(c.secondary_href) + '">' + esc(c.secondary) + "</a>" : '<a class="btn btn-ghost" href="tests.html">More free tests</a>') + '</div></div>';
  }
  function againBtn() {
    if (D.kind === "builder") return '<button class="btn btn-ghost" id="t-again" type="button">Start again</button>';
    var r = RP.retakeOn ? RP.retakeOn(SLUG) : null;
    return r ? '<span class="retake-note">You can take this again from ' + RP.fmtDate(r) + '.</span>' : '<button class="btn btn-ghost" id="t-again" type="button">Take it again</button>';
  }
  function after() { return (RP.nextHTML ? RP.nextHTML(SLUG) : "") + (RP.inviteHTML ? RP.inviteHTML(D.h1) : ""); }
  function actions() {
    return after() + '<div class="res-actions rv-step res-tools"><button class="btn btn-ghost" id="t-print" type="button">Save as PDF</button>' + againBtn() + '<a class="btn btn-ghost" href="tests.html">All free tests</a></div><p class="res-foot dark-on-light">Your answers stay on this device. <button class="btn-link" id="t-clear" type="button">Clear my data</button></p>';
  }
  function wireCommon() {
    var p = $("#t-print"); if (p) p.addEventListener("click", function () { T("test_print", { test: D.id }); window.print(); });
    var a = $("#t-again"); if (a && D.kind !== "builder") a.addEventListener("click", function () { st = { a: [], i: 0 }; save(); try { localStorage.removeItem("rp_done_" + SLUG); } catch (e) {} start(); focusTop(); });
    if (RP.wireInvite) RP.wireInvite(D.h1, MINS);
    var c = $("#t-clear"); if (c) c.addEventListener("click", function () { try { Object.keys(localStorage).forEach(function (k) { if (k.indexOf("rp_") === 0 || k.indexOf("rp3_") === 0) localStorage.removeItem(k); }); } catch (e) {} location.reload(); });
  }
  function head() { return '<div class="print-head"><b>Rise Personal</b> · ' + esc(D.h1) + ' · risepersonal.com</div>'; }
  function honesty() { return D.honesty_lines && D.honesty_lines.length ? '<ul class="honest">' + D.honesty_lines.map(function (l) { return "<li>" + esc(l) + "</li>"; }).join("") + "</ul>" : ""; }

  /* ---------- intro ---------- */
  function start() {
    var n = D.kind === "builder" ? 0 : (D.items ? D.items.length : D.questions.length);
    if (D.kind === "builder") { renderBuilder(); return; }
    var has = st.i > 0 && st.i < n, tk = RP.retakeOn ? RP.retakeOn(SLUG) : null;
    if (tk && st.a.length >= n) {
      root.innerHTML = '<div class="test-intro"><p class="lede">You have already taken this one. We keep one result per person so the answer stays honest. Here it is again.</p><div class="intro-cta"><button class="btn btn-ink btn-lg" id="t-see" type="button">See my result</button><p>You can take it again from ' + RP.fmtDate(tk) + '.</p></div></div>';
      $("#t-see").addEventListener("click", function () { result(); }); return;
    }
    root.innerHTML = '<div class="test-intro"><p class="lede">' + esc(D.lede) + '</p><p class="tnote">' + esc(D.time_note || "") + '</p>' + (D.audience_note ? '<p class="aud">' + esc(D.audience_note) + '</p>' : "") + honesty() +
      '<div class="intro-cta"><button class="btn btn-ink btn-lg" id="t-begin" type="button">' + (D.begin_label || "Begin") + '</button>' + (has ? '<p>You have one in progress. <button class="btn-link" id="t-resume" type="button">Pick up where you left off</button></p>' : "") + '</div></div>';
    $("#t-begin").addEventListener("click", function () { st = { a: [], i: 0 }; save(); T("test_start", { test: D.id }); renderQ(0); });
    var r = $("#t-resume"); if (r) r.addEventListener("click", function () { renderQ(st.i); });
  }

  /* ---------- questions ---------- */
  var lock = false;
  function items() { return D.items || D.questions.map(function (q) { return { t: q.text, k: q.area, n: q.n }; }); }
  function scale() { return D.scale && D.scale.length && typeof D.scale[0] === "object" ? D.scale : (D.scale || []).map(function (l, i) { return { label: l, value: i + 1 }; }); }
  function chapterFor(i) { var c = (D.chapters || []).filter(function (c) { return i >= c.from - 1 && i <= c.to - 1; })[0]; return c && i === c.from - 1 ? c : null; }
  function renderQ(i) {
    var IT = items(), n = IT.length; lock = false; st.i = i; save();
    var pct = Math.round(((i + 1) / n) * 100), sc = scale(), ch = chapterFor(i), q = IT[i], cur = st.a[i];
    root.innerHTML = '<div class="q-meta"><span>Statement ' + (i + 1) + ' of ' + n + '</span><span>' + pct + '%</span></div><div class="q-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"><i style="inline-size:' + pct + '%"></i></div>' +
      '<div class="q-card"><div class="qin in">' + (ch ? '<p class="chap"><b>' + esc(ch.title) + '</b> ' + esc(ch.line || "") + '</p>' : "") + '<p class="q-q" id="qtext" tabindex="-1">' + esc(q.t) + '</p><div class="q-opts" role="group" aria-labelledby="qtext">' +
      sc.map(function (o, idx) { return '<button type="button" class="q-opt' + (cur === o.value ? " sel" : "") + '" data-v="' + o.value + '" style="--n:' + idx + '"><i></i><span class="k">' + (idx + 1) + '</span>' + esc(o.label) + (o.hint ? '<small class="oh">' + esc(o.hint) + "</small>" : "") + "</button>"; }).join("") +
      '</div><div class="q-foot">' + (i > 0 ? '<button type="button" class="btn-link" id="t-back">← Back</button>' : "<span></span>") + '<span class="hint">Keys 1 to ' + sc.length + ' answer. Left arrow goes back.</span></div></div></div>';
    $$(".q-opt", root).forEach(function (b) { b.addEventListener("click", function () { if (lock) return; lock = true; st.a[i] = parseFloat(b.dataset.v); save(); $$(".q-opt", root).forEach(function (x) { x.classList.toggle("sel", x === b); }); setTimeout(function () { if (i + 1 >= n) done(); else renderQ(i + 1); }, reduced ? 60 : 130); }); });
    var bk = $("#t-back"); if (bk) bk.addEventListener("click", function () { renderQ(i - 1); });
  }
  document.addEventListener("keydown", function (e) {
    if (!$(".q-opts", root)) return;
    var n = parseInt(e.key, 10), b = n ? $('.q-opt:nth-child(' + n + ')', root) : null;
    if (b) b.click(); else if (e.key === "ArrowLeft") { var bk = $("#t-back"); if (bk) bk.click(); }
  });

  /* ---------- scoring ---------- */
  function score() {
    var IT = items(), dims = {}, cnt = {};
    IT.forEach(function (q, i) { var v = st.a[i]; if (v == null) return; if (q.r) v = (D.scale.length ? D.scale.length : 5) + 1 - v; dims[q.k] = (dims[q.k] || 0) + v; cnt[q.k] = (cnt[q.k] || 0) + 1; });
    var out = {}; Object.keys(dims).forEach(function (k) { out[k] = { sum: dims[k], n: cnt[k], mean: dims[k] / cnt[k] }; }); return out;
  }
  function bandOf(mean) { var r = D.band_rule || { low_max: 2.6, mid_max: 3.4 }; return mean <= r.low_max ? "low" : (mean <= r.mid_max ? "mid" : "high"); }

  function done() {
    var summary = "", ctx = function () { return { result: summary }; };
    if (D.kind === "top") { var s = score(), arr = Object.keys(s).sort(function (a, b) { return s[b].mean - s[a].mean; }); summary = D.id + ": " + arr[0] + (arr[1] ? " / " + arr[1] : ""); }
    else if (D.kind === "sumbands") { var tot = st.a.reduce(function (x, y) { return x + (y || 0); }, 0); summary = D.id + ": total " + tot; }
    else summary = D.id + ": completed";
    root.innerHTML = '<div class="reveal-load"><p class="eyebrow">One moment</p><h2>Preparing your result</h2><div class="rl-bar"><i style="inline-size:100%"></i></div></div>';
    setTimeout(function () { RP.gate ? RP.gate({ test: D.id, container: root, context: ctx, onPass: result }) : result(); }, reduced ? 0 : 500);
  }

  /* ---------- result renderers ---------- */
  function result() {
    T("test_complete", { test: D.id }); if (RP.markDone) RP.markDone(SLUG);
    var html = "";
    if (D.kind === "top") html = resTop(); else if (D.kind === "aspects") html = resAspects(); else if (D.kind === "sumbands") html = resSum(); else html = "";
    root.innerHTML = '<div id="test-result">' + head() + html + "</div>"; wireCommon(); focusTop();
    $$("[data-copy]", root).forEach(function (b) { b.addEventListener("click", function () { copyTxt(b.dataset.copy, b); }); });
  }
  function list(a) { return "<ul>" + a.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>"; }

  function resTop() {
    var s = score(), IT = items();
    Object.keys(s).forEach(function (k) { s[k].hi = 0; s[k].top = 0; });
    IT.forEach(function (q, i) { var v = st.a[i]; if (v >= 4) s[q.k].hi++; if (v === 5) s[q.k].top++; });
    var arr = Object.keys(s).sort(function (a, b) { return (s[b].mean - s[a].mean) || (s[b].hi - s[a].hi) || (s[b].top - s[a].top); });
    var P = D.styles.filter(function (x) { return x.id === arr[0]; })[0], S = D.styles.filter(function (x) { return x.id === arr[1]; })[0];
    var closeTwo = s[arr[0]].mean - s[arr[1]].mean <= 0.2, mixed = arr.length > 2 && s[arr[0]].mean - s[arr[2]].mean <= 0.2;
    var blend = closeTwo && S && P.blend ? P.blend[S.id] : "";
    var msg = "Hello Rise Personal team, I took the Communication and Visibility Style reflection. " + (mixed ? "My answers were spread across the styles." : "My main style is " + P.name + (S && closeTwo ? " and my second is " + S.name : "") + ".") + " I would like to talk about how to be seen and heard better.";
    var mixedLine = "Your answers were spread evenly across the styles. That is useful: you can lead with different ones in different settings. If you retake it, pick the statements that are most clearly true on an ordinary working week.";
    var card = mixed
      ? '<div class="arch-card rv-step"><span class="arch-num">Your result</span><h2 class="arch-name">A blend of styles</h2><p class="arch-essence">' + esc(mixedLine) + '</p><p class="brief-signal">Closest: <b>' + esc(P.name) + '</b>, then <b>' + esc(S.name) + '</b>.</p></div>'
      : '<div class="arch-card rv-step"><span class="arch-num">Your main style</span><h2 class="arch-name">' + esc(P.name) + '</h2><p class="arch-essence">' + esc(P.tagline) + '</p><p class="brief-line">' + esc(P.body) + '</p>' + (S && closeTwo ? '<p class="brief-signal">Close behind: <b>' + esc(S.name) + '</b>. ' + esc(blend || "") + '</p>' : (S ? '<p class="brief-signal">Second style: <b>' + esc(S.name) + '</b>.</p>' : "")) + '</div>';
    return card +
      '<div class="res-two rv-step"><div class="traits-card"><h3>Where it helps</h3>' + list(P.strengths) + '<h3>Watch for</h3>' + list(P.watch) + '</div><div class="second-card"><h3>Your style in three places</h3><p><b>In the room.</b> ' + esc(P.in_the_room) + '</p><p><b>On the record.</b> ' + esc(P.on_the_record) + '</p><p><b>On screen.</b> ' + esc(P.on_screen) + '</p></div></div>' +
      '<div class="plays rv-step"><div class="play"><h4>This week</h4><p>' + esc(P.this_week) + '</p></div><div class="play"><h4>A conversation to open</h4><p>' + esc(P.conversation_opener) + '</p></div></div>' + honesty() + ctaBlock(msg) + actions();
  }
  var STRENGTH = { volatility: "Composure under pressure", withdrawal: "Steadiness of confidence" };
  function strengthName(A) { return STRENGTH[A.id] || A.plain_name || A.name; }
  function resAspects() {
    var s = score(), keys = [];
    var rows = D.traits.map(function (t) {
      var asp = t.aspects.map(function (id) {
        var A = D.aspects.filter(function (x) { return x.id === id; })[0], m = s[id] ? s[id].mean : 3, b = bandOf(m); keys.push({ A: A, m: (id === "volatility" || id === "withdrawal") ? 6 - m : m, b: b, raw: m });
        return '<div class="asp"><div class="asp-h"><b>' + esc(A.plain_name || A.name) + '</b><span class="chip chip-' + b + '">' + esc(A[b].label) + '</span></div><div class="tbar"><i style="inline-size:' + Math.round((m - 1) / 4 * 100) + '%"></i></div><p>' + esc(A[b].body) + '</p><p class="move"><b>Brand move.</b> ' + esc(A.brand_move[b]) + '</p></div>';
      }).join("");
      return '<section class="trait-block rv-step"><h3>' + esc(t.name) + '</h3><div class="asp-grid">' + asp + '</div></section>';
    }).join("");
    var hi = keys.slice().sort(function (a, b) { return b.m - a.m; }).slice(0, 3).map(function (x) { return strengthName(x.A); });
    var msg = "Hello Rise Personal team, I took the Big Five Aspects Report. My highest aspects were: " + hi.join(", ") + ". I would like to talk about how to use them in my personal brand.";
    return '<div class="arch-card rv-step"><span class="arch-num">Your Big Five Aspects Report</span><h2 class="arch-name">Your three highest aspects</h2><p class="threewords"><em>' + hi.map(esc).join("</em> · <em>") + '</em></p><p class="brief-line">Each of the five traits has two aspects. Below you can see where you sit on each one, what it gives you and what it asks of you.</p></div>' + rows + honesty() + (D.source_note ? '<p class="res-foot dark-on-light">' + esc(D.source_note) + '</p>' : "") + ctaBlock(msg) + actions();
  }
  function resSum() {
    var tot = 0, ar = {}, RS = D.result_screen, IT = items();
    IT.forEach(function (q, i) { var v = st.a[i] || 0; tot += v; ar[q.k] = (ar[q.k] || 0) + v; });
    var B = D.scoring.bands.filter(function (b) { return tot >= b.range[0] && tot <= b.range[1]; })[0] || D.scoring.bands[0];
    var order = ["room", "record", "screen"], ratio = {};
    order.forEach(function (k) { ratio[k] = ar[k] / D.areas[k].max; });
    var weakest = order.slice().sort(function (a, b) { return ratio[a] - ratio[b] || order.indexOf(a) - order.indexOf(b); })[0], strongest = order.slice().sort(function (a, b) { return ratio[b] - ratio[a] || order.indexOf(a) - order.indexOf(b); })[0];
    var sum = fill(D.result_screen.summary_template, { total: tot, band_title: B.title, room: ar.room || 0, record: ar.record || 0, screen: ar.screen || 0, weakest_title: D.areas[weakest].title });
    var msg = fill(D.whatsapp_message, { band_title: B.title, strongest_title: D.areas[strongest].title, weakest_title: D.areas[weakest].title });
    var bars = order.map(function (k) { return '<div class="trait"><span class="tname">' + esc(D.areas[k].title) + '</span><span class="tscore">' + (ar[k] || 0) + ' / ' + D.areas[k].max + '</span><div class="tbar"><i style="inline-size:' + Math.round(ratio[k] * 100) + '%"></i></div><small>' + esc(D.areas[k].intro) + '</small></div>'; }).join("");
    return '<div class="arch-card rv-step"><span class="arch-num">' + esc(RS.heading) + '</span><h2 class="arch-name">' + esc(fill(RS.score_line, { total: tot, band_title: B.title })) + '</h2><p class="brief-line">' + esc(B.reading) + '</p><p class="brief-signal">' + esc(fill(RS.weakest_line, { area_title: D.areas[weakest].title })) + '</p></div>' +
      '<div class="res-two rv-step"><div class="traits-card"><h3>By area</h3>' + bars + '</div><div class="second-card"><h3>What to do next</h3>' + list(B.advice) + '</div></div>' + '<p class="res-foot dark-on-light rv-step">' + esc(RS.no_benchmark_line) + '</p>' +
      '<div class="res-actions rv-step"><button class="btn btn-ghost" data-copy="' + esc(sum) + '" type="button">' + esc(RS.buttons.copy_summary) + '</button></div>' + ctaBlock(msg) + actions();
  }

  /* ---------- builders (typed answers become lines) ---------- */
  function clean(v, lower) { v = v.trim().replace(/\s+/g, " ").replace(/[.\s]+$/, ""); if (lower && v && !(v.length > 1 && v[1] === v[1].toUpperCase() && v[1] !== v[1].toLowerCase())) v = v.charAt(0).toLowerCase() + v.slice(1); return v; }
  function renderBuilder() {
    var F = D.fields;
    root.innerHTML = '<form id="t-form" class="builder" novalidate><p class="lede">' + esc(D.lede) + '</p>' + F.map(function (f) {
      var inp = f.type === "choice" ? '<select name="' + f.id + '">' + f.options.map(function (o) { return "<option>" + esc(o) + "</option>"; }).join("") + "</select>" : ((f.max_length || 120) > 70 ? '<textarea name="' + f.id + '" rows="2" maxlength="' + (f.max_length || 120) + '" autocomplete="off"></textarea>' : '<input name="' + f.id + '" type="text" maxlength="' + (f.max_length || 120) + '" autocomplete="off">');
      return '<label class="bf"><span class="bf-l">' + esc(f.label) + (f.required ? "" : " <small>(optional)</small>") + '</span><span class="bf-h">' + esc(f.hint || "") + '</span>' + inp + (f.example && f.type !== "choice" ? '<span class="bf-e">Example: ' + esc(f.example) + '</span>' : "") + '<span class="bf-err" role="alert"></span></label>';
    }).join("") + '<div class="res-actions"><button class="btn btn-ink btn-lg" type="submit">' + esc(D.make_label || "Make my lines") + '</button></div></form><div id="t-out" aria-live="polite"></div>';
    var f0 = $("#t-form");
    f0.addEventListener("submit", function (e) {
      e.preventDefault(); var ok = true, v = {};
      F.forEach(function (f) { var el = f0.elements[f.id], val = el.value.trim(), er = el.closest("label").querySelector(".bf-err"); er.textContent = ""; if (f.required && !val) { er.textContent = f.error || "Please fill this in."; ok = false; } v[f.id] = val; });
      if (!ok) { var b = $(".bf-err:not(:empty)", f0); if (b) b.closest("label").querySelector("input,select,textarea").focus(); return; }
      T("test_start", { test: D.id });
      RP.gate ? RP.gate({ test: D.id, container: $("#t-out"), context: function () { return { result: D.id + ": completed" }; }, onPass: function () { builderOut(v); } }) : builderOut(v);
    });
  }
  function builderOut(v) {
    var out = $("#t-out"), lines = [], RS = D.result_screen || {}, msgBase = "";
    if (D.id === "introduction-line-builder") {
      var who = clean(v.who, true), change = clean(v.change, true), proof = v.proof.trim() ? clean(v.proof, false) + "." : "";
      D.output_templates.forEach(function (t) { lines.push({ n: t.name, u: t.use_when, t: fill(t.template, { who: who, change: change, proof: proof }).replace(/\s+/g, " ").replace(/\s+\./g, ".").trim() }); });
    } else {
      var be = /^A person/.test(v.voice || "") ? "I am" : "we are", Be = be.charAt(0).toUpperCase() + be.slice(1);
      var m = { be: be, Be: Be, for: clean(v.for, true), who: clean(v.who, true), we_are: clean(v.we_are, true), that: clean(v.that, true), unlike: clean(v.unlike, true), because: clean(v.because, true) };
      D.output_templates.forEach(function (t) { var tx = fill(t.template, m); tx = tx.charAt(0).toUpperCase() + tx.slice(1); lines.push({ n: t.name, u: t.notes || "", t: tx }); });
    }
    var sel = lines[0].t; if (RP.markDone) RP.markDone(SLUG);
    out.innerHTML = '<div id="test-result">' + head() + '<h2 class="rv-step">' + esc(RS.heading || "Your lines") + '</h2>' + lines.map(function (l, i) { return '<div class="rbox rv-step"><h3>' + esc(l.n) + '</h3>' + (l.u ? '<p class="bf-h">' + esc(l.u) + '</p>' : "") + '<p class="line">' + esc(l.t) + '</p><button class="btn btn-ghost" type="button" data-copy="' + esc(l.t) + '">' + esc(((RS.buttons || {}).copy) || "Copy") + '</button></div>'; }).join("") +
      (RS.check_questions ? '<div class="rbox rv-step"><h3>Check it</h3>' + list(RS.check_questions) + '</div>' : "") + (RS.after_text ? '<p class="res-foot dark-on-light rv-step">' + esc(RS.after_text) + '</p>' : "") +
      ctaBlock(fill(D.whatsapp_message || "Hello Rise Personal team, I used your tool and would like a second opinion.", { selected_line: sel })) + actions() + "</div>";
    wireCommon(); $$("[data-copy]", out).forEach(function (b) { b.addEventListener("click", function () { copyTxt(b.dataset.copy, b); }); });
    var a = $("#t-again"); if (a) a.addEventListener("click", function () { renderBuilder(); focusTop(); });
    out.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }

  start();
})();
