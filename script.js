/* script.js — ZenQuiz Final (50 unique questions)
   - Uses IDs from provided HTML:
     startBtn, startScreen, gameContainer, level, score, options,
     popup, popupTitle, popupMessage, restartBtn, leaderboardBtn,
     leaderboard, leaderboardList, backBtn
   - Audio IDs: correctSound, wrongSound
   - Persistent keys: zen_order_v6, zen_pos_v6, zen_score_v6, zen_leaderboard_v6
*/

/* ====== Elements ====== */
const startBtn = document.getElementById("startBtn");
const startScreen = document.getElementById("startScreen");
const gameContainer = document.getElementById("gameContainer");
const levelEl = document.getElementById("level");
const scoreEl = document.getElementById("score");
const optionsContainer = document.getElementById("options");

const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupMessage = document.getElementById("popupMessage");
const restartBtn = document.getElementById("restartBtn");
const leaderboardBtn = document.getElementById("leaderboardBtn");

const leaderboardScreen = document.getElementById("leaderboard");
const leaderboardList = document.getElementById("leaderboardList");
const backBtn = document.getElementById("backBtn");

const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

/* ====== QUESTIONS (50 unique mix) ====== */
const QUESTIONS = [
  { q: "What has to be broken before you can use it?", answer: "Egg", options:["Egg","Stone","Seal","Glass"] },
  { q: "What has hands but can't clap?", answer: "Clock", options:["Clock","Human","Chair","Tree"] },
  { q: "What has a head and a tail but no body?", answer: "Coin", options:["Coin","Snake","Pen","Ribbon"] },
  { q: "What gets wetter as it dries?", answer: "Towel", options:["Towel","Rain","Sponge","Sun"] },
  { q: "What has keys but can't open locks?", answer: "Piano", options:["Piano","Map","Car","House"] },

  { q: "What is the capital of India?", answer: "New Delhi", options:["Mumbai","New Delhi","Kolkata","Chennai"] },
  { q: "Which planet is known as the Red Planet?", answer: "Mars", options:["Mars","Venus","Jupiter","Mercury"] },
  { q: "What gas do plants produce?", answer: "Oxygen", options:["Oxygen","Carbon dioxide","Nitrogen","Hydrogen"] },
  { q: "Who wrote 'Romeo and Juliet'?", answer: "William Shakespeare", options:["William Shakespeare","Tolstoy","Austen","Hemingway"] },
  { q: "What is H2O commonly called?", answer: "Water", options:["Water","Hydrogen","Oxygen","Salt"] },

  { q: "Find next: 2, 4, 8, 16, ?", answer: "32", options:["24","30","32","36"] },
  { q: "If A=1, B=2, ... Z=?, what is Z?", answer: "26", options:["25","26","27","24"] },
  { q: "If 3 cats catch 3 mice in 3 minutes, how many cats to catch 6 mice in 6 minutes?", answer: "3", options:["3","6","2","4"] },
  { q: "What runs but never walks?", answer: "Water", options:["Water","Car","Dog","Clock"] },
  { q: "What can fill a room but takes no space?", answer: "Light", options:["Light","Air","Sound","Dust"] },

  { q: "What is the largest planet in the solar system?", answer: "Jupiter", options:["Jupiter","Saturn","Earth","Mars"] },
  { q: "Which animal is the fastest on land?", answer: "Cheetah", options:["Cheetah","Lion","Tiger","Horse"] },
  { q: "What building has the most stories?", answer: "Library", options:["Library","Skyscraper","House","School"] },
  { q: "Which ocean is the largest?", answer: "Pacific", options:["Pacific","Atlantic","Indian","Arctic"] },
  { q: "What has one eye but cannot see?", answer: "Needle", options:["Needle","Storm","Potato","Cyclops"] },

  { q: "What gets bigger the more you take away?", answer: "Hole", options:["Hole","Debt","Shadow","Pit"] },
  { q: "How many continents are there on Earth?", answer: "Seven", options:["Five","Six","Seven","Eight"] },
  { q: "Which river is the longest in the world?", answer: "Nile", options:["Nile","Amazon","Yangtze","Mississippi"] },
  { q: "Who discovered gravity?", answer: "Isaac Newton", options:["Isaac Newton","Galileo","Einstein","Tesla"] },
  { q: "Which planet has rings?", answer: "Saturn", options:["Saturn","Jupiter","Uranus","Neptune"] },

  { q: "Which country is called the Land of the Rising Sun?", answer: "Japan", options:["Japan","China","Korea","Thailand"] },
  { q: "What is the hardest natural substance?", answer: "Diamond", options:["Diamond","Gold","Iron","Graphite"] },
  { q: "What is the boiling point of water at sea level (°C)?", answer: "100", options:["90","100","80","120"] },
  { q: "What is the currency of the United States?", answer: "Dollar", options:["Dollar","Euro","Rupee","Yen"] },
  { q: "I speak without a mouth and hear without ears. What am I?", answer: "Echo", options:["Echo","Wind","Shadow","Silence"] },

  { q: "What comes once in a minute, twice in a moment, but never in a thousand years?", answer: "Letter M", options:["Letter M","Second","Hour","Century"] },
  { q: "If 9 + 1 = 910 (concat), then 8 + 2 = ?", answer: "810", options:["10","810","82","20"] },
  { q: "If 1=5, 2=25, 3=125 then 4 = ?", answer: "625", options:["256","625","512","1024"] },
  { q: "What has roots that nobody sees and is taller than trees?", answer: "Mountain", options:["Mountain","Tree","Plant","Rock"] },
  { q: "Which is the tallest mountain in the world?", answer: "Mount Everest", options:["Mount Everest","K2","Kangchenjunga","Lhotse"] },

  { q: "What has many teeth but cannot bite?", answer: "Comb", options:["Comb","Saw","Fork","Gear"] },
  { q: "What can you catch but not throw?", answer: "Cold", options:["Cold","Ball","Fish","Stone"] },
  { q: "What has keys but no locks, space but no room?", answer: "Keyboard", options:["Keyboard","Piano","Map","Phone"] },
  { q: "What has four fingers and a thumb but isn't alive?", answer: "Glove", options:["Glove","Hand","Robot","Statue"] },
  { q: "The more you take, the more you leave behind. What am I?", answer: "Footsteps", options:["Footsteps","Time","Money","Memories"] },

  { q: "What can travel around the world while staying in one spot?", answer: "Stamp", options:["Stamp","Sun","Moon","Clock"] },
  { q: "I am not alive but grow; I don't have lungs but need air. What am I?", answer: "Fire", options:["Fire","Plant","Cloud","Dust"] },
  { q: "What can run but never walks, has a mouth but never talks?", answer: "River", options:["River","Car","Dog","Clock"] },
  { q: "Which organ pumps blood through the body?", answer: "Heart", options:["Heart","Liver","Lungs","Kidney"] },
  { q: "Which gas is most essential for human respiration?", answer: "Oxygen", options:["Oxygen","Carbon dioxide","Nitrogen","Helium"] },

  { q: "Which animal is largest mammal?", answer: "Blue whale", options:["Blue whale","Elephant","Whale shark","Hippo"] },
  { q: "Which scientist developed the theory of relativity?", answer: "Albert Einstein", options:["Albert Einstein","Isaac Newton","Galileo","Tesla"] },
  { q: "How many colors in a rainbow?", answer: "Seven", options:["Six","Seven","Eight","Nine"] },
  { q: "What is the national animal of India?", answer: "Tiger", options:["Tiger","Elephant","Lion","Leopard"] },
  { q: "Which bird can imitate human speech?", answer: "Parrot", options:["Parrot","Sparrow","Crow","Pigeon"] },

  { q: "What is the currency of Japan?", answer: "Yen", options:["Yen","Dollar","Rupee","Euro"] },
  { q: "Who was the first person to step on the Moon?", answer: "Neil Armstrong", options:["Neil Armstrong","Buzz Aldrin","Yuri Gagarin","Michael Collins"] },
  { q: "What is the chemical formula of water?", answer: "H2O", options:["H2O","CO2","O2","NaCl"] },
  { q: "Which organ helps in digestion by producing bile?", answer: "Liver", options:["Liver","Kidney","Pancreas","Stomach"] },
  { q: "What is the smallest prime number?", answer: "2", options:["1","2","3","5"] }
];

/* ====== Storage keys and state ====== */
const KEY_ORDER = "zen_order_v6";
const KEY_POS = "zen_pos_v6";
const KEY_SCORE = "zen_score_v6";
const KEY_LB = "zen_leaderboard_v6";

function loadJSON(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch (e) { return fallback; }
}
function saveJSON(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
}

/* initialize persistent order (non-repeating) */
let order = loadJSON(KEY_ORDER, null);
if (!Array.isArray(order) || order.length !== QUESTIONS.length) {
  order = QUESTIONS.map((_, i) => i);
  // Fisher-Yates shuffle to randomize order
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  saveJSON(KEY_ORDER, order);
}

/* position & score */
let pos = Number(localStorage.getItem(KEY_POS));
if (!Number.isInteger(pos) || pos < 0) pos = 0;

let score = Number(localStorage.getItem(KEY_SCORE));
if (!Number.isInteger(score)) score = 0;

/* leaderboard */
let leaderboard = loadJSON(KEY_LB, []);

/* ====== UI helpers ====== */
function updateScore() {
  if (scoreEl) scoreEl.textContent = score;
}
function updateLevel() {
  if (levelEl) levelEl.textContent = (pos + 1) + " / " + QUESTIONS.length;
}

/* ====== Start / Continue behavior ====== */
if (pos > 0 && pos < order.length) {
  // continue option
  if (startBtn) startBtn.textContent = "Continue Game";
}

/* start button */
startBtn && startBtn.addEventListener("click", () => {
  startScreen && (startScreen.style.display = "none");
  gameContainer && (gameContainer.classList.remove("hidden"), gameContainer.style.display = "block");
  updateScore(); updateLevel();
  loadQuestion();
});

/* ====== Load current question ====== */
function loadQuestion() {
  // if finished
  if (pos >= order.length) {
    return finishGame();
  }
  const qIndex = order[pos];
  const item = QUESTIONS[qIndex];

  // show question
  const questionTitle = document.getElementById("question");
  if (questionTitle) questionTitle.textContent = item.q;

  // prepare options (shuffle)
  const opts = item.options.map(o => ({ text: o, correct: o === item.answer }));
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }

  // render buttons
  if (optionsContainer) {
    optionsContainer.innerHTML = "";
    opts.forEach(opt => {
      const b = document.createElement("button");
      b.className = "option";
      b.textContent = opt.text;
      b.onclick = () => handleAnswer(b, opt.correct);
      optionsContainer.appendChild(b);
    });
  }

  updateScore();
  updateLevel();
}

/* ====== Answer handling ====== */
function handleAnswer(buttonEl, isCorrect) {
  // disable all options immediately
  const all = optionsContainer.querySelectorAll("button");
  all.forEach(x => x.disabled = true);

  if (isCorrect) {
    // +10
    score += 10;
    buttonEl.classList.add("correct");
    try { correctSound.currentTime = 0; correctSound.play(); } catch(e){}
  } else {
    // -5
    score -= 5;
    buttonEl.classList.add("wrong");
    try { wrongSound.currentTime = 0; wrongSound.play(); } catch(e){}
  }

  // persist score
  saveJSON(KEY_SCORE, score);
  updateScore();

  // move to next after delay
  setTimeout(() => {
    pos++;
    saveJSON(KEY_POS, pos);
    // if reached end
    if (pos >= order.length) {
      finishGame();
    } else {
      // silent difficulty: we don't show alert; UI shows level number
      loadQuestion();
    }
  }, 700);
}

/* ====== Finish & show popup / save flow ====== */
function finishGame() {
  // hide game container
  gameContainer && (gameContainer.classList.add("hidden"), gameContainer.style.display = "none");

  // prepare IQ message
  let msg = "";
  if (score < 100) msg = "Your IQ was low — work hard!";
  else if (score < 200) msg = "Nice try! Keep practicing!";
  else if (score < 300) msg = "Very good — but work a little harder!";
  else msg = "Excellent! Genius level IQ!";

  // show popup
  if (popup) {
    popup.style.display = "flex";
    popupTitle && (popupTitle.textContent = "Quiz Complete 🎉");
    popupMessage && (popupMessage.textContent = msg + " — Your score: " + score);
  }

  // wait a moment then prompt to save name
  setTimeout(() => {
    const name = prompt("Enter name to save score on leaderboard (leave empty to skip):", "Player");
    if (name && name.trim()) {
      leaderboard.push({ name: name.trim(), score: score, date: Date.now() });
      // sort desc and keep top 30
      leaderboard.sort((a,b) => b.score - a.score);
      leaderboard = leaderboard.slice(0, 30);
      saveJSON(KEY_LB, leaderboard);
    }
    renderLeaderboard();
  }, 300);
}

/* ====== Leaderboard rendering (animated cards) ====== */
function renderLeaderboard() {
  // hide popup when showing leaderboard
  if (popup) popup.style.display = "none";
  if (leaderboardScreen) {
    leaderboardScreen.classList.remove("hidden");
    leaderboardScreen.style.display = "block";
  }
  if (!leaderboardList) return;

  leaderboardList.innerHTML = "";
  if (!leaderboard || leaderboard.length === 0) {
    leaderboardList.innerHTML = "<p style='color:#556'>No scores yet.</p>";
    return;
  }
  // show top 10
  const top = leaderboard.slice(0, 10);
  top.forEach((entry, i) => {
    const card = document.createElement("div");
    card.className = "leaderboard-card";
    card.style.animationDelay = (i * 80) + "ms";
    card.innerHTML = `
      <strong style="color:#0077cc">${i+1}. ${escapeHtml(entry.name)}</strong>
      <div style="font-weight:700">${entry.score} pts</div>
      <small style="color:#667">${new Date(entry.date).toLocaleString()}</small>
    `;
    leaderboardList.appendChild(card);
  });
}

/* ====== Restart / Back handlers ====== */
restartBtn && restartBtn.addEventListener("click", () => {
  // full restart: clear progress but keep leaderboard
  if (!confirm("Start a new game? Current progress will reset.")) return;
  pos = 0;
  score = 0;
  // create new randomized order
  order = QUESTIONS.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  saveJSON(KEY_ORDER, order);
  saveJSON(KEY_POS, pos);
  saveJSON(KEY_SCORE, score);
  // UI
  leaderboardScreen && (leaderboardScreen.classList.add("hidden"), leaderboardScreen.style.display = "none");
  startScreen && (startScreen.style.display = "block");
  popup && (popup.style.display = "none");
  gameContainer && (gameContainer.classList.add("hidden"), gameContainer.style.display = "none");
  if (startBtn) startBtn.textContent = "Start Game";
});

leaderboardBtn && leaderboardBtn.addEventListener("click", () => {
  renderLeaderboard();
});

backBtn && backBtn.addEventListener("click", () => {
  // go back to home/start screen
  leaderboardScreen && (leaderboardScreen.classList.add("hidden"), leaderboardScreen.style.display = "none");
  popup && (popup.style.display = "none");
  startScreen && (startScreen.style.display = "block");
});

/* ====== Utility: escape html ====== */
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]); });
}

/* ====== On load: update UI placeholders ====== */
(function boot() {
  updateScore();
  updateLevel();
  // if already finished
  if (pos >= order.length) {
    // show popup with final info
    finishGame();
  }
})();