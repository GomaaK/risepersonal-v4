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
    { f: "C", r: 0, t: "I often leave important things until the last minute." },
    { f: "E", r: 0, t: "Long stretches around many people leave me drained." },
    { f: "A", r: 1, t: "I give people the benefit of the doubt." },
    { f: "N", r: 1, t: "I replay worries in my mind long after the moment has passed." },
    { f: "O", r: 0, t: "I prefer familiar routines over experimenting with new approaches." },
    { f: "C", r: 1, t: "People can rely on me to deliver what I promised, on time." },
    { f: "E", r: 0, t: "I would rather observe quietly than take the stage." },
    { f: "A", r: 1, t: "People often come to me for comfort or support." },
    { f: "N", r: 0, t: "Criticism rarely rattles me." },
    { f: "A", r: 0, t: "I enjoy a sharp debate, even when it makes waves." },
    { f: "N", r: 1, t: "A small setback can colour my entire day." },
    { f: "C", r: 1, t: "I work best with structure: lists, systems, and clear next steps." },
    { f: "O", r: 1, t: "I often question the usual way of doing things and imagine a better one." },
    { f: "E", r: 1, t: "I am comfortable speaking first in a room full of people." }
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
    {
      "id": "sage",
      "num": 1,
      "name": "The Sage",
      "essence": "The thought leader and teacher: people come to you to understand what things mean.",
      "work": "Sharing your ideas publicly: the world needs your thinking out loud.",
      "wellness": "Deep work & meditation",
      "words": [
        "Insightful",
        "Grounded",
        "Wise"
      ],
      "roles": [
        "essence",
        "human",
        "impact"
      ],
      "profile": {
        "O": 80,
        "C": 75,
        "E": 30,
        "A": 55,
        "N": 45
      },
      "keys": [
        "O",
        "C"
      ],
      "fusion": "Deep work and meditation keep your clarity sharp: a Sage’s brand only holds when the mind behind it is rested.",
      "off": 2
    },
    {
      "id": "creator",
      "num": 2,
      "name": "The Creator",
      "essence": "The artist and builder: you exist to make things that didn’t exist before.",
      "work": "Finishing and shipping: done is the masterpiece your ideas are waiting for.",
      "wellness": "Flow states",
      "words": [
        "Original",
        "Generous",
        "Distinctive"
      ],
      "roles": [
        "essence",
        "human",
        "impact"
      ],
      "profile": {
        "O": 95,
        "C": 50,
        "E": 45,
        "A": 78,
        "N": 55
      },
      "keys": [
        "O",
        "A"
      ],
      "fusion": "Flow states are your strategy: your best brand moves arrive when the making feels like play.",
      "off": 0
    },
    {
      "id": "ruler",
      "num": 3,
      "name": "The Ruler",
      "essence": "The executive authority: composed command is your natural register.",
      "work": "Generous leadership: share the stage, and the crown grows.",
      "wellness": "Energy management",
      "words": [
        "Purposeful",
        "Composed",
        "Commanding"
      ],
      "roles": [
        "essence",
        "human",
        "impact"
      ],
      "profile": {
        "O": 55,
        "C": 88,
        "E": 82,
        "A": 45,
        "N": 20
      },
      "keys": [
        "C",
        "E",
        "N"
      ],
      "fusion": "Energy management is the crown jewel: protect it, and composure becomes your brand signature.",
      "off": 0
    },
    {
      "id": "hero",
      "num": 4,
      "name": "The Hero",
      "essence": "The achiever: proof, momentum and results follow you.",
      "work": "Sustainable pace: a long campaign beats a brilliant sprint.",
      "wellness": "Discipline & fitness",
      "words": [
        "Resolute",
        "Proven",
        "Bold"
      ],
      "roles": [
        "essence",
        "human",
        "impact"
      ],
      "profile": {
        "O": 55,
        "C": 85,
        "E": 78,
        "A": 50,
        "N": 50
      },
      "keys": [
        "C",
        "E"
      ],
      "fusion": "Discipline and fitness keep the engine honest: your brand promises proof, so train like it.",
      "off": 0
    },
    {
      "id": "explorer",
      "num": 5,
      "name": "The Explorer",
      "essence": "The founder-nomad: new territory is your natural habitat.",
      "work": "Rooted storytelling: bring the journey home so people can follow it.",
      "wellness": "Nature & movement",
      "words": [
        "Free",
        "Open",
        "Untamed"
      ],
      "roles": [
        "essence",
        "human",
        "impact"
      ],
      "profile": {
        "O": 85,
        "C": 45,
        "E": 55,
        "A": 40,
        "N": 50
      },
      "keys": [
        "O",
        "A"
      ],
      "fusion": "Nature and movement reset your compass: the Explorer’s brand stays true only at full breath.",
      "off": 3
    },
    {
      "id": "magician",
      "num": 6,
      "name": "The Magician",
      "essence": "The innovator: you see around corners and make the impossible feel inevitable.",
      "work": "Focus over novelty: choose the one trick and master it.",
      "wellness": "Creation rituals",
      "words": [
        "Visionary",
        "Intuitive",
        "Transformative"
      ],
      "roles": [
        "essence",
        "human",
        "impact"
      ],
      "profile": {
        "O": 95,
        "C": 50,
        "E": 80,
        "A": 45,
        "N": 50
      },
      "keys": [
        "O",
        "E"
      ],
      "fusion": "Creation rituals turn sparks into fire: ritual, not mood, feeds the Magician’s brand.",
      "off": -3
    },
    {
      "id": "lover",
      "num": 7,
      "name": "The Lover",
      "essence": "The aesthetic and lifestyle authority: beauty is how you make people feel valued.",
      "work": "Discernment: say no beautifully, so every yes means more.",
      "wellness": "Self-care as strategy",
      "words": [
        "Refined",
        "Warm",
        "Magnetic"
      ],
      "roles": [
        "essence",
        "human",
        "impact"
      ],
      "profile": {
        "O": 82,
        "C": 50,
        "E": 75,
        "A": 85,
        "N": 45
      },
      "keys": [
        "O",
        "E",
        "A"
      ],
      "fusion": "Self-care is your strategy, not your indulgence: the Lover’s brand glows from the inside out.",
      "off": -3
    },
    {
      "id": "jester",
      "num": 8,
      "name": "The Jester",
      "essence": "The entertainer: light is your tool and joy your medium.",
      "work": "Depth alongside humour: let them laugh, then let them think.",
      "wellness": "Play & joy",
      "words": [
        "Witty",
        "Disarming",
        "Electric"
      ],
      "roles": [
        "essence",
        "human",
        "impact"
      ],
      "profile": {
        "O": 65,
        "C": 45,
        "E": 88,
        "A": 55,
        "N": 25
      },
      "keys": [
        "E",
        "N"
      ],
      "fusion": "Play and joy are the maintenance plan: a Jester running on empty loses the spark that makes the brand.",
      "off": 0
    },
    {
      "id": "everyman",
      "num": 9,
      "name": "The Everyman",
      "essence": "The relatable expert: you lead by being real, and real is rare.",
      "work": "Standing out: your plain-spoken clarity is the differentiator; own it.",
      "wellness": "Rhythm & balance",
      "words": [
        "Real",
        "Trusted",
        "Plain-spoken"
      ],
      "roles": [
        "essence",
        "human",
        "impact"
      ],
      "profile": {
        "O": 50,
        "C": 55,
        "E": 50,
        "A": 85,
        "N": 45
      },
      "keys": [
        "A"
      ],
      "fusion": "Rhythm and balance keep you credible: the Everyman’s brand is a marathon walked with your people.",
      "off": 8
    },
    {
      "id": "caregiver",
      "num": 10,
      "name": "The Caregiver",
      "essence": "The coach and guide: people feel safer having you in their corner.",
      "work": "Boundaries and visibility: you can’t pour from a brand that hides.",
      "wellness": "Rest & boundaries",
      "words": [
        "Caring",
        "Safe",
        "Steadfast"
      ],
      "roles": [
        "essence",
        "human",
        "impact"
      ],
      "profile": {
        "O": 55,
        "C": 60,
        "E": 50,
        "A": 92,
        "N": 55
      },
      "keys": [
        "A",
        "N"
      ],
      "fusion": "Rest and boundaries are part of the work: a Caregiver with margins can hold everyone, including themselves.",
      "off": 0
    },
    {
      "id": "innocent",
      "num": 11,
      "name": "The Innocent",
      "essence": "The optimistic minimalist: clarity and honesty are your aesthetic.",
      "work": "A bolder voice: your calm deserves volume, too.",
      "wellness": "Mindfulness & simplicity",
      "words": [
        "Honest",
        "Calm",
        "Clear"
      ],
      "roles": [
        "essence",
        "human",
        "impact"
      ],
      "profile": {
        "O": 60,
        "C": 55,
        "E": 45,
        "A": 65,
        "N": 15
      },
      "keys": [
        "N",
        "O"
      ],
      "fusion": "Mindfulness and simplicity are your competitive edge: in a noisy market, your calm is the brand.",
      "off": 4
    },
    {
      "id": "outlaw",
      "num": 12,
      "name": "The Outlaw",
      "essence": "The disruptor: you break the pattern so something better can take its place.",
      "work": "Coalition-building: even revolutions need allies.",
      "wellness": "Channeling intensity",
      "words": [
        "Fearless",
        "Principled",
        "Unfiltered"
      ],
      "roles": [
        "essence",
        "human",
        "impact"
      ],
      "profile": {
        "O": 90,
        "C": 45,
        "E": 72,
        "A": 35,
        "N": 55
      },
      "keys": [
        "O",
        "E",
        "A"
      ],
      "fusion": "Channel the intensity: an Outlaw’s brand burns bright only when the fire is aimed.",
      "off": -4
    }
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
    N: ["Attuned", "Driven", "Instinctive"],
    Nc: ["Steady", "Composed", "Calm"]
  };
  var GLOBAL_FALLBACK = ["Vivid", "Radiant", "Distinct"];
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
    "sage": "A Sage earns trust by making hard things clear. If people already come to you to understand what something means, that is your brand, and it is waiting to be said out loud. Your next move is one idea a week, finished and shared in public. Nobody is waiting for it to be perfect. They are waiting for you to say it.",
    "creator": "A Creator makes things that did not exist before. The risk is the drawer of almost-finished work, because an audience cannot follow what it cannot see. Your brand grows the day you ship, show the process and let people watch you make. Done is the masterpiece your ideas are waiting for.",
    "ruler": "A Ruler carries authority without raising a voice. The way to make that last is to share the stage, because the leaders people remember are the ones who made others look good in public. Let your team and your partners be seen next to you.",
    "hero": "A Hero builds a brand from proof: results, momentum and a record people can point to. The risk is running a sprint every day until the engine burns out. Pick a pace you can keep for years and let the results speak at that rhythm. A long campaign beats a brilliant sprint.",
    "explorer": "An Explorer's brand is a journey people want to follow, and a journey needs a home base. Share what you found, not only where you are going next. Bring the story back to one place, on a schedule. People follow explorers who return with something for them.",
    "magician": "A Magician sees around corners and makes the impossible feel inevitable. The trap is ten brilliant ideas and no signature. Choose your one transformation, name it, show it in public and repeat it until people say it for you.",
    "lover": "A Lover makes people feel valued and notices what others miss. The brand grows through discernment: say no beautifully, so every yes means more. Protect your standards and your energy. The people who matter will feel the difference.",
    "jester": "A Jester brings light into a room, and people remember how they felt. The next level is depth next to the humour: let them laugh, then let them think. When people can trust you with the serious thing as well as the funny one, your brand becomes unusual.",
    "everyman": "An Everyman earns trust by being plain and real. You do not need a costume, you need clarity. Say it the way you would say it to a friend, skip the polished voice you see everywhere, and let it travel.",
    "caregiver": "A Caregiver's brand is built on trust, and it lasts only if you are visible and have boundaries. You cannot pour from a brand that hides. Let people see what you do, and protect the time that keeps you steady.",
    "innocent": "An Innocent brings clarity and honesty to a noisy market, and that calm is the brand. Quiet can feel like not enough. It is enough, and it deserves more volume. Say the simple true thing more often and more boldly, and people will lean in.",
    "outlaw": "An Outlaw breaks patterns so something better can take their place. People remember Outlaws, which is a good start. The next step is allies: even revolutions need coalitions. Aim the fire at one target, name it, and invite others to stand with you."
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
    N: { high: "You stay steady when others rush.", mid: "You keep an even keel most of the time.", low: "You feel things deeply, which makes you attuned to people. Plan recovery time after big moments so it does not wear you down." }
  };
  var TRAIT_EDGE = {
    O: "Make room for one new idea a week, so your brand keeps growing.",
    C: "Choose one thing to finish and share each week, so people see your follow-through.",
    E: "Pick one small room a month where you open the conversation, so people hear you early.",
    A: "Start with one generous gesture in public each week, so people feel your warmth before your edge.",
    N: "Choose one small routine before big moments, such as a short walk or a few quiet minutes, so you arrive steady."
  };
  var PAIR_LINES = {
    "OC": "You imagine well and you deliver, which makes your ideas easy to trust.",
    "OE": "You bring big ideas into the room with energy, and people remember where they heard them.",
    "OA": "You are creative and kind. People trust your ideas because they trust you.",
    "ON": "You imagine freely and you stay steady. That lets you try bold things without losing the room.",
    "CE": "You are visible and dependable, and each supports the other.",
    "CA": "You are reliable and warm. People hand you important things and feel good doing it.",
    "CN": "You are organised and calm. You are the person people want next to them when it gets difficult.",
    "EA": "You are lively and generous. People feel welcome around you.",
    "EN": "You bring energy and keep your head. That makes you easy to follow.",
    "AN": "You are warm and composed. People feel safe telling you the truth."
  };
  var TRAIT_NAMES = { O: "Imagination", C: "Follow-through", E: "Energy with people", A: "Warmth and trust", N: "Composure" };

  var UPG = {"sage": {"intro_line_template": "I help [who you help] make sense of [the confusing thing] so they can [decision or action]. I explain it in plain words, and what I am known for is [your idea, framework or the question you always ask].", "linkedin_headline_formulas": ["[Role] | Helping [who you help] understand [topic] and decide [decision]", "[Topic] explained clearly | [Role] | [what you write, teach or advise on]", "I turn [complicated topic] into [clear outcome] for [who you help]"], "about_opening_lines": ["People who come to me often have a question they cannot yet put into words. My work is to help them find it, and then answer it.", "I think out loud so that you do not have to work it out alone. [Topic] is what I write, teach and advise on."], "three_rooms": ["A small closed briefing where someone asks the hard question and you answer it step by step.", "A talk or panel built around one clear argument that people can repeat afterwards.", "A written room: a long article or newsletter that others can cite, with your name on the idea."], "this_week_conversation": "Ask one person you trust what they have heard you explain better than anyone else, and write down their exact words.", "stop_doing": "Stop waiting until your thinking is complete before you share it.", "wellness_week": "Protect two mornings this week where the first hour has no screen, and use it to write one page on what you currently believe. Notice how long you need between thinking and sharing, and set your publishing pace around that.", "ninety_day_prompt": "In 90 days, count the ideas you finished and shared in public, then ask which one people repeated back to you."}, "creator": {"intro_line_template": "I make [what you make] for [who it is for]. What I care about is [the standard or feeling in the work], and the clearest example so far is [one finished piece you can point to].", "linkedin_headline_formulas": ["[What you make] for [who it is for] | [your word 1] | [craft or medium]", "I build [what you build] that helps [who it is for] [what it does for them]", "Maker of [thing]. Currently finishing [project], shared as it happens"], "about_opening_lines": ["I make things because I cannot leave a gap where something should be. Here is how I work, and what I have finished so far.", "My work starts with [a question or a frustration]. It is done when someone can [use, read, watch or feel] it."], "three_rooms": ["An open working session or studio visit where people see the making, not only the result.", "A small showing or launch with an invited audience who will tell you what they noticed.", "A circle of makers who share work in progress on a fixed day each week."], "this_week_conversation": "Show one unfinished piece to one person whose taste you trust and ask what they would finish first.", "stop_doing": "Stop polishing the piece you have already improved three times.", "wellness_week": "Book one protected block this week for making only, with notifications off and no audience. Afterwards, write down the conditions that made it feel like play and repeat them.", "ninety_day_prompt": "In 90 days, list what you finished and showed, not what you started, then ask which piece people asked about."}, "ruler": {"intro_line_template": "I lead [team, company or function], which [what it does for whom]. People come to me when [a situation that needs a steady hand]. What we have built together is [outcome in your own words], and I am now working on [direction].", "linkedin_headline_formulas": ["[Title] at [organisation] | Building [what] for [who it serves]", "I lead [what you lead] so that [who it serves] can [outcome]", "Leading [function or organisation] in [sector] | [the standard you hold, in a few words]"], "about_opening_lines": ["I lead by making the next decision clear. This page is about how I think about [topic], and the people who shaped that thinking.", "The people I work with would describe me as [their words]. I would add one belief about leadership: [your belief]."], "three_rooms": ["A board or advisory room where you brief or chair, with your team visible next to you.", "A keynote or fireside conversation where you share the stage with someone from your team.", "A small curated dinner or introduction circle where you connect two people who should meet."], "this_week_conversation": "Ask one member of your team which of their results you would like to credit publicly this month, and when.", "stop_doing": "Stop being the only name attached to the work.", "wellness_week": "Choose the two busiest points in your week and protect the hour before each one. Notice what you do with that hour, and keep the habit that leaves you steadier.", "ninety_day_prompt": "In 90 days, count how often you named someone else in public, then ask whether your standing grew with it."}, "hero": {"intro_line_template": "I [what you did] for [who] and [what changed, in your own words]. Right now I am taking on [next challenge], and the record I can show is [one result you can document].", "linkedin_headline_formulas": ["[Role] | [What you delivered] for [who], now building [next challenge]", "[Role] who takes on [hard problem] for [who you help]", "[Title]: proven in [setting], focused on [next challenge]"], "about_opening_lines": ["I measure my work by what changed afterwards. Here is a record I can show, and the next thing I am aiming at.", "I like hard targets. What I have learned is that a pace you can keep for years beats a sprint you can keep for a quarter."], "three_rooms": ["An industry event or awards stage where results are discussed in public.", "A case-study talk where you walk the audience through the before and the after.", "A mentoring or peer circle with people who chase equally hard goals and will say when you are overdoing it."], "this_week_conversation": "Ask one trusted peer what pace they believe you can keep for the next three years.", "stop_doing": "Stop treating every week as a sprint.", "wellness_week": "Put one training or movement slot in your calendar this week and treat it like a client meeting you do not move. Keep a one-line log of what you did, so your pace is something you can see.", "ninety_day_prompt": "In 90 days, set your pace next to your record: which effort did people notice, and which one used energy for no visible return?"}, "explorer": {"intro_line_template": "I go to [territory, market or field] early, and I bring back what I learn. I help [who you help] [what changes], and the lesson I would start with is [one thing you found].", "linkedin_headline_formulas": ["[Role] exploring [territory] | Field notes for [who you help]", "I help [who you help] enter [new market, field or idea] with what I bring back", "Founder, [company] | Learning in public in [place or field]"], "about_opening_lines": ["I never stay in one place long, so I keep notes. Here is what my last move taught me.", "I follow questions to where they lead. Each story here ends with one lesson you can use."], "three_rooms": ["A talk or field-notes session after a trip, project or market visit.", "A community event where people swap what they have found somewhere new.", "A small recurring gathering with the same people, where you tell the journey so far in one sitting."], "this_week_conversation": "Tell one person who has not followed your travels what your last move taught you, in two minutes.", "stop_doing": "Stop announcing where you are going next before you share what you found.", "wellness_week": "Take one walk this week without a podcast or a call, and write down the first question that comes to you. Use it as the subject of your next post.", "ninety_day_prompt": "In 90 days, check that you have one home base where people can find the whole journey, and that it has a lesson from you each month."}, "magician": {"intro_line_template": "I help [who you help] move from [where they are] to [where they could be]. The one change I am known for is [your signature transformation], and you can see it in [one example].", "linkedin_headline_formulas": ["From [before] to [after] | [Role] for [who you help]", "I help [who you help] [signature transformation] | [Role]", "[Role] | Making [what seems impossible] practical for [who you help]"], "about_opening_lines": ["I tend to see where things are heading before the room does, and my work is to turn that into something you can use on Monday.", "There is one change I keep returning to: [the change]. Everything on this page is a way of showing it."], "three_rooms": ["A demo or workshop where people experience the change rather than hear about it.", "A keynote or launch built around one signature idea, with one clear takeaway.", "A small session with early adopters where you test the next idea before you announce it."], "this_week_conversation": "Ask one person to say back to you, in one sentence, what change you help create, then note where their sentence differs from yours.", "stop_doing": "Stop introducing a new idea before the last one has a name people repeat.", "wellness_week": "Choose one daily creation ritual this week, such as ten minutes of making at the same time and place, and keep it even when you have no spark. Notice which parts you would still do on a flat day.", "ninety_day_prompt": "In 90 days, check whether people use your signature phrase before you say it."}, "lover": {"intro_line_template": "I create [experience, product or space] for [who you serve] who care about [quality, taste or feeling]. People come to me when they want [what it feels like when it is done well], and I choose carefully who I work with.", "linkedin_headline_formulas": ["[Craft or category] for people who value [quality]", "[Role] | Where [a detail you care about] meets [what the client wants to feel]", "Curating [what you curate] for [who you serve]"], "about_opening_lines": ["I notice the detail that others walk past, because that is how people feel looked after. This page is a short guide to what I choose, and why.", "I say no often, so that when I say yes it carries weight."], "three_rooms": ["A small hosted evening or tasting where you set every detail.", "A collaboration with one or two partners whose standards match yours.", "A curated space, studio or feed with a consistent look, rather than a high volume of posts."], "this_week_conversation": "Tell one client or partner, kindly, about a request you have decided not to take on, and what you would suggest instead.", "stop_doing": "Stop saying yes to invitations that do not match your standards.", "wellness_week": "Pick one thing that makes your own day or space feel cared for, and do it on three set days this week. Treat it as part of how you maintain your brand's pace.", "ninety_day_prompt": "In 90 days, list the offers you turned down and the ones you accepted, then ask whether the list looks like your standards."}, "jester": {"intro_line_template": "I help [who you help] [what changes], and I try to make it enjoyable on the way. People remember [the line or moment they remember], and underneath it is a serious point: [your point].", "linkedin_headline_formulas": ["[Serious topic], without the dullness | [Role]", "I make [topic] worth paying attention to for [who you help]", "[Role] | Host, speaker and the person who explains [topic] with a straight face"], "about_opening_lines": ["I use humour to get your attention, and then I try to earn it. Here is the serious part.", "People laugh first, then ask how I actually do [topic]. This page answers that."], "three_rooms": ["A panel or podcast where your timing lifts the room.", "A short video or live format where you can try a joke and a point in the same minute.", "A live event where you host or open, then hand over to substance."], "this_week_conversation": "Ask one person who has seen you be funny what the serious point behind it was, and write it down.", "stop_doing": "Stop ending on the joke.", "wellness_week": "Schedule two blocks of play this week with no audience and no content in them. Notice what makes you laugh when nobody is watching, and let that guide what you share.", "ninety_day_prompt": "In 90 days, look at your public pieces and ask which ones left people with a point they could repeat after the laugh."}, "everyman": {"intro_line_template": "I help [who you help] with [problem], in plain words. I have done this [in the situations or for as long as you can truthfully say], and I would explain it to you the way I would to a friend.", "linkedin_headline_formulas": ["[Problem], explained plainly | [Role] for [who you help]", "[Role] | Plain advice on [topic] for [who you help]", "I help [who you help] get [outcome] without [the jargon or the pressure]"], "about_opening_lines": ["I do not have a polished voice, I have a clear one. This is how I would explain what I do over coffee.", "People tell me they trust me because I say the simple thing. So I keep saying it."], "three_rooms": ["A community question-and-answer session where people ask real questions.", "One-to-one conversations or open office hours.", "A local or industry meetup where you talk with people rather than present at them."], "this_week_conversation": "Ask a client what they would tell a friend about working with you, in the words they would actually use.", "stop_doing": "Stop copying the polished voice you see in your sector.", "wellness_week": "Keep one steady routine this week: the same start and finish time for your working day on at least four days. Put your sharing days on the same rhythm, so your pace is something people can rely on.", "ninety_day_prompt": "In 90 days, look at which of your plainest posts or conversations travelled furthest, and do more of that."}, "caregiver": {"intro_line_template": "I support [who you support] through [the situation they are in], so that they can [what changes]. I do it by [your method, in plain words], and I can tell you what that looks like in practice.", "linkedin_headline_formulas": ["[Role] supporting [who you support] through [situation]", "Helping [who you support] [outcome] | [your approach] | [setting]", "[Role] | A steady guide for [who you support] facing [situation]"], "about_opening_lines": ["People often arrive tired of doing it alone. I try to make the next step feel clear and safe.", "My work rests on trust, and trust needs me to be visible. Here is what working with me looks like."], "three_rooms": ["A small-group session or workshop where people can speak honestly.", "A letter or newsletter to the people you support, sent on a steady schedule.", "A peer or mentoring circle where you are one of the people being held, not only the one holding."], "this_week_conversation": "Tell one person what you will no longer take on, and what you can offer instead.", "stop_doing": "Stop waiting for permission to be visible about the work you already do.", "wellness_week": "Mark two evenings this week as closed to requests, and tell people in advance. Spend them on something that has nothing to do with anyone else's needs.", "ninety_day_prompt": "In 90 days, review your boundaries: which one held, which one slipped, and did being more visible bring the right people to you?"}, "innocent": {"intro_line_template": "I believe [a simple belief about your field]. I help [who you help] [what changes] by keeping it simple: [your method in one line].", "linkedin_headline_formulas": ["[Simple promise] for [who you help]", "[Role] | [Topic] made simple", "[One honest sentence about what you do]"], "about_opening_lines": ["I try to say the simple, true thing. Here is the one I come back to.", "You will not find clutter here. One idea, said plainly: [your idea]."], "three_rooms": ["A quiet, focused session with a small group.", "A short essay or newsletter that says one thing clearly.", "A clean visual feed with the same honest voice every week."], "this_week_conversation": "Say your simple belief out loud to one person and ask whether it sounded too quiet.", "stop_doing": "Stop softening the sentence you actually believe.", "wellness_week": "Remove one source of noise from your week, such as a feed or a recurring meeting, and use the space for one slow task. Write one sentence about what you noticed.", "ninety_day_prompt": "In 90 days, count the times you said the simple thing out loud in public, and note how people responded."}, "outlaw": {"intro_line_template": "I think [the common way of doing something] is broken, and I am building [the alternative] for [who it serves]. I am not trying to argue with everyone. I am looking for [the people who already agree], and I can show [one thing that already works].", "linkedin_headline_formulas": ["[Role] | Replacing [old way] with [new way]", "Against [what should change]. For [what should replace it]", "[Role] building [the alternative] for [who is underserved]"], "about_opening_lines": ["I say what others avoid saying, aimed at the system and not at people. Here is what I am against, what I am for, and who is already with me.", "Every pattern I break is to make room for something better. This is the something."], "three_rooms": ["A public debate or panel where the other side is in the room and the argument is open.", "A small coalition of allies who share one target.", "A manifesto or launch event where you name the problem and invite others to stand with you."], "this_week_conversation": "Name one person who agrees with you about what must change, and ask what they would join you in doing.", "stop_doing": "Stop aiming at five targets at once. Choose one.", "wellness_week": "Set aside two sessions this week for intense physical or creative output with a clear end point, and take the rest of those days slowly. See where your intensity does its best work and aim it there.", "ninety_day_prompt": "In 90 days, list who joined you and who left, then ask whether your target is clearer to others than it was."}};
  var NINETY = {"title": "Your next 90 days", "lede": "Seven days gets you started. Ninety days shows whether it is working. Put three dates in your calendar and answer one question on each.", "checkpoints": [{"when": "Day 30", "name": "Say it", "question": "Do the people who know me use any of my three words? Which ones did they reach for without being asked?"}, {"when": "Day 60", "name": "Show it", "question": "Which of the three rooms did I actually spend time in, and which one did I avoid? What did the room I avoided ask of me?"}, {"when": "Day 90", "name": "Prove it", "question": "{ninety_day_prompt}"}], "closing_line": "Retake the Brand DNA Report on day 90. If your archetype or words have moved, that is useful information about how you have changed, or how you answered on that day.", "calendar_button": "Add these three dates to my calendar", "calendar_note": "Downloads a small calendar file (.ics) built in your browser. Nothing is sent to us."};
  var PLAN7_INTRO = "Seven days, about ten minutes a day. If a day does not fit, skip it and carry on.";
  var PLAN7 = [["Day 1", "Say your introduction out loud, twice. Start from this pattern and fill in the blanks: {intro_line_template} Then write your three words on a card: {w1}, {w2}, {w3}."], ["Day 2", "Update your LinkedIn headline. Pick one pattern and fill it in: 1) {headline_1}  2) {headline_2}  3) {headline_3}. Replace the first line of your About section with: {about_1}"], ["Day 3", "Have this week's conversation: {conversation}"], ["Day 4", "Draft one piece of writing or a short video that sounds like you. Aim for this voice: {sound}"], ["Day 5", "Ask three people who know you: 'If you were introducing me to someone you respect, which three words would you use?' Do not explain yours. Compare their words with {w1}, {w2}, {w3}."], ["Day 6", "Publish the piece from Day 4 and add one line of proof. Your proof could be: {prove} Today's stop: {stop}"], ["Day 7", "Review the week. Which line felt true when you said it? Pick one room from this list to book this month: 1) {room_1}  2) {room_2}  3) {room_3}. Pace practice for the week ahead: {wellness_week} If you want a second opinion, you can send your results to our team. That is optional."]];
  var DAYS = function (p, w, u) {
    var f = function (t) { return t.replace(/\{w1\}/g, w[0]).replace(/\{w2\}/g, w[1]).replace(/\{w3\}/g, w[2]).replace(/\{sound\}/g, p.sound).replace(/\{prove\}/g, p.prove.toLowerCase()).replace(/\{intro_line_template\}/g, u.intro_line_template).replace(/\{headline_1\}/g, u.linkedin_headline_formulas[0]).replace(/\{headline_2\}/g, u.linkedin_headline_formulas[1]).replace(/\{headline_3\}/g, u.linkedin_headline_formulas[2]).replace(/\{about_1\}/g, u.about_opening_lines[0]).replace(/\{room_1\}/g, u.three_rooms[0]).replace(/\{room_2\}/g, u.three_rooms[1]).replace(/\{room_3\}/g, u.three_rooms[2]).replace(/\{conversation\}/g, u.this_week_conversation).replace(/\{stop\}/g, u.stop_doing).replace(/\{wellness_week\}/g, u.wellness_week); };
    return PLAN7.map(function (d) { return [d[0], f(d[1])]; });
  };
  var DAYS_END;


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
  var NOTES = {"5": "Five answers in, and we have heard from five sides of you once each: ideas, follow-through, people, trust and pressure.", "10": "Halfway. Some of these will have been easy and some will have made you pause. The pauses tell us as much as the quick ones.", "15": "Five statements left. If one felt too flattering to be true, tap Back and change it. An honest answer helps you more than an impressive one.", "20": "That is all twenty. The last two choices are about other people: what they should feel, and what they should remember."};

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
      var d = 0; ["O", "C", "E", "A", "N"].forEach(function (f) { var w = a.keys.indexOf(f) >= 0 ? 2 : 1, s = Math.max(0, Math.min(100, 50 + 1.6 * (sc[f] - 50))); d += w * Math.pow(s - a.profile[f], 2); });
      return { a: a, d: Math.sqrt(d) + (a.off || 0) };
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
    var vv = { O: sc.O, C: sc.C, E: sc.E, A: sc.A, N: 100 - sc.N }, srt = ["O", "C", "E", "A", "N"].slice().sort(function (x, y) { return vv[y] - vv[x]; });
    var standout = vv[srt[0]] - vv[srt[1]] >= 8, topF = srt[0] === "N" ? "Nc" : srt[0];
    var used = [w1.toLowerCase(), w2.toLowerCase()];
    function pickFrom(pool) { for (var i = 0; i < pool.length; i++) if (used.indexOf(pool[i].toLowerCase()) < 0) return pool[i]; return null; }
    var w3 = (standout ? pickFrom(DRIVE_POOL[topF]) : null) || pickFrom(GLOBAL_FALLBACK) || "Vivid";
    return [
      { w: w1, why: "From your primary current, " + prim.name + ". You want people to feel “" + feel.label.toLowerCase() + "”, and “" + w1 + "” carries exactly that." },
      { w: w2, why: "Your secondary current, " + sec.name + ". You want to be remembered as “" + rem.label.toLowerCase() + "”, and “" + w2 + "” is that note in you." },
      { w: w3, why: standout ? "Your strongest signal is " + (topF === "Nc" ? "composure" : FACTOR_NAMES[topF].toLowerCase()) + ". “" + w3 + "” is its word." : "No single trait stands out in your answers, so “" + w3 + "” keeps your options open." }
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
        (a.v[a.top] - a.v[a.second] >= 8 ? "Your answers showed something specific. " + a.strong + " " + TRAIT_NAMES[a.top] + " is your strongest signal. " + a.pairLine : "No single trait stands out in your answers. That is useful: you can be introduced in more than one way, and you get to choose which one leads.") + " These come from twenty short statements, so read them as a direction, not a measurement.",
        "You told us you want people to feel " + feel.label.toLowerCase() + " and to remember you as " + rem.label.toLowerCase() + ". Your three words are " + w[0] + ", " + w[1] + " and " + w[2] + ". " + w[0] + " is for how you want people to feel and " + w[1] + " for what you want them to remember. " + w[2] + " comes from your own pattern, not from what you picked.",
        "One thing to watch, and it is a small one: the signal with most room to grow is " + TRAIT_NAMES[a.low].toLowerCase() + ". " + a.edge,
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
    CUR = { sc: sc, p: p, s: s, words: words, nt: nt, a: a, note: note, plays: plays, days: DAYS(plays, w3, UPG[p.id]), up: UPG[p.id] };
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
      '<div class="dl-card rv-step" style="--s:1"><div><h3>Your report, to keep</h3><p>Ten branded pages: your archetype, five currents, three words, a note from our founder and a 7-day plan.</p></div><div class="dl-act"><button class="btn btn-ink btn-lg" id="btn-pdf" type="button">Download your report (PDF)</button><button class="btn btn-ghost" id="btn-share" type="button">Share this archetype</button><button class="btn btn-ghost" id="btn-png" type="button">Download share card</button></div><p class="dl-st" id="dl-st" aria-live="polite"></p></div>' +
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
    var ws = (CUR && CUR.words ? CUR.words : []).map(function (x) { return x.w; }).join(", ");
    var txt = cpy("share_text", "I just got my Brand DNA Report. My brand archetype is {archetype}. Find yours in four minutes: {url}").replace("{archetype}", p.name).replace("{words}", ws).replace("{url}", u.href);
    var data = { title: "I am " + p.name + " | Rise Personal", text: txt.replace(u.href, "").trim(), url: u.href };
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
    x.fillText("risepersonal.com", 90, PH - 70); x.textAlign = "right"; x.fillText("Brand DNA Report · " + n + " / 10", PW - 90, PH - 70); x.textAlign = "left";
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

    // card-list helper: fits text by shrinking the type until the page is full
    function cardPage(pg, items, y0, yMax, opt) {
      opt = opt || {}; var xx = pg.x, fs = opt.fs || 32, total;
      function measure(fs_) {
        var lh_ = Math.round(fs_ * 1.42), tot = 0;
        xx.font = "400 " + fs_ + "px 'Source Sans 3', Arial, sans-serif";
        items.forEach(function (it) {
          var n = 0; (it.t ? [it.t] : []).concat(it.bullets || []).forEach(function (tx) { n += lines(xx, tx, 900).length; });
          tot += 92 + n * lh_ + (it.bullets ? it.bullets.length * 10 : 0) + (it.foot ? lh_ - 4 : 0) + 22;
        });
        return tot;
      }
      do { total = measure(fs); if (total > yMax - y0) fs -= 1; } while (total > yMax - y0 && fs > 21);
      var lh = Math.round(fs * 1.42), y = y0;
      items.forEach(function (it) {
        var n = 0; xx.font = "400 " + fs + "px 'Source Sans 3', Arial, sans-serif";
        (it.t ? [it.t] : []).concat(it.bullets || []).forEach(function (tx) { n += lines(xx, tx, 900).length; });
        var h = 92 + n * lh + (it.bullets ? it.bullets.length * 10 : 0) + (it.foot ? lh - 4 : 0);
        xx.fillStyle = "#fff"; xx.strokeStyle = "rgba(26,26,26,.12)"; xx.lineWidth = 2; xx.beginPath(); xx.roundRect ? xx.roundRect(90, y, PW - 180, h, 24) : xx.rect(90, y, PW - 180, h); xx.fill(); xx.stroke();
        xx.font = "700 22px 'Source Sans 3', Arial, sans-serif"; xx.fillStyle = BLI; xx.textAlign = "left"; xx.fillText(it.h.toUpperCase().split("").join(" "), 125, y + 54);
        var yy = y + 54 + lh;
        if (it.t) yy = para(xx, it.t, 125, yy, 960, lh, "400 " + fs + "px 'Source Sans 3', Arial, sans-serif", INK);
        (it.bullets || []).forEach(function (bt, bi) { yy += 10; xx.font = "700 " + fs + "px 'Source Sans 3', Arial, sans-serif"; xx.fillStyle = BLI; xx.fillText((bi + 1) + ".", 125, yy); yy = para(xx, bt, 165, yy, 920, lh, "400 " + fs + "px 'Source Sans 3', Arial, sans-serif", INK); });
        if (it.foot) { para(xx, it.foot, 125, yy + 4, 960, lh - 4, "italic 400 " + (fs - 3) + "px 'Source Sans 3', Arial, sans-serif", "rgba(26,26,26,.7)"); }
        y += h + 22;
      });
      return y;
    }
    var UP = R.up;

    // 5 · introduction and headline
    pg = newPage(false); x = pg.x; y = title(pg, "Say it", "Your introduction");
    cardPage(pg, [
      { h: "Your 20-second introduction", t: UP.intro_line_template, foot: "Fill in the blanks, read it aloud with a timer, and cut the last clause if it runs over 20 seconds." },
      { h: "Three LinkedIn headline patterns", bullets: UP.linkedin_headline_formulas, foot: "Choose one. Add one of your three words if it fits naturally." },
      { h: "Two ways to open your About section", bullets: UP.about_opening_lines, foot: "Keep the opening line and replace the rest with your own." }
    ], y + 10, PH - 150);
    pageFoot(pg, 5, false, imgs); pages.push(pg);

    // 6 · rooms, conversation, stop, pace
    pg = newPage(false); x = pg.x; y = title(pg, "Show it", "Rooms and habits");
    cardPage(pg, [
      { h: "Three rooms to be in", bullets: UP.three_rooms },
      { h: "This week's conversation", t: UP.this_week_conversation },
      { h: "One thing to stop", t: UP.stop_doing },
      { h: "A pace practice for this week", t: UP.wellness_week, foot: "A pace practice for sustainable visibility. It is not health advice." }
    ], y + 10, PH - 150);
    pageFoot(pg, 6, false, imgs); pages.push(pg);

    // 7 · founder note
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
    pageFoot(pg, 7, true, imgs); pages.push(pg);

    // 8 + 9 · seven days, two pages
    pg = newPage(false); x = pg.x; y = title(pg, "Your next move", "Your first 7 days");
    y = para(x, PLAN7_INTRO, 90, y + 10, 1000, 38, "italic 400 28px 'Source Sans 3', Arial, sans-serif", "rgba(26,26,26,.75)") + 10;
    cardPage(pg, R.days.slice(0, 4).map(function (d) { return { h: d[0], t: d[1] }; }), y, PH - 150, { fs: 30 });
    pageFoot(pg, 8, false, imgs); pages.push(pg);
    pg = newPage(false); x = pg.x; y = title(pg, "Your next move", "Days 5 to 7");
    cardPage(pg, R.days.slice(4).map(function (d) { return { h: d[0], t: d[1] }; }), y + 10, PH - 150, { fs: 30 });
    pageFoot(pg, 9, false, imgs); pages.push(pg);

    // 10 · ninety days + talk to our team
    pg = newPage(false); x = pg.x; y = title(pg, "After the first week", NINETY.title);
    y = para(x, NINETY.lede, 90, y + 10, 1000, 40, "400 29px 'Source Sans 3', Arial, sans-serif", "rgba(26,26,26,.8)") + 6;
    y = cardPage(pg, NINETY.checkpoints.map(function (c) { return { h: c.when + ": " + c.name, t: c.question.replace("{ninety_day_prompt}", UP.ninety_day_prompt) }; }), y + 10, PH - 560);
    y = para(x, NINETY.closing_line, 90, y + 4, 1000, 36, "italic 400 27px 'Source Sans 3', Arial, sans-serif", "rgba(26,26,26,.75)") + 20;
    x.fillStyle = INK; x.beginPath(); x.roundRect ? x.roundRect(90, y, PW - 180, 230, 26) : x.rect(90, y, PW - 180, 230); x.fill();
    x.font = "800 56px 'Alumni Sans', Arial, sans-serif"; x.fillStyle = "#fff"; x.textAlign = "left"; x.fillText("Talk to our team", 125, y + 72);
    para(x, "Send us your archetype and the one room you want to be known in, or ask for a private 20-minute debrief. WhatsApp +971 50 683 2835  ·  " + ((CFG && CFG.email) || "") + "  ·  risepersonal.com", 125, y + 124, 980, 36, "400 27px 'Source Sans 3', Arial, sans-serif", "rgba(230,230,230,.9)");
    pageFoot(pg, 10, false, imgs); pages.push(pg);
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
