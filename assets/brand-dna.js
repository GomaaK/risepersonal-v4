/* Rise Personal v3 · The Brand DNA Report. 20 statements (Big Five) + 2 choices -> archetype + three words. Runs in the browser; nothing is sent anywhere. */
(function () {
  "use strict";
  var RP = window.RP, $ = RP.$, $$ = RP.$$, reduced = RP.reduced, waUrl = RP.waUrl;
  if (!$("#s-quiz")) return;

  var QUESTIONS = [
    { f: "O", r: 1, t: "I have a vivid imagination and can lose myself in new ideas." },
    { f: "C", r: 1, t: "I follow through on my plans, even after the first excitement fades." },
    { f: "E", r: 1, t: "I feel energized after spending time in a lively group of people." },
    { f: "A", r: 1, t: "I naturally tune in to how the people around me are feeling." },
    { f: "N", r: 0, t: "I stay calm and clear-headed under pressure." },
    { f: "O", r: 1, t: "I am drawn to unusual ideas, art, and perspectives others find strange." },
    { f: "C", r: 1, t: "People can rely on me to deliver what I promised, on time." },
    { f: "E", r: 1, t: "I am comfortable speaking first in a room full of people." },
    { f: "A", r: 1, t: "I give people the benefit of the doubt." },
    { f: "N", r: 1, t: "I replay worries in my mind long after the moment has passed." },
    { f: "O", r: 0, t: "I prefer familiar routines over experimenting with new approaches." },
    { f: "C", r: 0, t: "I often leave important things until the last minute." },
    { f: "E", r: 0, t: "I would rather observe quietly than take the stage." },
    { f: "A", r: 0, t: "I enjoy a sharp debate, even when it makes waves." },
    { f: "N", r: 1, t: "A small setback can colour my entire day." },
    { f: "O", r: 1, t: "I often question the usual way of doing things and imagine a better one." },
    { f: "C", r: 1, t: "I work best with structure: lists, systems, and clear next steps." },
    { f: "E", r: 0, t: "Long stretches around many people leave me drained." },
    { f: "A", r: 1, t: "People often come to me for comfort or support." },
    { f: "N", r: 0, t: "Criticism rarely rattles me." }
  ];

  var LIKERT = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"];

  /* Final perception picks: the word pools for the 3-Word generator */
  var PICKS = [
    {
      id: "feel",
      tag: "Almost there · choice 1 of 2",
      t: "Pick the word people should FEEL when they meet your brand:",
      opts: [
        { k: "inspired", label: "Inspired", sub: "moved to think bigger", role: "essence" },
        { k: "comforted", label: "Comforted", sub: "safe and at ease", role: "human" },
        { k: "impressed", label: "Impressed", sub: "struck by your presence", role: "impact" }
      ]
    },
    {
      id: "remember",
      tag: "Almost there · choice 2 of 2",
      t: "Pick the word people should REMEMBER after they meet your brand:",
      opts: [
        { k: "authentic", label: "Authentic", sub: "the real thing", role: "essence" },
        { k: "trusted", label: "Trusted", sub: "the one they rely on", role: "human" },
        { k: "bold", label: "Bold", sub: "the one who dares", role: "impact" }
      ]
    }
  ];

  /* ---------- Data: the 12 archetypes (profile = ideal O/C/E/A/N 0–100) ---------- */
  var ARCHETYPES = [
    { id: "sage", num: 1, name: "The Sage", essence: "The thought leader and teacher: people come to you to understand what things mean.", work: "Sharing your ideas publicly: the world needs your thinking out loud.", wellness: "Deep work & meditation", words: ["Insightful", "Grounded", "Wise"], roles: ["essence", "human", "impact"], profile: { O: 80, C: 75, E: 30, A: 55, N: 45 }, keys: ["O", "C"], fusion: "Deep work and meditation keep your clarity sharp: a Sage’s brand only holds when the mind behind it is rested." },
    { id: "creator", num: 2, name: "The Creator", essence: "The artist and builder: you exist to make things that didn’t exist before.", work: "Finishing and shipping: done is the masterpiece your ideas are waiting for.", wellness: "Flow states", words: ["Original", "Visionary", "Crafted"], roles: ["essence", "impact", "human"], profile: { O: 95, C: 50, E: 45, A: 78, N: 55 }, keys: ["O", "A"], fusion: "Flow states are your strategy: your best brand moves arrive when the making feels like play." },
    { id: "ruler", num: 3, name: "The Ruler", essence: "The executive authority: composed command is your natural register.", work: "Generous leadership: share the stage, and the crown grows.", wellness: "Energy management", words: ["Commanding", "Composed", "Sovereign"], roles: ["impact", "human", "essence"], profile: { O: 55, C: 88, E: 82, A: 45, N: 20 }, keys: ["C", "E", "N"], fusion: "Energy management is the crown jewel: protect it, and composure becomes your brand signature." },
    { id: "hero", num: 4, name: "The Hero", essence: "The achiever: proof, momentum and results follow you.", work: "Sustainable pace: a long campaign beats a brilliant sprint.", wellness: "Discipline & fitness", words: ["Relentless", "Bold", "Proven"], roles: ["essence", "impact", "human"], profile: { O: 55, C: 85, E: 78, A: 50, N: 75 }, keys: ["C", "E", "N"], fusion: "Discipline and fitness keep the engine honest: your brand promises proof, so train like it." },
    { id: "explorer", num: 5, name: "The Explorer", essence: "The founder-nomad: new territory is your natural habitat.", work: "Rooted storytelling: bring the journey home so people can follow it.", wellness: "Nature & movement", words: ["Free", "Curious", "Untamed"], roles: ["essence", "human", "impact"], profile: { O: 85, C: 45, E: 55, A: 25, N: 50 }, keys: ["O", "A"], fusion: "Nature and movement reset your compass: the Explorer’s brand stays true only at full breath." },
    { id: "magician", num: 6, name: "The Magician", essence: "The innovator: you see around corners and make the impossible feel inevitable.", work: "Focus over novelty: choose the one trick and master it.", wellness: "Creation rituals", words: ["Transformative", "Magnetic", "Visionary"], roles: ["impact", "human", "essence"], profile: { O: 95, C: 50, E: 80, A: 45, N: 50 }, keys: ["O", "E"], fusion: "Creation rituals turn sparks into fire: ritual, not mood, feeds the Magician’s brand." },
    { id: "lover", num: 7, name: "The Lover", essence: "The aesthetic and lifestyle authority: beauty is how you make people feel valued.", work: "Discernment: say no beautifully, so every yes means more.", wellness: "Self-care as strategy", words: ["Magnetic", "Refined", "Warm"], roles: ["impact", "essence", "human"], profile: { O: 82, C: 50, E: 75, A: 85, N: 45 }, keys: ["O", "E", "A"], fusion: "Self-care is your strategy, not your indulgence: the Lover’s brand glows from the inside out." },
    { id: "jester", num: 8, name: "The Jester", essence: "The entertainer: light is your tool and joy your medium.", work: "Depth alongside humour: let them laugh, then let them think.", wellness: "Play & joy", words: ["Electric", "Witty", "Alive"], roles: ["impact", "essence", "human"], profile: { O: 65, C: 45, E: 88, A: 55, N: 25 }, keys: ["E", "N"], fusion: "Play and joy are the maintenance plan: a Jester running on empty loses the spark that makes the brand." },
    { id: "everyman", num: 9, name: "The Everyman", essence: "The relatable expert: you lead by being real, and real is rare.", work: "Standing out: your plain-spoken clarity is the differentiator; own it.", wellness: "Rhythm & balance", words: ["Real", "Trusted", "Grounded"], roles: ["essence", "impact", "human"], profile: { O: 50, C: 55, E: 50, A: 85, N: 45 }, keys: ["A"], fusion: "Rhythm and balance keep you credible: the Everyman’s brand is a marathon walked with your people." },
    { id: "caregiver", num: 10, name: "The Caregiver", essence: "The coach and healer: people feel safer having you in their corner.", work: "Boundaries and visibility: you can’t pour from a brand that hides.", wellness: "Rest & boundaries", words: ["Caring", "Wise", "Safe"], roles: ["essence", "impact", "human"], profile: { O: 55, C: 60, E: 50, A: 92, N: 70 }, keys: ["A", "N"], fusion: "Rest and boundaries are part of the work: a Caregiver with margins can hold everyone, including themselves." },
    { id: "innocent", num: 11, name: "The Innocent", essence: "The optimistic minimalist: clarity and honesty are your aesthetic.", work: "A bolder voice: your calm deserves volume, too.", wellness: "Mindfulness & simplicity", words: ["Pure", "Honest", "Calm"], roles: ["impact", "essence", "human"], profile: { O: 60, C: 55, E: 45, A: 65, N: 15 }, keys: ["N", "O"], fusion: "Mindfulness and simplicity are your competitive edge: in a noisy market, your calm is the brand." },
    { id: "outlaw", num: 12, name: "The Outlaw", essence: "The disruptor: you break the pattern so something better can take its place.", work: "Coalition-building: even revolutions need allies.", wellness: "Channeling intensity", words: ["Fearless", "Unfiltered", "Disruptive"], roles: ["essence", "impact", "human"], profile: { O: 90, C: 45, E: 80, A: 20, N: 55 }, keys: ["O", "E", "A"], fusion: "Channel the intensity: an Outlaw’s brand burns bright only when the fire is aimed." }
  ];

  var FACTOR_NAMES = { O: "Openness", C: "Conscientiousness", E: "Extraversion", A: "Agreeableness", N: "Emotional intensity" };
  var TRAIT_BARS = [
    { f: "O", label: "Openness: imagination & ideas" },
    { f: "C", label: "Conscientiousness: follow-through" },
    { f: "E", label: "Extraversion: energy with people" },
    { f: "A", label: "Agreeableness: warmth & trust" },
    { f: "N", label: "Composure: calm under pressure", invert: true }
  ];
  var DRIVE_POOL = {
    O: ["Visionary", "Curious", "Original"],
    C: ["Proven", "Precise", "Dependable"],
    E: ["Magnetic", "Alive", "Dynamic"],
    A: ["Trusted", "Warm", "Generous"],
    N: ["Attuned", "Driven", "Instinctive"]
  };
  var GLOBAL_FALLBACK = ["Vivid", "Steady", "Radiant"];
  var PHRASES = {
    O: { high: "your wide-open imagination", low: "your practical, grounded taste", mid: "your measured openness to ideas" },
    C: { high: "your dependable follow-through", low: "your flexible, improvisational style", mid: "your balanced approach to structure" },
    E: { high: "your energy with people", low: "your thoughtful quiet", mid: "your easy balance of stage and study" },
    A: { high: "your warmth and trust in people", low: "your independent edge", mid: "your even-handed way with people" },
    N: { high: "your driven, restless intensity", low: "your steady calm", mid: "your even keel" }
  };



var COPY = {"note_label": "Based on your answers", "result_next_card": {"h3": "Want to talk through your result?", "p": "Our team can read your archetype and three words with you and say what we would work on first. Your result reaches us only if you choose to send it.", "primary_label": "Send my result to our team", "secondary_label": "Request a private 20-minute call"}, "optin": {"heading": "Want your report by email too?", "intro": "Your report is already yours to keep. If you also want it by email, with a short series for your archetype, you can add your email below. This is optional.", "consent_email": "Email me my report and the short series for my archetype.", "consent_whatsapp": "Message me on WhatsApp about my result.", "consent_share": "Share my archetype, three words and role with the Rise Personal team, so they can prepare if we speak.", "decline_label": "No thanks, keep my report", "privacy_note": "Each box is separate and starts unticked. You can say stop at any time, and we will delete your details if you ask. Our privacy and discretion page explains what we keep."}, "share_text": "I just took the Rise Personal Brand DNA Report. My archetype: {archetype}. My three words: {words}. It is free, takes about four minutes and nothing leaves your browser. {url}"};
  /* ---------- Report content: founder's notes, plays, trait lines ---------- */
  var FOUNDER_NOTES = {
    sage: "I meet many people who know more than they say. You are one of them. A Sage earns trust by making hard things clear, and your answers show the depth to do it. Your job now is to think out loud in public: one idea a week, finished and shared. Nobody is waiting for perfect. They are waiting for you to say it.",
    creator: "You make things that did not exist before, and that is rare. A Creator's risk is the drawer full of almost-finished work. I have seen brilliant people stay unknown for years because they kept polishing. Your brand will grow the day you ship, show the process and let people watch you make. Done is the masterpiece your ideas are waiting for.",
    ruler: "People feel it when you walk into a room. A Ruler carries authority without raising a voice, and your answers say the same about you. The way to make that last is to share the stage. The leaders people remember are the ones who made others look good in public. Let your team and your partners be seen next to you.",
    hero: "You are built for proof: results, momentum, a record people can point to. That is a strong place to build a brand from. The risk for a Hero is running a sprint every day until the engine burns out. Pick a pace you can keep for years and let the results speak at that rhythm. A long campaign beats a brilliant sprint.",
    explorer: "You go where others are still reading about it. An Explorer's brand is a journey people want to follow, but a journey needs a home base. Share what you found, not only where you are going next. Bring the story back, in one place, on a schedule. People follow explorers who return with something for them.",
    magician: "You see around corners and make the impossible feel inevitable. That is a gift, and it is also the trap: ten brilliant ideas and no signature. A Magician's brand gets strong when you pick the one trick and master it in public. Choose your one transformation, name it and repeat it until people say it for you.",
    lover: "You make people feel valued, and you notice beauty where others miss it. That is a real advantage in building trust. A Lover's brand grows through discernment: say no beautifully, so every yes means more. Protect your standards and your energy. The people who matter will feel the difference, and so will the market.",
    jester: "You bring light into a room, and people remember how you made them feel. That is hard to teach and easy to underestimate. A Jester's next level is depth next to the humour: let them laugh, then let them think. When people can trust you with the serious thing as well as the funny one, your brand becomes unusual.",
    everyman: "You are the person people trust because you are real, and real is rare. Everyman brands do not need a costume, they need clarity. Your plain, honest way of saying things is your edge, so own it. Do not copy the polished voice you see everywhere. Say it the way you would say it to a friend and let it travel.",
    caregiver: "People feel safer with you in their corner, and your answers say you carry a lot for others. A Caregiver's brand is built on trust, but it only lasts if you are visible and have boundaries. You cannot pour from a brand that hides. Let people see what you do, and protect the time that keeps you steady.",
    innocent: "You bring clarity and honesty to a noisy market, and that calm is your brand. An Innocent often under-uses their voice, because quiet can feel like not enough. It is enough. It just deserves more volume. Say the simple true thing more often and more boldly, and people will lean in.",
    outlaw: "You break patterns so something better can take their place. People remember Outlaws, which is a great start. The next step is allies. Even revolutions need coalitions, and the Outlaws who last are the ones who found their people early. Aim the fire at one target, name it, and invite others to stand with you."
  };

  var PLAYS = {
    sage:      { sound: "Calm and precise. Happy to say: it depends, and here is why.", show: "Talks, panels, long-form posts, small briefings.", prove: "A framework with your name on it and a case explained step by step." },
    creator:   { sound: "Original and unpolished on purpose. Show the making, not just the result.", show: "Portfolios, behind-the-scenes posts, launches, studio visits.", prove: "Finished work, shown regularly, with the story of how it was made." },
    ruler:     { sound: "Composed and decisive. Short sentences, clear calls.", show: "Boardrooms, keynotes, long-term partnerships, curated introductions.", prove: "Outcomes you led and the people you grew along the way." },
    hero:      { sound: "Direct and energetic. Say what you did and what happened next.", show: "Industry events, awards, case-study talks, short punchy updates.", prove: "Numbers, timelines and before-and-after results you can show." },
    explorer:  { sound: "Curious and open. First-person stories with a clear lesson.", show: "Field notes, travel-led content, community events, talks.", prove: "A body of journeys with one lesson each, on a steady schedule." },
    magician:  { sound: "Visionary but concrete. Name the shift, then show it.", show: "Demos, workshops, keynotes, first-of-its-kind launches.", prove: "One signature transformation, repeated with fresh proof each time." },
    lover:     { sound: "Warm, refined and selective. Quality over volume.", show: "Intimate events, curated content, brand collaborations.", prove: "Taste: a consistent look, a short list of partners, careful detail." },
    jester:    { sound: "Light and quick. A joke, then a point that sticks.", show: "Short video, live events, panels, podcasts, social.", prove: "Serious results delivered by someone people already enjoy." },
    everyman:  { sound: "Plain-spoken and friendly. The way you would explain it to a friend.", show: "Q&As, community talks, simple posts, one-to-one conversations.", prove: "Honest stories, clear steps and real client voices." },
    caregiver: { sound: "Warm, steady and specific. Name what the other person is feeling.", show: "Workshops, small-group sessions, newsletters, mentoring.", prove: "Stories of people you helped, told with their permission." },
    innocent:  { sound: "Simple and sincere. Fewer words, said with confidence.", show: "Clean visual posts, short essays, quiet and focused events.", prove: "Consistency: the same honest voice, week after week." },
    outlaw:    { sound: "Bold and unfiltered, aimed at a target, not at people.", show: "Manifestos, debates, disruptive launches, community movements.", prove: "A clear stand, and the allies who joined it." }
  };

  var TRAIT_LINES = {
    O: { high: "You see possibilities before others see problems.", mid: "You mix new ideas with what already works.", low: "You trust what is proven and make it work." },
    C: { high: "People can build on your word. You finish what you start.", mid: "You balance structure with room to move.", low: "You move by feel and adapt fast, which is useful in a changing market." },
    E: { high: "You gain energy from people and rooms, and it shows.", mid: "You are at ease on stage and in a quiet one-to-one.", low: "You think before you speak, and people listen when you do." },
    A: { high: "You make people feel safe, and trust follows you.", mid: "You are warm without being easy to push around.", low: "You say what others avoid saying, and that earns respect." },
    N: { high: "You stay steady when others rush.", mid: "You keep an even keel most of the time.", low: "You feel things deeply, which makes you attuned to people. You need rest to protect it." }
  };
  var TRAIT_EDGE = {
    O: "Make room for one new idea a week, so your brand keeps growing.",
    C: "Choose one thing to finish and share each week, so people see your follow-through.",
    E: "Pick one room a month where you speak first, so people hear you early.",
    A: "Start with one generous gesture in public each week, so people feel your warmth before your edge.",
    N: "Build one small ritual that restores you before big moments, so your calm shows."
  };
  var PAIR_LINES = {
    "OC": "You imagine well and you deliver, which is the combination investors and clients pay for.",
    "OE": "You bring big ideas into the room with energy. People remember who said it first.",
    "OA": "You are creative and kind. People trust your ideas because they trust you.",
    "ON": "You imagine freely and you stay steady. That lets you try bold things without losing the room.",
    "CE": "You are visible and dependable. Few people manage both.",
    "CA": "You are reliable and warm. People hand you important things and feel good doing it.",
    "CN": "You are organised and calm. You are the person people want next to them when it gets difficult.",
    "EA": "You are lively and generous. People feel welcome around you.",
    "EN": "You bring energy and keep your head. That makes you easy to follow.",
    "AN": "You are warm and composed. People feel safe telling you the truth."
  };
  var TRAIT_NAMES = { O: "Imagination", C: "Follow-through", E: "Energy with people", A: "Warmth and trust", N: "Composure" };

  var DAYS = function (p, w) {
    return [
      ["Day 1", "Write your three words on a card: " + w.join(", ") + ". Keep it where you work."],
      ["Day 2", "Rewrite your LinkedIn headline and first two lines of your About section using the three words."],
      ["Day 3", "Choose one room this month where you want to be seen: an event, a meeting, a talk. Book it."],
      ["Day 4", "Draft one piece of content that shows how you sound. " + p.sound],
      ["Day 5", "Ask three people to describe you in three words. Compare them with yours."],
      ["Day 6", "Publish the piece from Day 4. Add one line of proof: " + p.prove.toLowerCase()],
      ["Day 7", "Send your results to our team and tell us the one room you chose. We will start there."]
    ];
  };


  var KEY = "rp3_journey", KEY_RES = "rp3_result";
  var TOTAL = QUESTIONS.length + PICKS.length; // 22
  var state = load();
  function load() {
    try { var j = JSON.parse(localStorage.getItem(KEY)); if (j && j.v === 1) return j; } catch (e) {}
    return { v: 1, step: 0, answers: [], picks: {}, name: "" };
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function reset(keepName) { var n = keepName ? state.name : ""; state = { v: 1, step: 0, answers: [], picks: {}, name: n }; save(); }

  var screens = { intro: $("#s-intro"), quiz: $("#s-quiz"), res: $("#s-res") };
  var qcard = $("#qcard"), qfill = $("#qfill"), qlabel = $("#qlabel"), qpct = $("#qpct"), qbar = $("#qbar"), qnote = $("#qnote");
  var cur = 0, lock = false, noteT = null, shownPct = 0;

  function show(name) {
    var apply = function () {
      Object.keys(screens).forEach(function (k) { screens[k].hidden = k !== name; });
      var top = $("#app"); if (top) top.scrollIntoView({ behavior: "auto", block: "start" });
    };
    if (document.startViewTransition && !reduced) document.startViewTransition(apply); else apply();
  }

  /* ---------- intro ---------- */
  var resume = $("#resume");
  function initIntro() {
    var has = state.step > 0 && state.step < TOTAL + 1;
    if (resume) resume.hidden = !has;
    if (state.step >= TOTAL) { var r = null; try { r = localStorage.getItem(KEY_RES); } catch (e) {} if (r) { renderResults(); show("res"); return; } }
  }
  var nameIn = $("#in-name"); if (nameIn && state.name) nameIn.value = state.name;
  $("#btn-begin").addEventListener("click", function () { try { if (RP.track) RP.track("quiz_start", {}); } catch (e) {} var n = nameIn ? nameIn.value.trim().slice(0, 30) : ""; reset(); state.name = n; save(); show("quiz"); renderStep(0); });
  if ($("#btn-resume")) $("#btn-resume").addEventListener("click", function () { show("quiz"); renderStep(Math.min(state.step, TOTAL - 1)); });

  /* ---------- steps ---------- */
  var TAGS = { O: "Ideas and imagination", C: "Focus and follow-through", E: "Energy and people", A: "Warmth and trust", N: "Steadiness under pressure" };
  var NOTES = { 5: "A quarter done. First instincts are the most honest ones.", 10: "Halfway. Your pattern is starting to show.", 15: "Three quarters in. Five to go.", 19: "Last statement. Then two quick choices.", 20: "Two choices left: how you want people to feel, and what they should remember." };

  function stepHTML(i) {
    var h;
    if (i < QUESTIONS.length) {
      var q = QUESTIONS[i];
      h = '<span class="tag">' + TAGS[q.f] + '</span><p class="q-q" id="qtext">' + q.t + '</p><div class="q-opts" role="group" aria-labelledby="qtext">';
      LIKERT.forEach(function (label, idx) {
        var v = idx + 1, sel = state.answers[i] === v ? " sel" : "";
        h += '<button type="button" class="q-opt' + sel + '" style="--n:' + idx + '" data-i="' + i + '" data-v="' + v + '"><i></i><span class="k">' + v + '</span>' + label + "</button>";
      });
      h += "</div>";
    } else {
      var p = PICKS[i - QUESTIONS.length];
      h = '<span class="tag">' + p.tag + '</span><p class="q-q" id="qtext">' + p.t + '</p><div class="q-opts" role="group" aria-labelledby="qtext">';
      p.opts.forEach(function (o, idx) {
        var sel = state.picks[p.id] === o.k ? " sel" : "";
        h += '<button type="button" class="q-opt big' + sel + '" style="--n:' + idx + '" data-pick="' + p.id + '" data-k="' + o.k + '"><i></i><span><b>' + o.label + "</b><small>" + o.sub + "</small></span></button>";
      });
      h += "</div>";
    }
    var back = i > 0 ? '<button type="button" class="btn-link" data-back="' + (i - 1) + '">← Back</button>' : "<span></span>";
    return h + '<div class="q-foot">' + back + '<span class="hint">' + (i < QUESTIONS.length ? "Keys 1 to 5 answer. Left arrow goes back." : "Pick the one that feels most like you.") + "</span></div>";
  }

  function meta(i, instant) {
    var pct = Math.round(((i + 1) / TOTAL) * 100);
    qfill.style.inlineSize = pct + "%";
    qbar.setAttribute("aria-valuenow", String(pct));
    var label = i < QUESTIONS.length ? "Question " + (i + 1) + " of 20" : "Final choices";
    if (instant || reduced) { qlabel.textContent = label; qpct.textContent = pct + "%"; shownPct = pct; return; }
    qlabel.classList.add("swap");
    setTimeout(function () { qlabel.textContent = label; qlabel.classList.remove("swap"); }, 150);
    var from = shownPct, t0 = null;
    (function tick(ts) {
      if (!t0) t0 = ts;
      var k = Math.min((ts - t0) / 420, 1), e = 1 - Math.pow(1 - k, 3);
      shownPct = Math.round(from + (pct - from) * e); qpct.textContent = shownPct + "%";
      if (k < 1) requestAnimationFrame(tick); else { shownPct = pct; qpct.textContent = pct + "%"; }
    })(performance.now());
  }
  function note(i, dir) {
    clearTimeout(noteT);
    if (dir > 0 && NOTES[i]) { qnote.textContent = NOTES[i]; qnote.classList.add("show"); noteT = setTimeout(function () { qnote.classList.remove("show"); }, 3200); }
    else qnote.classList.remove("show");
  }

  function renderStep(i) {
    lock = false; cur = i; meta(i, true); note(i, 0);
    qcard.style.blockSize = "";
    qcard.innerHTML = '<div class="qin in">' + stepHTML(i) + "</div>";
  }
  function goTo(i, dir) {
    if (i < 0) i = 0;
    if (i >= TOTAL) { state.step = TOTAL; save(); finish(); return; }
    if (reduced) { renderStep(i); return; }
    lock = true; cur = i; meta(i, false);
    var old = qcard.firstElementChild, h0 = qcard.offsetHeight;
    qcard.style.blockSize = h0 + "px";
    if (old) { old.style.setProperty("--dir", dir); old.classList.add("out"); }
    setTimeout(function () {
      var inner = document.createElement("div");
      inner.className = "qin pre"; inner.style.setProperty("--dir", dir); inner.innerHTML = stepHTML(i);
      qcard.innerHTML = ""; qcard.appendChild(inner);
      qcard.style.blockSize = "auto"; var h1 = qcard.offsetHeight;
      qcard.style.blockSize = h0 + "px"; void qcard.offsetHeight; qcard.style.blockSize = h1 + "px";
      requestAnimationFrame(function () { requestAnimationFrame(function () { inner.classList.remove("pre"); inner.classList.add("in"); }); });
      note(i, dir);
      setTimeout(function () { lock = false; }, 300);
      setTimeout(function () { qcard.style.blockSize = ""; var qt = $(".q-q", qcard); if (qt) { qt.setAttribute("tabindex", "-1"); try { qt.focus({ preventScroll: true }); } catch (e) {} } }, 440);
    }, 210);
  }

  qcard.addEventListener("click", function (ev) {
    var t = ev.target.closest("button"); if (!t || lock) return;
    if (t.dataset.back !== undefined) { goTo(parseInt(t.dataset.back, 10), -1); return; }
    if (t.dataset.v) {
      var i = parseInt(t.dataset.i, 10);
      state.answers[i] = parseInt(t.dataset.v, 10); state.step = Math.max(state.step, i + 1); save();
      $$(".q-opt", qcard).forEach(function (b) { b.classList.toggle("sel", b === t); });
      lock = true; setTimeout(function () { lock = false; goTo(i + 1, 1); }, reduced ? 120 : 340);
    } else if (t.dataset.pick) {
      var id = t.dataset.pick; state.picks[id] = t.dataset.k;
      var idx = QUESTIONS.length + PICKS.findIndex(function (p) { return p.id === id; });
      state.step = Math.max(state.step, idx + 1); save();
      $$(".q-opt", qcard).forEach(function (b) { b.classList.toggle("sel", b === t); });
      lock = true; setTimeout(function () { lock = false; goTo(idx + 1, 1); }, reduced ? 120 : 380);
    }
  });
  document.addEventListener("keydown", function (ev) {
    if (screens.quiz.hidden || lock) return;
    var n = parseInt(ev.key, 10);
    if (cur < QUESTIONS.length && n >= 1 && n <= 5) { var b = $('.q-opt[data-v="' + n + '"]', qcard); if (b) b.click(); }
    else if (ev.key === "ArrowLeft" && cur > 0) goTo(cur - 1, -1);
  });

  function finish() {
    var out = $("#res-body");
    var steps = ["Reading your 20 answers", "Matching you against the 12 archetypes", "Choosing your three words", "Writing your note from our founder"];
    if (reduced) { renderResults(); show("res"); return; }
    out.innerHTML = '<div class="reveal-load"><p class="eyebrow">One moment' + (state.name ? ", " + state.name : "") + '</p><h2>Building your Brand DNA Report</h2><ul class="rl-steps">' + steps.map(function (t, i) { return '<li style="--i:' + i + '"><i></i>' + t + "</li>"; }).join("") + '</ul><div class="rl-bar"><i></i></div></div>';
    show("res");
    var lis = $$(".rl-steps li", out), k = 0;
    (function next() {
      if (k > 0) lis[k - 1].classList.add("done");
      if (k >= lis.length) { setTimeout(function () { renderResults(true); }, 450); return; }
      lis[k].classList.add("on"); $(".rl-bar i", out).style.inlineSize = ((k + 1) / lis.length * 100) + "%"; k++;
      setTimeout(next, 800);
    })();
  }

  /* ---------- scoring ---------- */
  function scores() {
    var sums = { O: 0, C: 0, E: 0, A: 0, N: 0 };
    QUESTIONS.forEach(function (q, i) { var raw = state.answers[i] || 3; sums[q.f] += q.r ? raw : 6 - raw; });
    var out = {}; Object.keys(sums).forEach(function (f) { out[f] = Math.round(((sums[f] - 4) / 16) * 100); }); return out;
  }
  function matchArchetypes(sc) {
    var ranked = ARCHETYPES.map(function (a) {
      var d = 0; ["O", "C", "E", "A", "N"].forEach(function (f) { var w = a.keys.indexOf(f) >= 0 ? 2 : 1; d += w * Math.pow(sc[f] - a.profile[f], 2); });
      return { a: a, d: Math.sqrt(d) };
    });
    ranked.sort(function (x, y) { return x.d - y.d || x.a.num - y.a.num; });
    return { primary: ranked[0].a, secondary: ranked[1].a };
  }
  function matchNote(arch, sc) {
    var bits = arch.keys.map(function (f) {
      var diff = Math.abs(sc[f] - arch.profile[f]), dir = arch.profile[f] >= 65 ? "high" : (arch.profile[f] <= 35 ? "low" : "mid");
      return { diff: diff, txt: PHRASES[f][dir] };
    }).sort(function (x, y) { return x.diff - y.diff; }).slice(0, 2);
    return "Matched by <b>" + bits[0].txt + "</b>" + (bits[1] ? " and <b>" + bits[1].txt + "</b>" : "") + ", the defining notes of " + arch.name + ".";
  }
  function threeWords(prim, sec, sc) {
    var feel = PICKS[0].opts.find(function (o) { return o.k === state.picks.feel; }) || PICKS[0].opts[0];
    var rem = PICKS[1].opts.find(function (o) { return o.k === state.picks.remember; }) || PICKS[1].opts[0];
    var w1 = prim.words[prim.roles.indexOf(feel.role)], w2 = sec.words[sec.roles.indexOf(rem.role)];
    var topF = ["O", "C", "E", "A", "N"].slice().sort(function (x, y) { return sc[y] - sc[x]; })[0];
    var used = [w1.toLowerCase(), w2.toLowerCase()];
    function pickFrom(pool) { for (var i = 0; i < pool.length; i++) if (used.indexOf(pool[i].toLowerCase()) < 0) return pool[i]; return null; }
    var w3 = pickFrom(DRIVE_POOL[topF]) || pickFrom(GLOBAL_FALLBACK) || "Vivid";
    return [
      { w: w1, why: "From your primary current, " + prim.name + ". You want people to feel “" + feel.label.toLowerCase() + "”, and “" + w1 + "” carries exactly that." },
      { w: w2, why: "Your secondary current, " + sec.name + ". You want to be remembered as “" + rem.label.toLowerCase() + "”, and “" + w2 + "” is that note in you." },
      { w: w3, why: "Your strongest trait: " + FACTOR_NAMES[topF] + " at " + sc[topF] + "/100. “" + w3 + "” is its word." }
    ];
  }
  function pad(n) { return n < 10 ? "0" + n : String(n); }

  /* ---------- results ---------- */
  function vals(sc) { return { O: sc.O, C: sc.C, E: sc.E, A: sc.A, N: 100 - sc.N }; }
  function band(v) { return v >= 65 ? "high" : (v <= 35 ? "low" : "mid"); }
  function analyse(sc) {
    var v = vals(sc), keys = ["O", "C", "E", "A", "N"];
    var byHigh = keys.slice().sort(function (a, b) { return v[b] - v[a]; });
    var top = byHigh[0], low = byHigh[4];
    var pair = [byHigh[0], byHigh[1]].sort(function (a, b) { return keys.indexOf(a) - keys.indexOf(b); }).join("");
    return { v: v, top: top, low: low, second: byHigh[1], pair: pair, strong: TRAIT_LINES[top][band(v[top])], pairLine: PAIR_LINES[pair], edge: TRAIT_EDGE[low] };
  }
  function plain(h) { return h.replace(/<[^>]+>/g, ""); }

  function composeNote(p, s, sc, words) {
    var a = analyse(sc);
    var feel = PICKS[0].opts.find(function (o) { return o.k === state.picks.feel; }) || PICKS[0].opts[0];
    var rem = PICKS[1].opts.find(function (o) { return o.k === state.picks.remember; }) || PICKS[1].opts[0];
    var w = words.map(function (x) { return x.w; });
    return {
      greet: state.name ? "Dear " + state.name + "," : "Dear friend,",
      paras: [
        FOUNDER_NOTES[p.id],
        "Your answers told me something specific too. " + a.strong + " " + TRAIT_NAMES[a.top] + " is your strongest signal, at " + a.v[a.top] + " out of 100. " + a.pairLine,
        "You told me you want people to feel " + feel.label.toLowerCase() + " and to remember you as " + rem.label.toLowerCase() + ". Your three words are " + w[0] + ", " + w[1] + " and " + w[2] + ". The first carries what you want people to feel, the second what you want them to remember, and the third is the word your answers earned on their own, the one that makes you hard to copy.",
        "One thing to watch: your lowest signal is " + TRAIT_NAMES[a.low].toLowerCase() + ". " + a.edge,
        "I built Rise Personal for this exact moment, when you stop guessing about your brand and start choosing it. If you want to talk it through, send us your results and tell us the one room you want to be known in. We will start there."
      ],
      sign: "Mohamed El Sawaf", role: "Founder, Rise Personal"
    };
  }

  var CUR = null; // last computed result, used by the PDF and card
  var CFG = (window.RP && window.RP.CFG) || {};
  var CP = (typeof COPY !== "undefined" && COPY) || {};
  function cpy(k, d) { return (CP[k] !== undefined && CP[k] !== null) ? CP[k] : d; }
  var NEXT = cpy("result_next_card", { h3: "Your next step", p: "Send your result to our team, or book a private 20-minute debrief of your report.", primary_label: "Send my result to our team", secondary_label: "Book a 20-minute debrief" });
  var NOTE_LABEL = cpy("note_label", "A note from the founder, based on your answers");
  var OPTIN = cpy("optin", { heading: "Want this by email, with a short series for your archetype?", intro: "Optional. Your report is already yours to keep.", consent_email: "Email me my report and a short series for my archetype.", consent_whatsapp: "Message me on WhatsApp about my result.", consent_share: "Share my archetype and three words with the team so they can prepare for a call.", decline_label: "No thanks, keep my report", privacy_note: "We use these details only for what you tick. You can ask us to delete them at any time." });
  function T(name, props) { try { if (window.RP && RP.track) RP.track(name, props || {}); } catch (e) {} }
  function renderResults(animate) {
    var sc = scores(), m = matchArchetypes(sc), p = m.primary, s = m.secondary, words = threeWords(p, s, sc), nt = matchNote(p, sc);
    var a = analyse(sc), note = composeNote(p, s, sc, words), plays = PLAYS[p.id], w3 = words.map(function (x) { return x.w; });
    CUR = { sc: sc, p: p, s: s, words: words, nt: nt, a: a, note: note, plays: plays, days: DAYS(plays, w3) };
    try { localStorage.setItem(KEY_RES, JSON.stringify({ primary: p.id, secondary: s.id, words: w3, scores: sc })); } catch (e) {}
    state.step = TOTAL + 1; save();

    var bars = TRAIT_BARS.map(function (t) {
      var val = t.invert ? 100 - sc[t.f] : sc[t.f];
      return '<div class="trait"><span class="tname">' + t.label + '</span><span class="tscore" data-n="' + val + '">' + (animate && !reduced ? 0 : val) + '</span><div class="tbar"><i data-w="' + val + '"></i></div></div>';
    }).join("");
    var why = words.map(function (x) { return "<li><b>" + x.w + "</b><span>" + x.why + "</span></li>"; }).join("");
    var days = CUR.days.map(function (d) { return "<li><b>" + d[0] + "</b><span>" + d[1] + "</span></li>"; }).join("");
    var msg = "Hello Rise Personal team, I got my Brand DNA Report" + (state.name ? " (" + state.name + ")" : "") + ". My archetype is " + p.name + " (secondary: " + s.name + "). My three words: " + w3.join(", ") + ". The one room I want to be known in is: ";
    var dmsg = "Hello Rise Personal team, I would like to book a 20-minute debrief of my Brand DNA Report. My archetype is " + p.name + " and my three words are " + w3.join(", ") + ". My best times and my time zone are: ";
    var capture = !!CFG.captureUrl;
    var paras = note.paras.map(function (t) { return "<p>" + t + "</p>"; }).join("");
    var out = $("#res-body");
    out.innerHTML =
      '<div class="res-top rv-step" style="--s:0"><span class="badge">Archetype unlocked</span><p class="eyebrow">Your Brand DNA Report is ready' + (state.name ? ", " + state.name : "") + "</p></div>" +
      '<div class="dl-card rv-step" style="--s:1"><div><h3>Your report, to keep</h3><p>Six branded pages: your archetype, five currents, three words, a note from our founder and a 7-day plan.</p></div><div class="dl-act"><button class="btn btn-ink btn-lg" id="btn-pdf" type="button">Download your report (PDF)</button><button class="btn btn-ghost" id="btn-share" type="button">Share this archetype</button><button class="btn btn-ghost" id="btn-png" type="button">Download share card</button></div><p class="dl-st" id="dl-st" aria-live="polite"></p></div>' +
      '<div class="arch-card rv-step" style="--s:2"><span class="arch-num">Archetype ' + pad(p.num) + ' of 12</span>' +
      '<h2 class="arch-name">' + p.name + '</h2><p class="arch-essence">' + p.essence + "</p>" +
      '<p class="words-head">Your 3 words</p><p class="threewords"><em>' + w3[0] + "</em> · <em>" + w3[1] + "</em> · <em>" + w3[2] + "</em></p>" +
      '<ul class="word-why">' + why + "</ul>" +
      '<div class="arch-split"><div class="arch-box"><h4>What to work on</h4><p>' + p.work + '</p></div><div class="arch-box"><h4>Wellness pairing</h4><p>' + p.wellness + "</p></div></div>" +
      '<div class="fusion"><div class="fx">Wellness × Brand</div><p>' + p.fusion + "</p></div>" +
      '<p class="match-note">' + nt + "</p></div>" +
      '<div class="next-card rv-step" style="--s:2"><div><h3>' + NEXT.h3 + '</h3><p>' + NEXT.p + '</p></div><div class="res-actions"><a class="btn btn-wa" data-wa data-track="result_wa_click" data-where="result_top" data-msg="' + msg.replace(/"/g, "&quot;") + '" href="' + waUrl(msg) + '" rel="noopener">' + NEXT.primary_label + '</a><a class="btn btn-ghost" data-wa data-track="debrief_click" data-where="result_top" data-msg="' + dmsg.replace(/"/g, "&quot;") + '" href="' + waUrl(dmsg) + '" rel="noopener">' + NEXT.secondary_label + '</a></div></div>' +
      (capture ? '<form class="optin rv-step" id="optin" style="--s:3" novalidate><h3>' + OPTIN.heading + '</h3><p>' + OPTIN.intro + '</p><div class="oi-grid"><label>First name<input name="name" type="text" maxlength="40" autocomplete="given-name" value="' + (state.name || "").replace(/"/g, "&quot;") + '"></label><label>Email<input name="email" type="email" maxlength="120" autocomplete="email"></label><label>WhatsApp number<input name="wa" type="tel" maxlength="30" autocomplete="tel" placeholder="+971 50 000 0000"></label></div><label class="ck"><input type="checkbox" name="c_email"> <span>' + OPTIN.consent_email + '</span></label><label class="ck"><input type="checkbox" name="c_wa"> <span>' + OPTIN.consent_whatsapp + '</span></label><label class="ck"><input type="checkbox" name="c_share"> <span>' + OPTIN.consent_share + '</span></label><p class="oi-note">' + OPTIN.privacy_note + ' <a href="privacy-and-discretion.html">Privacy and discretion</a></p><div class="res-actions"><button class="btn btn-ink" type="submit">Send</button><button class="btn-link" type="button" id="oi-no">' + OPTIN.decline_label + '</button></div><p class="dl-st" id="oi-st" aria-live="polite"></p></form>' : "") +
      '<div class="note-card rv-step" style="--s:3"><div class="note-head"><img src="assets/sawaf.jpg" alt="Mohamed El Sawaf" width="72" height="90"><div><p class="eyebrow">A note from the founder</p><h3>' + NOTE_LABEL + '</h3></div></div>' +
      '<p class="note-greet">' + note.greet + "</p>" + paras + '<p class="note-sign"><b>' + note.sign + "</b><span>" + note.role + "</span></p></div>" +
      '<div class="plays rv-step" style="--s:4"><div class="play"><h4>Sound like</h4><p>' + plays.sound + '</p></div><div class="play"><h4>Show up here</h4><p>' + plays.show + '</p></div><div class="play"><h4>Prove it with</h4><p>' + plays.prove + "</p></div></div>" +
      '<div class="res-two rv-step" style="--s:5"><div class="traits-card"><h3>Your five currents</h3><p class="sub">Normalised from your 20 answers (0 to 100). They chose your archetype.</p>' + bars + "</div>" +
      '<div class="second-card"><h3>Your secondary current</h3><p class="sc-name">' + s.name + "</p><p>" + s.essence + " Its notes, " + s.words.join(", ") + ", colour your brand at the edges.</p>" +
      '<a class="btn-link" href="archetypes.html#' + s.id + '">Read about ' + s.name + " →</a></div></div>" +
      '<div class="plan-card rv-step" style="--s:6"><h3>Your first 7 days</h3><ol class="plan">' + days + "</ol></div>" +
      '<div class="res-cta-card rv-step" style="--s:7"><h3>Now turn it into a position.</h3><p>Send your result to our team and tell us the one room you want to be known in. We will start there.</p>' +
      '<div class="res-actions"><a class="btn btn-wa" data-wa data-track="result_wa_click" data-where="result_bottom" href="' + waUrl(msg) + '" data-msg="' + msg.replace(/"/g, "&quot;") + '" rel="noopener">Send my result to our team</a>' +
      '<a class="btn btn-ghost-light" data-wa data-track="debrief_click" data-where="result_bottom" href="' + waUrl(dmsg) + '" data-msg="' + dmsg.replace(/"/g, "&quot;") + '" rel="noopener">Book a 20-minute debrief</a>' +
      '<button class="btn btn-ghost-light" id="btn-retake" type="button">Retake</button></div>' +
      '<p class="res-foot">' + (capture ? "Your answers stay in this browser unless you choose to share them above." : "Your answers stayed in this browser.") + ' <button class="btn-link light" id="btn-clear" type="button">Clear my data</button> Not a clinical or hiring test: a starting point for a conversation about your brand. <a href="archetypes.html#' + p.id + '">Read about ' + p.name + "</a> · <a href=\"archetypes.html\">All 12 archetypes</a></p></div>";
    requestAnimationFrame(function () {
      setTimeout(function () { $$(".tbar i", out).forEach(function (el) { el.style.inlineSize = el.dataset.w + "%"; }); }, 200);
      if (animate && !reduced) { countUp(out); burst(); }
    });
    $("#btn-retake").addEventListener("click", function () { reset(true); show("quiz"); renderStep(0); });
    $("#btn-png").addEventListener("click", function () { T("card_download", { archetype: p.id }); downloadCard(p, words); });
    $("#btn-pdf").addEventListener("click", function () { T("pdf_download", { archetype: p.id }); makeReport(); });
    $("#btn-share").addEventListener("click", function () { T("share_click", { archetype: p.id }); shareArch(p); });
    $("#btn-clear").addEventListener("click", function () { try { localStorage.removeItem(KEY); localStorage.removeItem(KEY_RES); } catch (e) {} state = { v: 1, step: 0, answers: [], picks: {}, name: "" }; location.href = "brand-dna-report.html"; });
    if (animate) T("quiz_complete", { archetype: p.id });
    var of = $("#optin"); if (of) wireOptin(of, p, s, w3, sc);
  }

  function shareArch(p) {
    var u = new URL("archetype-" + p.id + ".html", location.href); u.search = "ref=share";
    var data = { title: "I am " + p.name + " | Rise Personal", text: cpy("share_text", "I just got my Brand DNA Report. My brand archetype is " + p.name + ". Find yours in four minutes:"), url: u.href };
    if (navigator.share) { navigator.share(data).catch(function () {}); return; }
    var st = $("#dl-st"); var done = function () { if (st) st.textContent = "Link copied. Paste it anywhere to share."; };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(data.text + " " + data.url).then(done, function () { if (st) st.textContent = data.url; });
    else if (st) st.textContent = data.url;
  }

  /* Optional, consented lead step. Rendered only when a capture endpoint is configured (config.js). Nothing is sent without a ticked box. */
  function wireOptin(form, p, s, w3, sc) {
    var st = $("#oi-st"), busy = false;
    $("#oi-no").addEventListener("click", function () { form.hidden = true; T("optin_decline", {}); });
    form.addEventListener("submit", function (e) {
      e.preventDefault(); if (busy) return;
      var f = form.elements, ce = f.c_email.checked, cw = f.c_wa.checked, cs = f.c_share.checked;
      var email = f.email.value.trim(), wa = f.wa.value.trim(), name = f.name.value.trim();
      if (!ce && !cw && !cs) { st.textContent = "Tick at least one box so we know what you agree to, or choose No thanks."; return; }
      if (ce && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { st.textContent = "Please add a valid email address."; return; }
      if (cw && wa.replace(/\D/g, "").length < 8) { st.textContent = "Please add your WhatsApp number with the country code."; return; }
      if (!ce && !cw) { st.textContent = "Add an email or WhatsApp box so we can reach you."; return; }
      var payload = { source: "brand-dna-report", submitted: new Date().toISOString(), name: name, email: ce ? email : "", whatsapp: cw ? wa : "", consent: { email: ce, whatsapp: cw, share_result: cs }, ref: (new URLSearchParams(location.search)).get("ref") || "" };
      if (cs) { payload.result = { archetype: p.id, secondary: s.id, words: w3, scores: sc }; }
      busy = true; st.textContent = "Sending…";
      fetch(CFG.captureUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), mode: "cors" }).then(function (r) {
        if (!r.ok) throw new Error("bad"); st.textContent = "Thank you. We have your details and will use them only as you ticked."; form.querySelectorAll("input,button").forEach(function (x) { x.disabled = true; }); T("optin_submit", { email: ce, whatsapp: cw, share: cs });
      }).catch(function () { st.textContent = "That did not go through. Please try again, or message us on WhatsApp."; busy = false; });
    });
  }

  function countUp(root) {
    $$(".tscore", root).forEach(function (el) {
      var to = parseInt(el.dataset.n, 10), t0 = null;
      (function tick(ts) { if (!t0) t0 = ts; var k = Math.min((ts - t0) / 1100, 1), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(to * e); if (k < 1) requestAnimationFrame(tick); })(performance.now());
    });
  }
  function burst() {
    var host = $(".arch-card"); if (!host) return;
    var r = host.getBoundingClientRect(), cols = ["#0170FD", "#7710D1", "#6FB0FF", "#C79BFF"];
    for (var i = 0; i < 26; i++) {
      var d = document.createElement("i"); d.className = "spark";
      var ang = Math.random() * Math.PI * 2, dist = 90 + Math.random() * 190;
      d.style.cssText = "left:" + (r.left + r.width / 2) + "px;top:" + (r.top + Math.min(r.height / 2, 260) + window.scrollY) + "px;background:" + cols[i % 4] + ";--dx:" + Math.cos(ang) * dist + "px;--dy:" + Math.sin(ang) * dist + "px";
      document.body.appendChild(d); setTimeout((function (n) { return function () { n.remove(); }; })(d), 1400);
    }
  }

  /* ---------- shareable PNG ---------- */
  function wrapText(x, text, cx, y, maxW, lh) {
    var ws = text.split(" "), line = "", lines = [];
    for (var i = 0; i < ws.length; i++) { var t = line ? line + " " + ws[i] : ws[i]; if (x.measureText(t).width > maxW && line) { lines.push(line); line = ws[i]; } else line = t; }
    if (line) lines.push(line);
    lines.forEach(function (l, k) { x.fillText(l, cx, y + k * lh); });
  }
  function downloadCard(p, words) {
    var W = 1080, H = 1350, c = document.createElement("canvas"); c.width = W; c.height = H;
    var x = c.getContext("2d"), blue = "#6FB0FF", ivory = "#E6E6E6", mut = "rgba(230,230,230,.8)";
    x.fillStyle = "#1A1A1A"; x.fillRect(0, 0, W, H);
    var g = x.createRadialGradient(W * .2, 0, 0, W * .2, 0, W); g.addColorStop(0, "rgba(1,112,253,.35)"); g.addColorStop(1, "rgba(1,112,253,0)"); x.fillStyle = g; x.fillRect(0, 0, W, H);
    var g2 = x.createRadialGradient(W * .9, H * .2, 0, W * .9, H * .2, W * .8); g2.addColorStop(0, "rgba(119,16,209,.35)"); g2.addColorStop(1, "rgba(119,16,209,0)"); x.fillStyle = g2; x.fillRect(0, 0, W, H);
    x.strokeStyle = "rgba(111,176,255,.5)"; x.lineWidth = 2; x.strokeRect(40, 40, W - 80, H - 80);
    x.textAlign = "center";
    x.fillStyle = blue; x.font = "600 26px 'Source Sans 3', Arial, sans-serif"; x.fillText("R I S E   P E R S O N A L   ·   B R A N D   D N A", W / 2, 150);
    x.font = "600 32px 'Alumni Sans', Arial, sans-serif"; x.fillText("Archetype " + pad(p.num) + " of 12", W / 2, 330);
    var bg = x.createLinearGradient(W * .2, 460, W * .8, 320); bg.addColorStop(0, "#0170FD"); bg.addColorStop(1, "#B070FF");
    x.fillStyle = bg; x.font = "800 130px 'Alumni Sans', Arial, sans-serif"; x.fillText(p.name, W / 2, 460);
    x.font = "400 34px 'Source Sans 3', Arial, sans-serif"; x.fillStyle = mut; wrapText(x, p.essence, W / 2, 545, W - 300, 44);
    x.fillStyle = "rgba(111,176,255,.6)"; x.fillRect(W / 2 - 60, 720, 120, 2);
    x.fillStyle = blue; x.font = "600 26px 'Source Sans 3', Arial, sans-serif"; x.fillText("Y O U R   3   W O R D S", W / 2, 800);
    x.fillStyle = ivory; x.font = "800 86px 'Alumni Sans', Arial, sans-serif"; x.fillText(words[0].w + "  ·  " + words[1].w + "  ·  " + words[2].w, W / 2, 910);
    x.fillStyle = blue; x.font = "600 24px 'Source Sans 3', Arial, sans-serif"; x.fillText("WELLNESS × BRAND", W / 2, 1035);
    x.font = "400 32px 'Source Sans 3', Arial, sans-serif"; x.fillStyle = mut; wrapText(x, p.wellness + ". " + p.fusion, W / 2, 1088, W - 260, 42);
    x.fillStyle = blue; x.font = "600 24px 'Source Sans 3', Arial, sans-serif"; x.fillText("risepersonal.com", W / 2, H - 100);
    var a = document.createElement("a"); a.download = "risepersonal-brand-dna-" + p.id + ".png"; a.href = c.toDataURL("image/png");
    document.body.appendChild(a); a.click(); a.remove();
  }

  /* ---------- the PDF report (drawn on canvas, packed into a PDF in the browser) ---------- */
  var PW = 1240, PH = 1754, INK = "#1A1A1A", BL = "#0170FD", BLI = "#0A5BCB", BLL = "#6FB0FF", PU = "#7710D1";
  function loadImg(src) { return new Promise(function (res) { var i = new Image(); i.onload = function () { res(i); }; i.onerror = function () { res(null); }; i.src = src; }); }
  function newPage(dark) {
    var c = document.createElement("canvas"); c.width = PW; c.height = PH; var x = c.getContext("2d");
    x.fillStyle = dark ? INK : "#F6F6F4"; x.fillRect(0, 0, PW, PH);
    if (dark) {
      var g = x.createRadialGradient(PW * .15, 0, 0, PW * .15, 0, PW * 1.1); g.addColorStop(0, "rgba(1,112,253,.38)"); g.addColorStop(1, "rgba(1,112,253,0)"); x.fillStyle = g; x.fillRect(0, 0, PW, PH);
      var g2 = x.createRadialGradient(PW * .95, PH * .25, 0, PW * .95, PH * .25, PW * .9); g2.addColorStop(0, "rgba(119,16,209,.38)"); g2.addColorStop(1, "rgba(119,16,209,0)"); x.fillStyle = g2; x.fillRect(0, 0, PW, PH);
    } else {
      var gt = x.createLinearGradient(0, 0, PW, 0); gt.addColorStop(0, BL); gt.addColorStop(1, PU); x.fillStyle = gt; x.fillRect(0, 0, PW, 14);
    }
    return { c: c, x: x };
  }
  function lines(x, text, maxW) {
    var ws = String(text).split(" "), line = "", out = [];
    for (var i = 0; i < ws.length; i++) { var t = line ? line + " " + ws[i] : ws[i]; if (x.measureText(t).width > maxW && line) { out.push(line); line = ws[i]; } else line = t; }
    if (line) out.push(line); return out;
  }
  function para(x, text, px, y, maxW, lh, font, color) {
    x.font = font; x.fillStyle = color; x.textAlign = "left";
    var ls = lines(x, text, maxW); ls.forEach(function (l, i) { x.fillText(l, px, y + i * lh); }); return y + ls.length * lh;
  }
  function pageFoot(pg, n, dark, imgs) {
    var x = pg.x; x.textAlign = "left"; x.font = "600 22px 'Source Sans 3', Arial, sans-serif"; x.fillStyle = dark ? "rgba(230,230,230,.7)" : "rgba(26,26,26,.6)";
    x.fillText("risepersonal.com", 90, PH - 70); x.textAlign = "right"; x.fillText("Brand DNA Report · " + n + " / 6", PW - 90, PH - 70); x.textAlign = "left";
    var lg = dark ? imgs.logoDark : imgs.logoLight; if (lg && n > 1) x.drawImage(lg, PW / 2 - 70, PH - 112, 140, 42);
  }
  function title(pg, kicker, h) {
    var x = pg.x; x.textAlign = "left"; x.font = "700 24px 'Source Sans 3', Arial, sans-serif"; x.fillStyle = BLI; x.fillText(kicker.toUpperCase().split("").join(" "), 90, 130);
    x.font = "800 96px 'Alumni Sans', Arial, sans-serif"; x.fillStyle = INK; x.fillText(h, 90, 225); return 280;
  }
  function gradText(x, txt, px, y, size, w) {
    var g = x.createLinearGradient(px, y - size, px + w, y); g.addColorStop(0, BL); g.addColorStop(1, "#B070FF"); x.fillStyle = g; x.font = "800 " + size + "px 'Alumni Sans', Arial, sans-serif"; x.fillText(txt, px, y);
  }

  function drawReport(imgs) {
    var R = CUR, p = R.p, s = R.s, w3 = R.words.map(function (x) { return x.w; }), pages = [], pg, x, y;
    var dateStr = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

    // 1 · cover
    pg = newPage(true); x = pg.x;
    if (imgs.logoDark) x.drawImage(imgs.logoDark, 90, 90, 330, 99);
    x.textAlign = "left"; x.font = "700 26px 'Source Sans 3', Arial, sans-serif"; x.fillStyle = BLL; x.fillText("B R A N D   D N A   R E P O R T", 90, 470);
    x.font = "600 30px 'Source Sans 3', Arial, sans-serif"; x.fillStyle = "rgba(230,230,230,.85)"; x.fillText(state.name ? "Prepared for " + state.name : "Prepared for you", 90, 520);
    x.font = "600 34px 'Alumni Sans', Arial, sans-serif"; x.fillStyle = BLL; x.fillText("Archetype " + pad(p.num) + " of 12", 90, 700);
    gradText(x, p.name, 90, 860, 230, PW - 180);
    y = para(x, p.essence, 90, 950, 900, 50, "400 38px 'Source Sans 3', Arial, sans-serif", "rgba(230,230,230,.92)");
    x.fillStyle = BLL; x.fillRect(90, y + 40, 120, 3);
    x.font = "700 24px 'Source Sans 3', Arial, sans-serif"; x.fillStyle = BLL; x.fillText("Y O U R   3   W O R D S", 90, y + 120);
    var cs = 104; x.font = "800 " + cs + "px 'Alumni Sans', Arial, sans-serif"; while (x.measureText(w3.join("  ·  ")).width > PW - 180 && cs > 56) { cs -= 4; x.font = "800 " + cs + "px 'Alumni Sans', Arial, sans-serif"; } x.fillStyle = "#fff"; x.fillText(w3.join("  ·  "), 90, y + 230);
    x.font = "500 24px 'Source Sans 3', Arial, sans-serif"; x.fillStyle = "rgba(230,230,230,.7)"; x.fillText(dateStr + "  ·  risepersonal.com", 90, PH - 90);
    pages.push(pg);

    // 2 · archetype
    pg = newPage(false); x = pg.x; y = title(pg, "Your archetype", p.name);
    y = para(x, p.essence, 90, y + 20, 1000, 50, "400 36px 'Source Sans 3', Arial, sans-serif", INK) + 40;
    var boxes = [["What to work on", p.work], ["Wellness pairing", p.wellness], ["Wellness × Brand", p.fusion]];
    boxes.forEach(function (b) {
      x.font = "400 31px 'Source Sans 3', Arial, sans-serif"; var ls = lines(x, b[1], 960), h = 100 + ls.length * 44;
      x.fillStyle = "#fff"; x.strokeStyle = "rgba(26,26,26,.12)"; x.lineWidth = 2; x.beginPath(); x.roundRect ? x.roundRect(90, y, PW - 180, h, 26) : x.rect(90, y, PW - 180, h); x.fill(); x.stroke();
      x.font = "700 22px 'Source Sans 3', Arial, sans-serif"; x.fillStyle = BLI; x.textAlign = "left"; x.fillText(b[0].toUpperCase().split("").join(" "), 125, y + 56);
      para(x, b[1], 125, y + 106, 960, 44, "400 31px 'Source Sans 3', Arial, sans-serif", INK); y += h + 24;
    });
    y = para(x, plain(R.nt), 90, y + 20, 1000, 40, "italic 400 28px 'Source Sans 3', Arial, sans-serif", "rgba(26,26,26,.75)") + 30;
    x.fillStyle = INK; x.beginPath(); x.roundRect ? x.roundRect(90, y, PW - 180, 250, 26) : x.rect(90, y, PW - 180, 250); x.fill();
    x.font = "700 22px 'Source Sans 3', Arial, sans-serif"; x.fillStyle = BLL; x.fillText("Y O U R   S E C O N D A R Y   C U R R E N T", 125, y + 58);
    x.font = "800 74px 'Alumni Sans', Arial, sans-serif"; x.fillStyle = "#fff"; x.fillText(s.name, 125, y + 140);
    para(x, s.essence, 125, y + 190, 960, 38, "400 28px 'Source Sans 3', Arial, sans-serif", "rgba(230,230,230,.88)");
    pageFoot(pg, 2, false, imgs); pages.push(pg);

    // 3 · five currents
    pg = newPage(false); x = pg.x; y = title(pg, "Your numbers", "Your five currents");
    y = para(x, "Scored from your 20 answers, 0 to 100. These chose your archetype.", 90, y + 20, 1000, 42, "400 30px 'Source Sans 3', Arial, sans-serif", "rgba(26,26,26,.75)") + 50;
    TRAIT_BARS.forEach(function (t) {
      var val = t.invert ? 100 - R.sc[t.f] : R.sc[t.f];
      x.font = "600 30px 'Source Sans 3', Arial, sans-serif"; x.fillStyle = INK; x.textAlign = "left"; x.fillText(t.label, 90, y);
      x.textAlign = "right"; x.font = "800 56px 'Alumni Sans', Arial, sans-serif"; x.fillStyle = BLI; x.fillText(String(val), PW - 90, y + 8); x.textAlign = "left";
      x.fillStyle = "rgba(26,26,26,.12)"; x.fillRect(90, y + 24, PW - 180, 16);
      var gb = x.createLinearGradient(90, 0, PW - 90, 0); gb.addColorStop(0, BL); gb.addColorStop(1, PU); x.fillStyle = gb; x.fillRect(90, y + 24, (PW - 180) * val / 100, 16); y += 112;
    });
    y += 20;
    var ins = [["Your strongest signal", TRAIT_NAMES[R.a.top] + " (" + R.a.v[R.a.top] + "). " + R.a.strong + " " + R.a.pairLine], ["Your growth edge", TRAIT_NAMES[R.a.low] + " (" + R.a.v[R.a.low] + "). " + R.a.edge]];
    ins.forEach(function (b) {
      x.font = "400 30px 'Source Sans 3', Arial, sans-serif"; var ls = lines(x, b[1], 960), h = 96 + ls.length * 42;
      x.fillStyle = "#fff"; x.strokeStyle = "rgba(26,26,26,.12)"; x.lineWidth = 2; x.beginPath(); x.roundRect ? x.roundRect(90, y, PW - 180, h, 26) : x.rect(90, y, PW - 180, h); x.fill(); x.stroke();
      x.font = "700 22px 'Source Sans 3', Arial, sans-serif"; x.fillStyle = BLI; x.fillText(b[0].toUpperCase().split("").join(" "), 125, y + 52);
      para(x, b[1], 125, y + 100, 960, 42, "400 30px 'Source Sans 3', Arial, sans-serif", INK); y += h + 22;
    });
    pageFoot(pg, 3, false, imgs); pages.push(pg);

    // 4 · three words + plays
    pg = newPage(false); x = pg.x; y = title(pg, "How to use it", "Your three words");
    x.textAlign = "left"; var wtxt = w3.join("  ·  "), wsz = 120; x.font = "800 " + wsz + "px 'Alumni Sans', Arial, sans-serif"; while (x.measureText(wtxt).width > PW - 180 && wsz > 60) { wsz -= 4; x.font = "800 " + wsz + "px 'Alumni Sans', Arial, sans-serif"; }
    gradText(x, wtxt, 90, y + 110, wsz, PW - 180); y += 160;
    R.words.forEach(function (wd) {
      x.font = "800 52px 'Alumni Sans', Arial, sans-serif"; x.fillStyle = INK; x.fillText(wd.w, 90, y + 44);
      y = para(x, wd.why, 90, y + 90, 1000, 40, "400 29px 'Source Sans 3', Arial, sans-serif", "rgba(26,26,26,.82)") + 28;
    });
    y += 10;
    [["Sound like", R.plays.sound], ["Show up here", R.plays.show], ["Prove it with", R.plays.prove]].forEach(function (b) {
      x.font = "400 30px 'Source Sans 3', Arial, sans-serif"; var ls = lines(x, b[1], 960), h = 88 + ls.length * 42;
      x.fillStyle = "#fff"; x.strokeStyle = "rgba(26,26,26,.12)"; x.lineWidth = 2; x.beginPath(); x.roundRect ? x.roundRect(90, y, PW - 180, h, 26) : x.rect(90, y, PW - 180, h); x.fill(); x.stroke();
      x.font = "700 22px 'Source Sans 3', Arial, sans-serif"; x.fillStyle = BLI; x.fillText(b[0].toUpperCase().split("").join(" "), 125, y + 50);
      para(x, b[1], 125, y + 92, 960, 42, "400 30px 'Source Sans 3', Arial, sans-serif", INK); y += h + 20;
    });
    pageFoot(pg, 4, false, imgs); pages.push(pg);

    // 5 · founder note
    pg = newPage(true); x = pg.x;
    var cx = 90, cy = 120;
    if (imgs.sawaf) { x.save(); x.beginPath(); x.arc(cx + 80, cy + 80, 80, 0, Math.PI * 2); x.clip(); x.drawImage(imgs.sawaf, cx, cy - 10, 160, 200); x.restore(); x.strokeStyle = BLL; x.lineWidth = 3; x.beginPath(); x.arc(cx + 80, cy + 80, 82, 0, Math.PI * 2); x.stroke(); }
    x.textAlign = "left"; x.font = "700 22px 'Source Sans 3', Arial, sans-serif"; x.fillStyle = BLL; x.fillText("A  N O T E  F R O M  T H E  F O U N D E R", 290, 150);
    x.font = "800 80px 'Alumni Sans', Arial, sans-serif"; x.fillStyle = "#fff"; x.fillText(NOTE_LABEL.length > 24 ? "A note for you" : NOTE_LABEL, 290, 235);
    var fs = 31, lh = 45, avail = PH - 420 - 200, total;
    do {
      x.font = "400 " + fs + "px 'Source Sans 3', Arial, sans-serif"; total = lines(x, R.note.greet, 1000).length * lh + 20;
      R.note.paras.forEach(function (t) { total += lines(x, t, 1000).length * lh + 22; });
      if (total > avail) { fs -= 1; lh = Math.round(fs * 1.45); }
    } while (total > avail && fs > 24);
    y = 390; y = para(x, R.note.greet, 90, y, 1000, lh, "600 " + fs + "px 'Source Sans 3', Arial, sans-serif", "#fff") + 20;
    R.note.paras.forEach(function (t) { y = para(x, t, 90, y, 1000, lh, "400 " + fs + "px 'Source Sans 3', Arial, sans-serif", "rgba(230,230,230,.94)") + 22; });
    x.font = "800 60px 'Alumni Sans', Arial, sans-serif"; x.fillStyle = BLL; x.fillText(R.note.sign, 90, y + 40);
    x.font = "500 26px 'Source Sans 3', Arial, sans-serif"; x.fillStyle = "rgba(230,230,230,.8)"; x.fillText(R.note.role, 90, y + 80);
    pageFoot(pg, 5, true, imgs); pages.push(pg);

    // 6 · 7-day plan + next step
    pg = newPage(false); x = pg.x; y = title(pg, "Your next move", "Your first 7 days") + 10;
    R.days.forEach(function (d) {
      x.font = "400 29px 'Source Sans 3', Arial, sans-serif"; var ls = lines(x, d[1], 880), h = Math.max(96, 40 + ls.length * 40);
      x.fillStyle = "#fff"; x.strokeStyle = "rgba(26,26,26,.12)"; x.lineWidth = 2; x.beginPath(); x.roundRect ? x.roundRect(90, y, PW - 180, h, 22) : x.rect(90, y, PW - 180, h); x.fill(); x.stroke();
      x.font = "800 46px 'Alumni Sans', Arial, sans-serif"; x.fillStyle = BLI; x.textAlign = "left"; x.fillText(d[0], 120, y + h / 2 + 14);
      para(x, d[1], 250, y + 52, 880, 40, "400 29px 'Source Sans 3', Arial, sans-serif", INK); y += h + 14;
    });
    y += 16; x.fillStyle = INK; x.beginPath(); x.roundRect ? x.roundRect(90, y, PW - 180, 190, 26) : x.rect(90, y, PW - 180, 190); x.fill();
    x.font = "800 56px 'Alumni Sans', Arial, sans-serif"; x.fillStyle = "#fff"; x.fillText("Talk to our team", 125, y + 70);
    para(x, "Send us your archetype and the one room you want to be known in, or ask for a private 20-minute debrief. WhatsApp +971 50 683 2835  ·  " + ((CFG && CFG.email) || "") + "  ·  risepersonal.com", 125, y + 118, 980, 36, "400 27px 'Source Sans 3', Arial, sans-serif", "rgba(230,230,230,.9)");
    pageFoot(pg, 6, false, imgs); pages.push(pg);
    return pages;
  }

  function b64bytes(url) { var b = atob(url.split(",")[1]), u = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; }
  function pdfFromPages(canvases, titleText) {
    var enc = new TextEncoder(), parts = [], off = [], len = 0, n = canvases.length;
    function put(v) { var b = typeof v === "string" ? enc.encode(v) : v; parts.push(b); len += b.length; }
    function obj(id, fn) { off[id] = len; put(id + " 0 obj\n"); fn(); put("\nendobj\n"); }
    var W = 595.28, H = 841.89, kids = [];
    put("%PDF-1.4\n");
    obj(1, function () { put("<< /Type /Catalog /Pages 2 0 R >>"); });
    for (var i = 0; i < n; i++) kids.push((5 + 3 * i) + " 0 R");
    obj(2, function () { put("<< /Type /Pages /Kids [" + kids.join(" ") + "] /Count " + n + " >>"); });
    obj(3, function () { put("<< /Title (" + titleText.replace(/[()\\]/g, "") + ") /Producer (Rise Personal) >>"); });
    canvases.forEach(function (c, i) {
      var jpg = b64bytes(c.toDataURL("image/jpeg", 0.9));
      obj(4 + 3 * i, function () { put("<< /Type /XObject /Subtype /Image /Width " + c.width + " /Height " + c.height + " /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length " + jpg.length + " >>\nstream\n"); put(jpg); put("\nendstream"); });
      var ct = "q " + W + " 0 0 " + H + " 0 0 cm /Im0 Do Q";
      obj(5 + 3 * i + 1, function () { put("<< /Length " + ct.length + " >>\nstream\n" + ct + "\nendstream"); });
      obj(5 + 3 * i, function () { put("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 " + W + " " + H + "] /Resources << /XObject << /Im0 " + (4 + 3 * i) + " 0 R >> >> /Contents " + (6 + 3 * i) + " 0 R >>"); });
    });
    var total = 4 + 3 * n, xref = len;
    put("xref\n0 " + total + "\n0000000000 65535 f \n");
    for (var k = 1; k < total; k++) put(("0000000000" + off[k]).slice(-10) + " 00000 n \n");
    put("trailer\n<< /Size " + total + " /Root 1 0 R /Info 3 0 R >>\nstartxref\n" + xref + "\n%%EOF");
    var out = new Uint8Array(len), p = 0; parts.forEach(function (b) { out.set(b, p); p += b.length; });
    return new Blob([out], { type: "application/pdf" });
  }

  var building = false;
  function makeReport() {
    if (building || !CUR) return; building = true;
    var st = $("#dl-st"), btn = $("#btn-pdf"); btn.disabled = true; st.textContent = "Building your report…";
    var fonts = ["800 100px 'Alumni Sans'", "700 30px 'Alumni Sans'", "400 30px 'Source Sans 3'", "600 30px 'Source Sans 3'", "700 30px 'Source Sans 3'", "italic 400 28px 'Source Sans 3'"];
    var fl = document.fonts && document.fonts.load ? Promise.all(fonts.map(function (f) { return document.fonts.load(f); })) : Promise.resolve();
    Promise.all([fl, loadImg("assets/logo-on-black.png"), loadImg("assets/logo-on-white.png"), loadImg("assets/sawaf.jpg")]).then(function (r) {
      var imgs = { logoDark: r[1], logoLight: r[2], sawaf: r[3] };
      var pages = drawReport(imgs).map(function (pg) { return pg.c; });
      var blob = pdfFromPages(pages, "Brand DNA Report: " + CUR.p.name);
      var a = document.createElement("a"), u = URL.createObjectURL(blob);
      a.href = u; a.download = "risepersonal-brand-dna-report-" + CUR.p.id + ".pdf"; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(u); }, 20000);
      st.textContent = "Your report is ready. Check your downloads."; btn.disabled = false; building = false;
    }).catch(function () { st.textContent = "Something went wrong. Please try again."; btn.disabled = false; building = false; });
  }


  initIntro();
})();
