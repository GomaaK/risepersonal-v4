(function () {
  "use strict";
  if (!window.RP || !document.querySelector(".chip")) return;
  var RP = window.RP, WA = RP.WA, reduced = RP.reduced, $ = RP.$, $$ = RP.$$, waUrl = RP.waUrl, setWa = RP.setWa;
  var ROLES = {
    founder:    { label: "founder",    line: "Investors and partners back the founder first.", sub: "We position founders as the credible, visible face of the company, in the room and online, before they go to market.", msg: "Hello Rise Personal team, I'm a founder and I'd like to talk about my positioning." },
    exec:       { label: "executive",  line: "A company’s reputation is its leaders’ reputation.", sub: "We make boards and senior managers known beyond the industry they already lead, so the business benefits from their names.", msg: "Hello Rise Personal team, I'm an executive and I'd like to talk about positioning for me and my leadership team." },
    consultant: { label: "consultant", line: "Your work travels by introduction. Let’s widen the room.", sub: "We take consultants from a trusted network to a recognised public name, with a wider network than they started with.", msg: "Hello Rise Personal team, I'm a consultant and I'd like to talk about building my public profile." },
    expert:     { label: "expert",     line: "Be known for what you stand for.", sub: "For doctors and experts, we build a clear reputation within the rules of your profession. Visible, credible, never loud.", msg: "Hello Rise Personal team, I'm a doctor/expert and I'd like to talk about my professional reputation." }
  };
  if (RP.CFG && RP.CFG.roles) Object.keys(RP.CFG.roles).forEach(function (k) { if (ROLES[k]) { ROLES[k].line = RP.CFG.roles[k].line; ROLES[k].sub = RP.CFG.roles[k].sub; ROLES[k].cta = RP.CFG.roles[k].cta; } });
  var base = "I'd like to talk about personal branding.";
  /* guided picker */
  var chips = $$(".chip"), answer = $("#answer");
  function pick(key, silent) {
    var r = ROLES[key]; if (!r) return;
    var apply = function () {
      chips.forEach(function (c) {
        var on = c.dataset.role === key;
        c.setAttribute("aria-checked", on ? "true" : "false");
        c.tabIndex = on ? 0 : -1;
      });
      $("#answer-line").textContent = r.line;
      $("#answer-sub").textContent = r.sub;
      answer.hidden = false;
      setWa(r.msg);
      if (r.cta) $("#answer-wa").textContent = r.cta;
      $$(".story").forEach(function (s) {
        s.classList.toggle("match", s.dataset.for === key);
      });
      var first = $('.story[data-for="' + key + '"]');
      $("#answer-story").textContent = "See a story like yours →";
      try { sessionStorage.setItem("rp-role", key); } catch (e) {}
      if (!silent && RP.track) RP.track("role_picked", { role: key });
    };
    if (!silent && document.startViewTransition && !reduced) document.startViewTransition(apply); else apply();
  }
  chips.forEach(function (c, i) {
    c.addEventListener("click", function () { pick(c.dataset.role); });
    c.addEventListener("keydown", function (e) {
      var k = e.key, n = null;
      if (k === "ArrowRight" || k === "ArrowDown") n = (i + 1) % chips.length;
      if (k === "ArrowLeft" || k === "ArrowUp") n = (i - 1 + chips.length) % chips.length;
      if (n !== null) { e.preventDefault(); chips[n].focus(); pick(chips[n].dataset.role); }
    });
  });
  $("#answer-story").addEventListener("click", function (e) {
    var k; try { k = sessionStorage.getItem("rp-role"); } catch (x) {}
    if (k) { filter(k); }
  });
  chips[0].tabIndex = 0; chips.slice(1).forEach(function (c) { c.tabIndex = 0; });
  try { var saved = sessionStorage.getItem("rp-role"); if (saved) pick(saved, true); } catch (e) {}

  /* tabs */
  var tabs = $$(".tab");
  function selectTab(t) {
    tabs.forEach(function (x) {
      var on = x === t;
      x.setAttribute("aria-selected", on ? "true" : "false");
      x.tabIndex = on ? 0 : -1;
      $("#" + x.getAttribute("aria-controls")).hidden = !on;
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () {
      if (document.startViewTransition && !reduced) document.startViewTransition(function () { selectTab(t); }); else selectTab(t);
    });
    t.addEventListener("keydown", function (e) {
      var n = null;
      if (e.key === "ArrowRight") n = (i + 1) % tabs.length;
      if (e.key === "ArrowLeft") n = (i - 1 + tabs.length) % tabs.length;
      if (n !== null) { e.preventDefault(); tabs[n].focus(); selectTab(tabs[n]); }
    });
  });

  /* story filter */
  var fs = $$(".f"), stories = $$(".story");
  function filter(key) {
    fs.forEach(function (b) { var on = b.dataset.f === key; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on ? "true" : "false"); });
    stories.forEach(function (s) {
      var show = key === "all" || s.dataset.for === key || s.dataset.for === "all";
      s.classList.toggle("dim", !show);
    });
    var rail = $(".rail");
    var target = key === "all" ? null : $('.story[data-for="' + key + '"]');
    if (target && rail) rail.scrollTo({ left: Math.max(0, target.offsetLeft - rail.offsetLeft - 16), behavior: reduced ? "auto" : "smooth" });
  }
  fs.forEach(function (b) { b.addEventListener("click", function () { filter(b.dataset.f); }); });


  /* founder journey */
  var cs = $$(".steps button"), cps = $$(".chapter"), chi = 0;
  function showCh(n, focus) {
    chi = Math.max(0, Math.min(cs.length - 1, n));
    var go = function () {
      cs.forEach(function (x, i) { var on = i === chi; x.setAttribute("aria-selected", on ? "true" : "false"); x.tabIndex = on ? 0 : -1; });
      cps.forEach(function (p, i) { p.hidden = i !== chi; });
      $("#track-fill").style.inlineSize = ((chi + 1) / cs.length * 100) + "%";
      $("#ch-count").textContent = (chi + 1) + " / " + cs.length;
      $("#ch-prev").disabled = chi === 0; $("#ch-next").disabled = chi === cs.length - 1;
      if (window.innerWidth < 900) { var b = cs[chi]; b.parentNode.parentNode.scrollTo({ left: b.parentNode.offsetLeft - 16, behavior: reduced ? "auto" : "smooth" }); }
    };
    if (document.startViewTransition && !reduced) document.startViewTransition(go); else go();
    if (focus) cs[chi].focus();
  }
  cs.forEach(function (b, i) {
    b.addEventListener("click", function () { showCh(i); });
    b.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); showCh((chi + 1) % cs.length, true); }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); showCh((chi - 1 + cs.length) % cs.length, true); }
    });
  });
  $("#ch-prev").addEventListener("click", function () { showCh(chi - 1); });
  $("#ch-next").addEventListener("click", function () { showCh(chi + 1); });
  showCh(0);

  /* reputation check */
  var QS = [
    { k: "known", q: "Where are you known today?", o: [["network", "Mostly in my own network"], ["industry", "Across my industry"], ["public", "Publicly, beyond my industry"]] },
    { k: "online", q: "How visible are you online?", o: [["barely", "Barely, little or nothing"], ["some", "Some, a profile and a few posts"], ["strong", "Strong and active"]] },
    { k: "goal", q: "What should your reputation do for you?", o: [["clients", "Bring me the right clients"], ["investors", "Get investors and partners behind me"], ["authority", "Make me a voice others quote and invite"]] }
  ];
  var ans = {}, qi = 0, body = $("#rc-body"), back = $("#rc-back"), dots = $$("#rc .dots i");
  var TXT = {
    known: { network: ["Your reputation is real, but it lives in your network.", "In the room: sharpen the story people repeat about you and widen the rooms you are in."], industry: ["You lead your industry. Outsiders do not know it yet.", "On the record: interviews, press and profiles that reach beyond your industry."], public: ["You are already known. Now make it work harder.", "On screen: a consistent voice, content and distribution that match your standing."] },
    online: { barely: "Online is open ground, so we begin with the basics.", some: "Your online presence is a base to build on.", strong: "Online is strong. We make it consistent with who you are in the room." },
    goal: { clients: "More of the right clients coming to you.", investors: "Investors and partners backing you first.", authority: "A voice that others quote and invite." }
  };
  function lab(k, v) { return QS.filter(function (q) { return q.k === k; })[0].o.filter(function (o) { return o[0] === v; })[0][1]; }
  function renderQ() {
    dots.forEach(function (d, i) { d.classList.toggle("on", i <= qi); });
    back.hidden = qi === 0;
    var q = QS[qi], h = '<h3 class="q-q">' + q.q + '</h3><div class="q-opts" role="group" aria-label="' + q.q + '">';
    q.o.forEach(function (o) { h += '<button type="button" class="q-opt' + (ans[q.k] === o[0] ? " sel" : "") + '" data-v="' + o[0] + '"><i></i>' + o[1] + "</button>"; });
    body.innerHTML = h + "</div>";
  }
  function renderRes() {
    dots.forEach(function (d) { d.classList.add("on"); });
    back.hidden = false;
    var t = TXT.known[ans.known];
    var msg = "Hello Rise Personal team, I did the reputation check. I'm known: " + lab("known", ans.known).toLowerCase() + ". Online: " + lab("online", ans.online).toLowerCase() + ". I want my reputation to: " + lab("goal", ans.goal).toLowerCase() + ".";
    body.innerHTML = '<p class="res-tag">Your starting point</p><h3 class="res-title">' + t[0] + '</h3><ul class="res-list"><li><b>First move</b><span>' + t[1] + '</span></li><li><b>Online</b><span>' + TXT.online[ans.online] + '</span></li><li><b>The aim</b><span>' + TXT.goal[ans.goal] + '</span></li></ul><div class="res-cta"><a class="btn btn-wa" href="' + waUrl(msg) + '" rel="noopener">Send this to Sawaf on WhatsApp</a><button type="button" class="btn-link" id="rc-redo">Start again</button></div>';
  }
  function step(fn) { if (document.startViewTransition && !reduced) document.startViewTransition(fn); else fn(); }
  body.addEventListener("click", function (e) {
    var o = e.target.closest(".q-opt"), r = e.target.closest("#rc-redo");
    if (r) { ans = {}; qi = 0; step(renderQ); return; }
    if (!o) return;
    ans[QS[qi].k] = o.dataset.v;
    o.parentNode.querySelectorAll(".q-opt").forEach(function (b) { b.classList.toggle("sel", b === o); });
    setTimeout(function () { qi++; step(qi < QS.length ? renderQ : renderRes); }, reduced ? 50 : 260);
  });
  back.addEventListener("click", function () { qi = Math.max(0, qi >= QS.length ? QS.length - 1 : qi - 1); step(renderQ); });
  renderQ();

})();
