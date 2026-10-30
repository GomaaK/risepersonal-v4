/* Rise Personal v4 · shared behaviour: WhatsApp links, mobile menu, reveal, magnetic buttons */
(function () {
  "use strict";
  var WA = "971506832835";
  var reduced = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function waUrl(msg) { return "https://wa.me/" + WA + "?text=" + encodeURIComponent(msg); }
  var DEFAULT_MSG = "Hello Rise Personal team, I'd like to talk about personal branding.";
  function setWa(msg) { $$("[data-wa]").forEach(function (a) { a.href = waUrl(a.dataset.msg || msg); }); }
  var CFG = window.RP_CFG || {};
  /* Privacy-first events: nothing is sent unless an analytics domain is configured (cookieless Plausible). No personal data is ever passed. */
  var pq = [];
  function loadAnalytics() {
    if (!CFG.plausibleDomain || document.getElementById("rp-an")) return;
    var sc = document.createElement("script"); sc.id = "rp-an"; sc.defer = true; sc.setAttribute("data-domain", CFG.plausibleDomain); sc.src = "https://plausible.io/js/script.tagged-events.js";
    document.head.appendChild(sc);
    window.plausible = window.plausible || function () { (window.plausible.q = window.plausible.q || []).push(arguments); };
  }
  function track(name, props) {
    if (!CFG.plausibleDomain) return;
    loadAnalytics();
    try { window.plausible(name, { props: props || {} }); } catch (e) {}
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-track]"); if (!a) return;
    track(a.dataset.track, { where: a.dataset.where || location.pathname.replace(/^\//, "") || "home" });
  });

  /* ---------- lead gate: name + (email or WhatsApp) before a result. Active only when an endpoint is configured. ---------- */
  var LEADKEY = "rp_lead";
  function getLead() { try { return JSON.parse(localStorage.getItem(LEADKEY) || "null"); } catch (e) { return null; } }
  function gateEnabled() { return !!(CFG.captureUrl || CFG.captureForm); }
  function esc2(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function sendLead(p) {
    if (CFG.captureForm && CFG.captureForm.action) {
      var m = CFG.captureForm.fields || {}, body = new URLSearchParams();
      Object.keys(m).forEach(function (k) { if (p[k] !== undefined) body.append(m[k], typeof p[k] === "object" ? JSON.stringify(p[k]) : String(p[k])); });
      return fetch(CFG.captureForm.action, { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body });
    }
    return fetch(CFG.captureUrl, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(p), mode: "cors", redirect: "follow" }).then(function (r) { return r.json(); }).then(function (j) { if (!j || !j.ok) throw new Error("bad"); });
  }
  function gate(o) {
    var lead = getLead();
    if (!gateEnabled() || lead) { o.onPass(lead); return; }
    var host = o.container, prev = host.innerHTML;
    host.innerHTML = '<form class="gate" novalidate aria-labelledby="gate-h"><span class="badge">Almost there</span><h2 id="gate-h">Where should we send your report?</h2>' +
      '<p class="gate-lede">Add your name and an email or WhatsApp number to see your result. We use them to send your report link and so our team can follow up on your result.</p>' +
      '<div class="gate-grid"><label>First name<input name="name" type="text" maxlength="60" autocomplete="given-name" required></label>' +
      '<label>Email<input name="email" type="email" maxlength="120" autocomplete="email" inputmode="email"></label>' +
      '<label>WhatsApp number<input name="wa" type="tel" maxlength="30" autocomplete="tel" inputmode="tel" placeholder="+971 50 000 0000"></label></div>' +
      '<p class="gate-note">Name, and at least one of email or WhatsApp. We will see your name, your contact details, which test you took and your result. We do not sell or share them. <a href="privacy-and-discretion.html">Privacy and discretion</a></p>' +
      '<label class="ck"><input type="checkbox" name="mk"> <span>Also send me occasional notes from the Rise Personal team. I can stop them at any time.</span></label>' +
      '<div class="res-actions"><button class="btn btn-ink btn-lg" type="submit">Show my result</button></div><p class="dl-st" aria-live="polite"></p></form>';
    var f = $(".gate", host), st = $(".dl-st", host), busy = false;
    var first = f.elements.name; try { first.focus({ preventScroll: true }); } catch (e) {}
    f.addEventListener("submit", function (e) {
      e.preventDefault(); if (busy) return;
      var name = f.elements.name.value.trim(), email = f.elements.email.value.trim(), wa = f.elements.wa.value.trim();
      if (name.length < 2) { st.textContent = "Please add your first name."; f.elements.name.focus(); return; }
      var okE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email), okW = wa.replace(/\D/g, "").length >= 8;
      if (!okE && !okW) { st.textContent = "Please add a valid email or a WhatsApp number with the country code."; (email ? f.elements.email : f.elements.wa).focus(); return; }
      if (email && !okE) { st.textContent = "That email does not look right. Please check it."; f.elements.email.focus(); return; }
      if (wa && !okW) { st.textContent = "That number does not look right. Please add the country code."; f.elements.wa.focus(); return; }
      var ctx = o.context ? o.context() : {};
      var payload = { source: "risepersonal.com", test: o.test, submitted: new Date().toISOString(), name: name, email: okE ? email : "", whatsapp: okW ? wa : "", marketing_opt_in: !!f.elements.mk.checked, result: ctx.result || "", ref: "", invited_by: invitedBy(), my_ref: myRef(), page: location.pathname.replace(/^\//, "") || "home" };
      busy = true; st.textContent = "One moment…";
      sendLead(payload).then(function () {
        var l = { name: name, email: payload.email, whatsapp: payload.whatsapp }; try { localStorage.setItem(LEADKEY, JSON.stringify(l)); } catch (e2) {}
        track("lead_captured", { test: o.test }); o.onPass(l);
      }).catch(function () { st.textContent = "That did not go through. Please try again, or message us on WhatsApp."; busy = false; });
    });
  }

  /* ---------- invites, once-per-person, journey ---------- */
  function myRef() {
    try { var r = localStorage.getItem("rp_ref"); if (!r) { r = Math.random().toString(36).slice(2, 8); localStorage.setItem("rp_ref", r); } return r; } catch (e) { return ""; }
  }
  function invitedBy() { try { return localStorage.getItem("rp_inv") || ""; } catch (e) { return ""; } }
  (function () { try { var q = (new URLSearchParams(location.search)).get("ref"); if (q && /^[a-z0-9]{4,12}$/i.test(q) && q !== localStorage.getItem("rp_ref") && !localStorage.getItem("rp_inv")) localStorage.setItem("rp_inv", q); } catch (e) {} })();
  var RETAKE_DAYS = 90;
  function slugNow() { return (location.pathname.split("/").pop() || "index.html").replace(/\.html$/, ""); }
  function doneAt(slug) { try { return parseInt(localStorage.getItem("rp_done_" + slug) || "0", 10) || 0; } catch (e) { return 0; } }
  function markDone(slug) { try { localStorage.setItem("rp_done_" + slug, String(Date.now())); } catch (e) {} }
  function retakeOn(slug) { var t = doneAt(slug); if (!t) return null; var d = new Date(t + RETAKE_DAYS * 864e5); return d > new Date() ? d : null; }
  function fmtDate(d) { return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }); }
  function nextTests(cur, n) {
    var L = (CFG.tests || []).filter(function (t) { return t.slug !== cur; });
    var open = L.filter(function (t) { return !doneAt(t.slug); }); return (open.length ? open : L).slice(0, n || 2);
  }
  function nextHTML(cur) {
    var N = nextTests(cur, 2); if (!N.length) return "";
    return '<section class="nexts rv-step" aria-labelledby="nx-h"><h3 id="nx-h">Your next step on the journey</h3><div class="nx-grid">' + N.map(function (t) { return '<a class="nx" href="' + t.slug + '.html" data-track="next_test" data-where="' + cur + '"><span class="nx-tag">' + esc2(t.tag) + ' · ' + esc2(t.time) + '</span><b>' + esc2(t.h1) + '</b><span>' + esc2(t.blurb) + '</span><i aria-hidden="true">→</i></a>'; }).join("") + "</div></section>";
  }
  function inviteHTML(title) {
    return '<section class="invite rv-step" aria-labelledby="inv-h"><div><h3 id="inv-h">Know someone who should take this?</h3><p>Send them the link. It is free and takes a few minutes.</p></div><div class="res-actions"><a class="btn btn-wa" id="inv-wa" data-track="invite_wa" rel="noopener" href="#">Send on WhatsApp</a><a class="btn btn-ghost" id="inv-li" data-track="invite_li" rel="noopener" target="_blank" href="#">Share on LinkedIn</a><button class="btn btn-ghost" id="inv-cp" data-track="invite_copy" type="button">Copy link</button></div><p class="dl-st" id="inv-st" aria-live="polite"></p></section>';
  }
  function wireInvite(title, mins) {
    var slug = slugNow(), u = location.origin + location.pathname.replace(/[^/]*$/, "") + slug + ".html?ref=" + myRef();
    var txt = "I just took the " + title + " from Rise Personal. It is free and takes about " + mins + ". Try it: " + u;
    var wa = $("#inv-wa"), li = $("#inv-li"), cp = $("#inv-cp"), st = $("#inv-st"); if (!wa) return;
    wa.href = "https://wa.me/?text=" + encodeURIComponent(txt); li.href = "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(u);
    cp.addEventListener("click", function () { var d = function () { st.textContent = "Link copied. Paste it anywhere."; }; if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(u).then(d, d); else { var ta = document.createElement("textarea"); ta.value = u; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch (e) {} ta.remove(); d(); } });
  }
  /* test hub: show what is done and what is next */
  function hubInit() {
    var cards = $$("[data-test]"); if (!cards.length) return; var done = 0, first = null;
    cards.forEach(function (c) { var s = c.dataset.test; if (doneAt(s)) { done++; c.classList.add("is-done"); var b = $(".tc-state", c); if (b) b.textContent = "Done"; } else if (!first) first = c; });
    if (first) { first.classList.add("is-next"); var b2 = $(".tc-state", first); if (b2) b2.textContent = done ? "Next for you" : "Start here"; }
    var pr = $("#hub-progress"); if (pr) { pr.textContent = done + " of " + cards.length + " done"; var f = $("#hub-fill"); if (f) f.style.inlineSize = Math.round(done / cards.length * 100) + "%"; }
  }
  document.addEventListener("DOMContentLoaded", hubInit);
  window.RP = { myRef: myRef, invitedBy: invitedBy, doneAt: doneAt, markDone: markDone, retakeOn: retakeOn, fmtDate: fmtDate, nextHTML: nextHTML, inviteHTML: inviteHTML, wireInvite: wireInvite, slugNow: slugNow, gate: gate, gateEnabled: gateEnabled, getLead: getLead, WA: WA, reduced: reduced, $: $, $$: $$, waUrl: waUrl, setWa: setWa, DEFAULT_MSG: DEFAULT_MSG, track: track, CFG: CFG };
  if (CFG.plausibleDomain) { loadAnalytics(); track("pageview_ready", {}); }
  document.documentElement.classList.remove("no-js");
  setWa(DEFAULT_MSG);

  /* mobile menu */
  var burger = $(".burger"), menu = $("#menu");
  if (burger && menu) {
    var open = false, t = null;
    var set = function (v) {
      if (v === open) return; open = v; clearTimeout(t);
      burger.setAttribute("aria-expanded", v ? "true" : "false");
      burger.setAttribute("aria-label", v ? "Close menu" : "Open menu");
      document.body.classList.toggle("menu-open", v);
      if (v) { menu.hidden = false; requestAnimationFrame(function () { requestAnimationFrame(function () { menu.classList.add("open"); }); }); }
      else { menu.classList.remove("open"); t = setTimeout(function () { menu.hidden = true; }, 260); }
    };
    burger.addEventListener("click", function () { set(!open); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) set(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && open) { set(false); burger.focus(); } });
    document.addEventListener("click", function (e) { if (open && !menu.contains(e.target) && !burger.contains(e.target)) set(false); });
    var mq = matchMedia("(min-width:62rem)");
    var f = function () { if (mq.matches) set(false); };
    if (mq.addEventListener) mq.addEventListener("change", f);
  }

  /* clear this device's stored answers */
  $$("[data-clear]").forEach(function (b) {
    b.addEventListener("click", function () {
      try { Object.keys(localStorage).forEach(function (k) { if (k.indexOf("rp3_") === 0 || k.indexOf("rp-") === 0 || k.indexOf("rp_") === 0) localStorage.removeItem(k); }); sessionStorage.clear(); } catch (e) {}
      var st = b.parentNode.querySelector(".clear-st"); if (st) { st.textContent = "Cleared."; setTimeout(function () { st.textContent = ""; }, 3000); }
    });
  });

  /* reveal fallback for browsers without scroll-driven animations */
  var supportsView = window.CSS && CSS.supports && CSS.supports("animation-timeline: view()");
  if (!supportsView && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { threshold: 0.12 });
    $$(".reveal").forEach(function (el) { io.observe(el); });
  } else if (!supportsView) { $$(".reveal").forEach(function (el) { el.classList.add("in"); }); }

  /* header gets a shadow once scrolled */
  var top = $(".top");
  if (top) { var onS = function () { top.classList.toggle("scrolled", window.scrollY > 8); }; onS(); window.addEventListener("scroll", onS, { passive: true }); }

  /* magnetic buttons (pointer devices only) */
  if (!reduced && matchMedia("(hover:hover) and (pointer:fine)").matches) {
    $$(".magnet").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = "translate(" + ((e.clientX - r.left - r.width / 2) * 0.12) + "px," + ((e.clientY - r.top - r.height / 2) * 0.2) + "px)";
      });
      b.addEventListener("pointerleave", function () { b.style.transform = ""; });
    });
  }
})();
