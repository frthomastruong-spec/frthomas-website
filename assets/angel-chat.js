/* Angel chatbox for frthomas.com — trilingual FAQ assistant (EN/VI/繁).
   Static-site friendly: all answers are pre-written, no server needed. */
(function () {
"use strict";

function detectLang() {
  var p = location.pathname || "";
  if (/^\/zh(\/|$)/.test(p)) return "zh";
  if (/^\/vi(\/|$)/.test(p)) return "vi";
  var h = (document.documentElement.getAttribute("lang") || "").toLowerCase();
  if (h.indexOf("zh") === 0) return "zh";
  if (h.indexOf("vi") === 0) return "vi";
  return "en";
}
var LANG = detectLang();

/* Set after the Cloudflare Worker is deployed, e.g.
   "https://angel-chat-frthomas.<sub>.workers.dev/chat". Empty = local-only mode. */
var AI_ENDPOINT = "https://angel.truonggia25.workers.dev";

var STR = {
  en: {
    title: "Angel", sub: "Assistant to Fr. Thomas", btn: "Chat with Angel",
    greet: "Hello! I\u2019m Angel, Fr. Thomas\u2019s assistant. How can I help you today?",
    placeholder: "Type your question\u2026", send: "Send", close: "Close chat",
    chips: ["Mass times", "Pilgrimage 2028", "Contact", "Books"],
    hello: "Hello! How can I help you?",
    thanks: "You\u2019re very welcome!",
    fallback: "I\u2019m not sure I understand \u2014 but you can browse the menu, or write to <a href=\"mailto:contact@frthomas.com\">contact@frthomas.com</a> and Fr. Thomas will reply."
  },
  vi: {
    title: "Angel", sub: "Tr\u1EE3 l\u00FD c\u1EE7a Cha Thomas", btn: "Tr\u00F2 chuy\u1EC7n v\u1EDBi Angel",
    greet: "Ch\u00E0o b\u1EA1n! Em l\u00E0 Angel, tr\u1EE3 l\u00FD c\u1EE7a Cha Thomas. Em gi\u00FAp g\u00EC \u0111\u01B0\u1EE3c cho b\u1EA1n?",
    placeholder: "Nh\u1EADp c\u00E2u h\u1ECFi\u2026", send: "G\u1EEDi", close: "\u0110\u00F3ng chat",
    chips: ["Gi\u1EDD l\u1EC5", "H\u00E0nh h\u01B0\u01A1ng 2028", "Li\u00EAn h\u1EC7", "S\u00E1ch"],
    hello: "Ch\u00E0o b\u1EA1n! Em gi\u00FAp g\u00EC \u0111\u01B0\u1EE3c cho b\u1EA1n?",
    thanks: "Kh\u00F4ng c\u00F3 g\u00EC \u1EA1!",
    fallback: "Em ch\u01B0a hi\u1EC3u \u00FD b\u1EA1n \u2014 b\u1EA1n c\u00F3 th\u1EC3 xem menu ph\u00EDa tr\u00EAn, ho\u1EB7c email <a href=\"mailto:contact@frthomas.com\">contact@frthomas.com</a>, Cha Thomas s\u1EBD tr\u1EA3 l\u1EDDi."
  },
  zh: {
    title: "Angel", sub: "Thomas \u795E\u7236\u7684\u52A9\u7406", btn: "\u8207 Angel \u804A\u5929",
    greet: "\u4F60\u597D\uFF01\u6211\u662F Angel\uFF0CThomas \u795E\u7236\u7684\u52A9\u7406\u3002\u6211\u53EF\u4EE5\u70BA\u4F60\u505A\u751A\u9EBC\uFF1F",
    placeholder: "\u8F38\u5165\u4F60\u7684\u554F\u984C\u2026", send: "\u767C\u9001", close: "\u95DC\u9589\u804A\u5929",
    chips: ["\u5F4C\u6492\u6642\u9593", "2028 \u671D\u8056", "\u806F\u7D61", "\u66F8\u7C4D"],
    hello: "\u4F60\u597D\uFF01\u6211\u53EF\u4EE5\u70BA\u4F60\u505A\u751A\u9EBC\uFF1F",
    thanks: "\u4E0D\u7528\u5BA2\u6C23\uFF01",
    fallback: "\u6211\u4E0D\u592A\u660E\u767D\u4F60\u7684\u610F\u601D \u2014 \u4F60\u53EF\u4EE5\u700F\u89BD\u4E0A\u9762\u7684\u9078\u55AE\uFF0C\u6216\u96FB\u90F5 <a href=\"mailto:contact@frthomas.com\">contact@frthomas.com</a>\uFF0CThomas \u795E\u7236\u6703\u56DE\u8986\u4F60\u3002"
  }
};
var S = STR[LANG];
STR.en.foundIn = "I found this"; STR.en.readMore = "Read more \u2192";
STR.vi.foundIn = "Em t\u00ECm th\u1EA5y"; STR.vi.readMore = "Xem th\u00EAm \u2192";
STR.zh.foundIn = "\u6211\u627E\u5230"; STR.zh.readMore = "\u95B1\u8B80\u66F4\u591A \u2192";

/* FAQ: keywords (lowercase) -> answers in 3 languages. Order matters: specific first. */
var FAQ = [
  { k: ["who are you", "your name", "b\u1EA1n l\u00E0 ai", "em l\u00E0 ai", "angel l\u00E0 ai", "about yourself", "\u4F60\u662F\u8AB0", "\u4F60\u662F\u8C01"],
    a: {
      en: "I\u2019m Angel, Fr. Thomas\u2019s assistant here on the website. I can help with Mass times, pilgrimage info, books, and more \u2014 just ask!",
      vi: "Em l\u00E0 Angel, tr\u1EE3 l\u00FD c\u1EE7a Cha Thomas tr\u00EAn website n\u00E0y. Em gi\u00FAp \u0111\u01B0\u1EE3c c\u00E1c vi\u1EC7c nh\u01B0 gi\u1EDD l\u1EC5, h\u00E0nh h\u01B0\u01A1ng, s\u00E1ch\u2026 \u2014 b\u1EA1n c\u1EE9 h\u1ECFi nh\u00E9!",
      zh: "\u6211\u662F Angel\uFF0CThomas \u795E\u7236\u5728\u672C\u7DB2\u7AD9\u7684\u52A9\u7406\u3002\u6211\u53EF\u4EE5\u5354\u52A9\u5F4C\u6492\u6642\u9593\u3001\u671D\u8056\u8CC7\u8A0A\u3001\u66F8\u7C4D\u7B49\u554F\u984C \u2014 \u8ACB\u96A8\u4FBF\u554F\uFF01" } },
  { k: ["thank", "c\u1EA3m \u01A1n", "cam on", "\u8B1D\u8B1D", "\u8C22\u8C22"],
    a: { en: STR.en.thanks, vi: STR.vi.thanks, zh: STR.zh.thanks } },
  { k: ["confession", "gi\u1EA3i t\u1ED9i", "giai toi", "x\u01B0ng t\u1ED9i", "xung toi", "\u544A\u89E3", "reconciliation"],
    a: {
      en: "Confessions are heard 30 minutes before each Mass. You can also write to <a href=\"mailto:contact@frthomas.com\">contact@frthomas.com</a> to arrange a time.",
      vi: "Gi\u1EA3i t\u1ED9i 30 ph\u00FAt tr\u01B0\u1EDBc m\u1ED7i th\u00E1nh l\u1EC5. B\u1EA1n c\u0169ng c\u00F3 th\u1EC3 email <a href=\"mailto:contact@frthomas.com\">contact@frthomas.com</a> \u0111\u1EC3 h\u1EB9n gi\u1EDD ri\u00EAng.",
      zh: "\u6BCF\u53F0\u5F4C\u6492\u524D30\u5206\u9418\u8FA6\u544A\u89E3\u3002\u4F60\u4E5F\u53EF\u4EE5\u96FB\u90F5 <a href=\"mailto:contact@frthomas.com\">contact@frthomas.com</a> \u9810\u7D04\u6642\u9593\u3002" } },
  { k: ["mass", "gi\u1EDD l\u1EC5", "gio le", "th\u00E1nh l\u1EC5", "thanh le", "l\u1EC5 ch\u00FAa nh\u1EADt", "le chua nhat", "sunday mass", "\u5F4C\u6492", "\u5F25\u6492", "schedule"],
    a: {
      en: "Sunday Masses: 8:00 &amp; 9:30 am (Cantonese), 11:15 am (English), 2:00 pm (Mandarin). Monday\u2013Saturday: 8:00 am (Cantonese) at the Senior Home. Saturday anticipated Mass: 4:30 pm (Mandarin). Confessions 30 minutes before each Mass.",
      vi: "L\u1EC5 Ch\u00FAa nh\u1EADt: 8:00 &amp; 9:30 (ti\u1EBFng Qu\u1EA3ng \u0110\u00F4ng), 11:15 (ti\u1EBFng Anh), 14:00 (ti\u1EBFng Quan Tho\u1EA1i). Th\u1EE9 Hai\u2013th\u1EE9 B\u1EA3y: 8:00 (ti\u1EBFng Qu\u1EA3ng \u0110\u00F4ng) t\u1EA1i Senior Home. L\u1EC5 v\u1ECDng th\u1EE9 B\u1EA3y: 16:30 (ti\u1EBFng Quan Tho\u1EA1i). Gi\u1EA3i t\u1ED9i 30 ph\u00FAt tr\u01B0\u1EDBc m\u1ED7i th\u00E1nh l\u1EC5.",
      zh: "\u4E3B\u65E5\u5F4C\u6492\uFF1A\u4E0A\u53488:00\u53CA9:30\uFF08\u5EE3\u6771\u8A71\uFF09\u3001\u4E0A\u534811:15\uFF08\u82F1\u8A9E\uFF09\u3001\u4E0B\u53482:00\uFF08\u666E\u901A\u8A71\uFF09\u3002\u9031\u4E00\u81F3\u9031\u516D\uFF1A\u4E0A\u53488:00\uFF08\u5EE3\u6771\u8A71\uFF0CSenior Home\uFF09\u3002\u9031\u516D\u63D0\u524D\u5F4C\u6492\uFF1A\u4E0B\u53484:30\uFF08\u666E\u901A\u8A71\uFF09\u3002\u6BCF\u53F0\u5F4C\u6492\u524D30\u5206\u9418\u8FA6\u544A\u89E3\u3002" } },
  { k: ["pilgrimage", "h\u00E0nh h\u01B0\u01A1ng", "hanh huong", "\u671D\u8056", "\u671D\u5723", "la vang", "ph\u00E1t di\u1EC7m", "phat diem"],
    a: {
      en: "Fr. Thomas is leading a 14-day pilgrimage to Vietnam, January 8\u201321, 2028 (max 35 pilgrims, about C$3,500\u20134,000 per person), with the ordination-anniversary Mass at Ph\u00E1t Di\u1EC7m and La Vang at its heart. <a href=\"/pilgrimage/\">See the full program</a> \u2014 or write to <a href=\"mailto:pilgrimage@frthomas.com\">pilgrimage@frthomas.com</a> to register your interest.",
      vi: "Cha Thomas t\u1ED5 ch\u1EE9c h\u00E0nh h\u01B0\u01A1ng Vi\u1EC7t Nam 14 ng\u00E0y, 8\u201321/1/2028 (t\u1ED1i \u0111a 35 ng\u01B0\u1EDDi, kho\u1EA3ng C$3.500\u20134.000/ng\u01B0\u1EDDi), v\u1EDBi l\u1EC5 k\u1EF7 ni\u1EC7m th\u1EE5 phong t\u1EA1i Ph\u00E1t Di\u1EC7m v\u00E0 tr\u1ECDng t\u00E2m l\u00E0 La Vang. <a href=\"/vi/hanh-huong/\">Xem ch\u01B0\u01A1ng tr\u00ECnh chi ti\u1EBFt</a> \u2014 ho\u1EB7c email <a href=\"mailto:pilgrimage@frthomas.com\">pilgrimage@frthomas.com</a> \u0111\u1EC3 \u0111\u0103ng k\u00FD.",
      zh: "Thomas \u795E\u7236\u5C07\u65BC2028\u5E741\u67088\u201321\u65E5\u5E36\u981814\u5929\u8D8A\u5357\u671D\u8056\u5718\uFF08\u4E0A\u965035\u4EBA\uFF0C\u6BCF\u4EBA\u7D04C$3,500\u20134,000\uFF09\uFF0C\u5305\u62EC\u767C\u8C54\u6649\u929E\u9031\u5E74\u5F4C\u6492\uFF0C\u4E26\u4EE5\u62C9\u671B\u8056\u6BCD\u671D\u8056\u5730\u70BA\u6838\u5FC3\u3002<a href=\"/zh/hanh-huong/\">\u67E5\u770B\u5B8C\u6574\u884C\u7A0B</a> \u2014 \u6216\u96FB\u90F5 <a href=\"mailto:pilgrimage@frthomas.com\">pilgrimage@frthomas.com</a> \u5831\u540D\u3002" } },
  { k: ["book", "s\u00E1ch", "sach", "coloring", "t\u00F4 m\u00E0u", "to mau", "amazon", "\u66F8", "\u586B\u8272"],
    a: {
      en: "Fr. Thomas\u2019s Catholic coloring books for children are listed under <a href=\"/sach/\">Books &amp; Resources</a>.",
      vi: "S\u00E1ch t\u00F4 m\u00E0u C\u00F4ng gi\u00E1o cho thi\u1EBFu nhi c\u1EE7a Cha Thomas c\u00F3 t\u1EA1i m\u1EE5c <a href=\"/sach/\">Books &amp; Resources</a>.",
      zh: "Thomas \u795E\u7236\u7684\u5152\u7AE5\u5929\u4E3B\u6559\u586B\u8272\u66F8\u520A\u767B\u65BC <a href=\"/sach/\">Books &amp; Resources</a>\u3002" } },
  { k: ["homily", "homilies", "b\u00E0i gi\u1EA3ng", "bai giang", "gi\u1EA3ng l\u1EC5", "giang le", "suy ni\u1EC7m", "suy niem", "\u8B1B\u9053", "reflection"],
    a: {
      en: "Homily notes and reflections are at <a href=\"/bai-giang/\">Homilies &amp; Talks</a>.",
      vi: "G\u1EE3i \u00FD b\u00E0i gi\u1EA3ng v\u00E0 suy ni\u1EC7m t\u1EA1i <a href=\"/bai-giang/\">Homilies &amp; Talks</a>.",
      zh: "\u8B1B\u9053\u7B46\u8A18\u53CA\u53CD\u7701\u520A\u767B\u65BC <a href=\"/bai-giang/\">Homilies &amp; Talks</a>\u3002" } },
  { k: ["bible", "kinh th\u00E1nh", "kinh thanh", "h\u1ECDc h\u1ECFi", "hoc hoi", "\u8056\u7D93", "\u5723\u7ECF"],
    a: {
      en: "Weekly Bible-study questions (Vietnamese + Traditional Chinese) are at <a href=\"/hoc-kinh-thanh/\">Bible Study</a>.",
      vi: "C\u00E2u h\u1ECFi h\u1ECDc h\u1ECFi Kinh Th\u00E1nh h\u1EB1ng tu\u1EA7n (ti\u1EBFng Vi\u1EC7t + ti\u1EBFng Hoa ph\u1ED3n th\u1EC3) t\u1EA1i <a href=\"/hoc-kinh-thanh/\">Bible Study</a>.",
      zh: "\u6BCF\u9031\u8056\u7D93\u7814\u8B80\u554F\u984C\uFF08\u8D8A\u5357\u6587\uFF0B\u7E41\u9AD4\u4E2D\u6587\uFF09\u520A\u767B\u65BC <a href=\"/hoc-kinh-thanh/\">Bible Study</a>\u3002" } },
  { k: ["cantonese", "ti\u1EBFng qu\u1EA3ng", "tieng quang", "qu\u1EA3ng \u0111\u00F4ng", "quang dong", "\u5EE3\u6771\u8A71", "\u5E7F\u4E1C\u8BDD", "\u7CB5\u8A9E", "\u7CA4\u8BED"],
    a: {
      en: "Daily Cantonese lessons are at <a href=\"/sach/hoc-tieng-quang/\">H\u1ECDc ti\u1EBFng Qu\u1EA3ng m\u1ED7i ng\u00E0y</a>.",
      vi: "B\u00E0i h\u1ECDc ti\u1EBFng Qu\u1EA3ng m\u1ED7i ng\u00E0y t\u1EA1i <a href=\"/sach/hoc-tieng-quang/\">H\u1ECDc ti\u1EBFng Qu\u1EA3ng m\u1ED7i ng\u00E0y</a>.",
      zh: "\u6BCF\u65E5\u5EE3\u6771\u8A71\u8AB2\u7A0B\u520A\u767B\u65BC <a href=\"/sach/hoc-tieng-quang/\">H\u1ECDc ti\u1EBFng Qu\u1EA3ng m\u1ED7i ng\u00E0y</a>\u3002" } },
  { k: ["parish", "gi\u00E1o x\u1EE9", "giao xu", "nh\u00E0 th\u1EDD", "nha tho", "\u5802\u5340", "\u5802\u533A", "sfx", "st francis", "vancouver"],
    a: {
      en: "Fr. Thomas serves at St. Francis Xavier Parish in Vancouver, Canada.",
      vi: "Cha Thomas ph\u1EE5c v\u1EE5 t\u1EA1i gi\u00E1o x\u1EE9 St. Francis Xavier, Vancouver, Canada.",
      zh: "Thomas \u795E\u7236\u5728\u52A0\u62FF\u5927\u6EAB\u54E5\u83EF St. Francis Xavier \u5802\u5340\u670D\u52D9\u3002" } },
  { k: ["contact", "li\u00EAn h\u1EC7", "lien he", "email", "\u806F\u7D61", "\u8054\u7CFB", "\u806F\u7E6B", "phone", "\u0111i\u1EC7n tho\u1EA1i", "dienthoai"],
    a: {
      en: "You can reach Fr. Thomas at <a href=\"mailto:contact@frthomas.com\">contact@frthomas.com</a>.",
      vi: "B\u1EA1n c\u00F3 th\u1EC3 li\u00EAn h\u1EC7 Cha Thomas qua email <a href=\"mailto:contact@frthomas.com\">contact@frthomas.com</a>.",
      zh: "\u4F60\u53EF\u4EE5\u900F\u904E\u96FB\u90F5 <a href=\"mailto:contact@frthomas.com\">contact@frthomas.com</a> \u806F\u7D61 Thomas \u795E\u7236\u3002" } },
  { k: ["about thomas", "about fr", "about cha", "about father", "fr thomas", "cha thomas", "father thomas", "l\u00E0 ai", "la ai", "who is", "\u95DC\u65BC", "\u5173\u4E8E", "phaol\u00F4", "phaolo", "ti\u1EC3u s\u1EED", "tieu su"],
    a: {
      en: "Fr. Thomas Truong (Phaol\u00F4 L\u00EA-B\u1EA3o-T\u1ECBnh) is a Catholic priest serving at St. Francis Xavier Parish in Vancouver. <a href=\"/about/\">More about him</a>.",
      vi: "Cha Phaol\u00F4 L\u00EA-B\u1EA3o-T\u1ECBnh (Fr. Thomas Truong) l\u00E0 linh m\u1EE5c ph\u1EE5c v\u1EE5 t\u1EA1i gi\u00E1o x\u1EE9 St. Francis Xavier, Vancouver. <a href=\"/vi/about/\">T\u00ECm hi\u1EC3u th\u00EAm</a>.",
      zh: "Thomas \u795E\u7236\uFF08Phaol\u00F4 L\u00EA-B\u1EA3o-T\u1ECBnh\uFF09\u662F\u5728\u6EAB\u54E5\u83EF St. Francis Xavier \u5802\u5340\u670D\u52D9\u7684\u5929\u4E3B\u6559\u795E\u7236\u3002<a href=\"/zh/about/\">\u66F4\u591A\u4ECB\u7D39</a>\u3002" } }
];

var GREET_RE = /^(hello|hi|hey|good morning|good afternoon|good evening|xin ch\u00E0o|ch\u00E0o|\u4F60\u597D|\u60A8\u597D)[\s!.,?]*$/;

function findAnswer(q) {
  var s = q.toLowerCase().trim();
  if (!s) return null;
  if (GREET_RE.test(s)) return S.hello;
  for (var i = 0; i < FAQ.length; i++) {
    var e = FAQ[i];
    for (var j = 0; j < e.k.length; j++) {
      if (s.indexOf(e.k[j]) !== -1) return e.a[LANG];
    }
  }
  return null;
}

/* ---- Site content index: every public page, lazy-loaded on first open ---- */
var AIDX = null, aidxPromise = null;
function loadIndex() {
  if (aidxPromise) return aidxPromise;
  aidxPromise = fetch("/assets/angel-index.json")
    .then(function (r) { return r.ok ? r.json() : []; })
    .then(function (d) { AIDX = Array.isArray(d) ? d : []; return AIDX; })
    .catch(function () { AIDX = []; return AIDX; });
  return aidxPromise;
}
function norm(s) {
  return (s || "").toLowerCase().normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u0111/g, "d")
    .replace(/[^\p{L}\p{N}\s]/gu, " ");
}
function esc(s) {
  return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function termsOf(q) {
  var nq = norm(q);
  var cjk = /[一-鿿]/.test(q);
  var terms = nq.split(/\s+/).filter(function (t) { return t.length >= (cjk ? 2 : 3); });
  if (cjk) {
    var joined = nq.replace(/\s+/g, "");
    if (joined.length >= 2 && terms.indexOf(joined) === -1) terms.push(joined);
  }
  return terms;
}
function searchTop(q, n) {
  if (!AIDX || !AIDX.length) return null;
  var terms = termsOf(q);
  if (!terms.length) return null;
  var phrase = norm(q).replace(/\s+/g, " ").trim();
  var scored = [], i, j;
  for (i = 0; i < AIDX.length; i++) {
    var p = AIDX[i];
    var xt = norm(p.x), tt = norm(p.t), score = 0;
    for (j = 0; j < terms.length; j++) {
      score += (xt.split(terms[j]).length - 1) + (tt.split(terms[j]).length - 1) * 4;
    }
    if (phrase.length > 4 && xt.indexOf(phrase) !== -1) score += 10;
    if (p.l === LANG) score *= 1.6;
    if (score >= 3) scored.push({ p: p, score: score });
  }
  scored.sort(function (a, b) { return b.score - a.score; });
  var out = [], lim = Math.min(n || 3, scored.length), t;
  for (t = 0; t < lim; t++) {
    var pg = scored[t].p;
    var sents = pg.x.split(/(?<=[.!?…。！？])\s+/);
    var bs = "", bsScore = -1, k, m;
    for (k = 0; k < sents.length; k++) {
      var sn = norm(sents[k]), sc = 0;
      for (m = 0; m < terms.length; m++) sc += sn.split(terms[m]).length - 1;
      if (sc > bsScore) { bsScore = sc; bs = sents[k]; }
    }
    out.push({ u: pg.u, t: pg.t, excerpt: (bs ? bs.trim() : pg.x).slice(0, 280) });
  }
  return out;
}
function searchIndex(q) {
  var top = searchTop(q, 1);
  if (!top.length) return null;
  var b = top[0];
  return esc(S.foundIn) + ' <a href="' + b.u + '">' + esc(b.t) + '</a>:<br>' +
    '<span class="angel-quote">' + esc(b.excerpt) + '</span><br>' +
    '<a href="' + b.u + '">' + esc(S.readMore) + '</a>';
}

/* ---- UI ---- */
function el(tag, cls, html) {
  var d = document.createElement(tag);
  if (cls) d.className = cls;
  if (html != null) d.innerHTML = html;
  return d;
}

var btn = el("button", null,
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg><span class="angel-dot"></span>');
btn.id = "angel-chat-btn";
btn.setAttribute("aria-label", S.btn);
btn.setAttribute("title", S.btn);

var panel = el("div");
panel.id = "angel-chat-panel";
panel.setAttribute("role", "dialog");
panel.setAttribute("aria-label", S.title);

var head = el("div", null,
  '<div class="angel-avatar">A</div>' +
  '<div><div class="angel-title">' + S.title + '</div><div class="angel-sub">' + S.sub + '</div></div>');
head.id = "angel-chat-head";
var closeBtn = el("button", null, "\u00D7");
closeBtn.id = "angel-chat-close";
closeBtn.setAttribute("aria-label", S.close);
head.appendChild(closeBtn);

var msgs = el("div");
msgs.id = "angel-chat-msgs";
var chips = el("div");
chips.id = "angel-chat-chips";
var form = el("form");
form.id = "angel-chat-form";
var input = el("input");
input.id = "angel-chat-input";
input.type = "text";
input.placeholder = S.placeholder;
input.setAttribute("aria-label", S.placeholder);
input.autocomplete = "off";
var sendBtn = el("button", null,
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>');
sendBtn.id = "angel-chat-send";
sendBtn.type = "submit";
sendBtn.setAttribute("aria-label", S.send);
form.appendChild(input);
form.appendChild(sendBtn);

panel.appendChild(head);
panel.appendChild(msgs);
panel.appendChild(chips);
panel.appendChild(form);
document.body.appendChild(btn);
document.body.appendChild(panel);

function scrollDown() { msgs.scrollTop = msgs.scrollHeight; }

function addMsg(text, who) {
  var m = el("div", "angel-msg " + who);
  if (who === "bot") {
    m.innerHTML = '<span class="angel-name">' + S.title + '</span>' + text;
  } else {
    m.textContent = text;
  }
  msgs.appendChild(m);
  scrollDown();
  return m;
}

var AI_HISTORY = [];
function stripTags(h) { return String(h).replace(/<[^>]*>/g, ""); }
function aiReply(q, done, onFail) {
  function fail() { if (onFail) onFail(); }
  var ctx = "";
  try {
    ctx = searchTop(q, 3).map(function (r) {
      return "[" + r.t + "](" + r.u + ") " + r.excerpt;
    }).join("\n\n").slice(0, 4000);
  } catch (e) { ctx = ""; }
  var ctrl = null, timedOut = false;
  try { ctrl = new AbortController(); } catch (e) { fail(); return; }
  var to = setTimeout(function () { timedOut = true; try { ctrl.abort(); } catch (e) {} }, 20000);
  fetch(AI_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: q, lang: LANG, context: ctx, history: AI_HISTORY.slice(-6) }),
    signal: ctrl.signal
  }).then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) {
      clearTimeout(to);
      if (d && d.reply) {
        AI_HISTORY.push({ role: "user", content: q });
        AI_HISTORY.push({ role: "assistant", content: String(d.reply).slice(0, 2000) });
        if (AI_HISTORY.length > 12) AI_HISTORY = AI_HISTORY.slice(-12);
        done(esc(d.reply).replace(/\n/g, "<br>"));
      } else fail();
    })
    .catch(function () { clearTimeout(to); fail(); });
}
function botReply(q) {
  var t = el("div", "angel-typing", "<i></i><i></i><i></i>");
  msgs.appendChild(t);
  scrollDown();
  var t0 = Date.now();
  function done(html) {
    var wait = Math.max(0, 650 - (Date.now() - t0));
    setTimeout(function () { t.remove(); addMsg(html, "bot"); }, wait);
  }
  function local() { loadIndex().then(function () { done(searchIndex(q) || S.fallback); }); }
  var faq = findAnswer(q);
  if (faq) { done(faq); return; }
  if (AI_ENDPOINT) { aiReply(q, done, local); } else { local(); }
}

function send(text) {
  var q = (text || "").trim();
  if (!q) return;
  addMsg(q, "user");
  input.value = "";
  botReply(q);
}

S.chips.forEach(function (c) {
  var b = el("button", "angel-chip", null);
  b.type = "button";
  b.textContent = c;
  b.addEventListener("click", function () { send(c); });
  chips.appendChild(b);
});

var greeted = false;
function toggle(open) {
  var willOpen = (typeof open === "boolean") ? open : !panel.classList.contains("open");
  panel.classList.toggle("open", willOpen);
  btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
  if (willOpen) {
    if (!greeted) { greeted = true; addMsg(S.greet, "bot"); loadIndex(); }
    setTimeout(function () { input.focus(); }, 60);
  }
}
btn.addEventListener("click", function () { toggle(); });
closeBtn.addEventListener("click", function () { toggle(false); });
form.addEventListener("submit", function (e) { e.preventDefault(); send(input.value); });
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && panel.classList.contains("open")) toggle(false);
});
})();
