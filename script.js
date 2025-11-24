// script.js — ZenQuiz with Firebase global leaderboard
// IMPORTANT: Replace firebaseConfig below with YOUR Firebase project config
// from Firebase console (step: Add app -> config).

/* ======= FIREBASE CONFIG - REPLACE THIS WITH YOUR CONFIG ======== */
const firebaseConfig = {
  apiKey: "REPLACE_APIKEY",
  authDomain: "REPLACE_AUTHDOMAIN",
  databaseURL: "REPLACE_DATABASE_URL",
  projectId: "REPLACE_PROJECTID",
  storageBucket: "REPLACE_BUCKET",
  messagingSenderId: "REPLACE_SENDERID",
  appId: "REPLACE_APPID"
};
/* ================================================================= */

// init firebase (compat SDK used)
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// --- DOM elements ---
const startScreen = document.getElementById('startScreen');
const startBtn = document.getElementById('startBtn');
const playerNameInput = document.getElementById('playerNameInput');
const leaderPreviewList = document.getElementById('leaderPreviewList');

const gameScreen = document.getElementById('gameScreen');
const levelText = document.getElementById('levelText');
const scoreText = document.getElementById('scoreText');
const questionText = document.getElementById('questionText');
const optionsBox = document.getElementById('optionsBox');

const resultScreen = document.getElementById('resultScreen');
const finalScoreText = document.getElementById('finalScoreText');
const iqText = document.getElementById('iqText');
const saveNameInput = document.getElementById('saveNameInput');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const leaderboardBox = document.getElementById('leaderboardBox');

const sndCorrect = document.getElementById('sndCorrect');
const sndWrong = document.getElementById('sndWrong');

const timerFill = document.getElementById('timerFill');
const confettiCanvas = document.getElementById('confettiCanvas');

let playerName = localStorage.getItem('zen_name') || '';
let questions = [];
let currentIndex = 0;
let score = 0;
let answering = false;

// timer
const TIME_PER_Q = 15;
let timerInterval = null;
let timerRemaining = TIME_PER_Q;

// confetti
let confettiCtx, confettiParts = [], confettiAnim;
function confettiInit(){
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  confettiCtx = confettiCanvas.getContext('2d');
}
function confettiStart(){
  confettiParts = [];
  for(let i=0;i<120;i++){
    confettiParts.push({
      x: Math.random()*confettiCanvas.width,
      y: Math.random()*-confettiCanvas.height,
      w: 6+Math.random()*8,
      h: 8+Math.random()*12,
      vx: -3 + Math.random()*6,
      vy: 2 + Math.random()*6,
      color: ['#ff7aa2','#00d1ff','#ffd166','#9b8cff'][Math.floor(Math.random()*4)],
      rot: Math.random()*360
    });
  }
  cancelAnimationFrame(confettiAnim);
  (function loop(){
    confettiCtx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
    confettiParts.forEach(p=>{
      p.x += p.vx; p.y += p.vy; p.rot += 6;
      confettiCtx.save();
      confettiCtx.translate(p.x,p.y);
      confettiCtx.rotate(p.rot * Math.PI/180);
      confettiCtx.fillStyle = p.color;
      confettiCtx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
      confettiCtx.restore();
      if(p.y > confettiCanvas.height + 50) { p.y = -50; p.x = Math.random()*confettiCanvas.width; }
    });
    confettiAnim = requestAnimationFrame(loop);
  })();
  setTimeout(()=>{ cancelAnimationFrame(confettiAnim); confettiCtx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height); }, 5000);
}
window.addEventListener('resize', confettiInit);
confettiInit();

// helper shuffle
function shuffleArray(arr){ for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]];} return arr; }

// ===== Questions (75 total: EASY 25, MEDIUM 25, HARD 25) =====
// (same question sets as earlier — keep them here)
const EASY = [
  {q:"What is the capital of India?", a:"New Delhi", o:["New Delhi","Mumbai","Kolkata","Chennai"]},
  {q:"2 + 2 = ?", a:"4", o:["3","4","5","6"]},
  {q:"Which color do you get by mixing red and white?", a:"Pink", o:["Purple","Orange","Pink","Brown"]},
  {q:"Which day comes after Friday?", a:"Saturday", o:["Sunday","Saturday","Monday","Thursday"]},
  {q:"What shape has 4 equal sides and 4 right angles?", a:"Square", o:["Rectangle","Square","Circle","Triangle"]},
  {q:"How many months have 31 days?", a:"7", o:["6","7","5","4"]},
  {q:"Which animal says 'meow'?", a:"Cat", o:["Dog","Cow","Cat","Sheep"]},
  {q:"What is H2O commonly known as?", a:"Water", o:["Hydrogen","Oxygen","Water","Salt"]},
  {q:"How many legs does a spider have?", a:"8", o:["6","8","10","4"]},
  {q:"Largest planet in our solar system?", a:"Jupiter", o:["Earth","Mars","Jupiter","Venus"]},
  {q:"How many seconds in a minute?", a:"60", o:["30","45","60","90"]},
  {q:"Which fruit is yellow and long?", a:"Banana", o:["Apple","Banana","Orange","Grapes"]},
  {q:"Which instrument has keys and strings?", a:"Piano", o:["Guitar","Violin","Piano","Drums"]},
  {q:"What do bees make?", a:"Honey", o:["Milk","Honey","Cheese","Butter"]},
  {q:"What do we call frozen water?", a:"Ice", o:["Steam","Ice","Sand","Vinegar"]},
  {q:"Which animal is known as the king of the jungle?", a:"Lion", o:["Tiger","Lion","Elephant","Bear"]},
  {q:"Which gas do we breathe in to live?", a:"Oxygen", o:["Carbon dioxide","Oxygen","Hydrogen","Helium"]},
  {q:"How many vowels in English alphabet?", a:"5", o:["4","5","6","7"]},
  {q:"What is 10 × 5?", a:"50", o:["40","45","50","55"]},
  {q:"Which day is considered the start of the week in many countries?", a:"Monday", o:["Sunday","Monday","Saturday","Friday"]},
  {q:"Which animal gives us milk?", a:"Cow", o:["Dog","Cat","Cow","Sheep"]},
  {q:"Which is used to write on blackboard?", a:"Chalk", o:["Pen","Pencil","Chalk","Brush"]},
  {q:"Which planet is closest to the Sun?", a:"Mercury", o:["Venus","Mercury","Earth","Mars"]},
  {q:"Which shape has three sides?", a:"Triangle", o:["Square","Circle","Triangle","Rectangle"]},
  {q:"Which color is a ripe banana?", a:"Yellow", o:["Green","Yellow","Red","Blue"]}
];

const MEDIUM = [
  {q:"Which scientist proposed the law of gravity?", a:"Isaac Newton", o:["Einstein","Newton","Galileo","Tesla"]},
  {q:"What is boiling point of water at sea level (°C)?", a:"100", o:["0","50","100","150"]},
  {q:"Which instrument measures temperature?", a:"Thermometer", o:["Speedometer","Thermometer","Barometer","Altimeter"]},
  {q:"What is square root of 144?", a:"12", o:["10","11","12","14"]},
  {q:"Who wrote 'Romeo and Juliet'?", a:"William Shakespeare", o:["Shakespeare","Tolstoy","Homer","Austen"]},
  {q:"Which gas is used in party balloons?", a:"Helium", o:["Oxygen","Helium","Nitrogen","Carbon dioxide"]},
  {q:"What is 15% of 200?", a:"30", o:["20","25","30","35"]},
  {q:"Which organ filters blood?", a:"Kidney", o:["Liver","Kidney","Spleen","Pancreas"]},
  {q:"Country known for pizza origin?", a:"Italy", o:["France","Italy","Mexico","Greece"]},
  {q:"Which is the longest river (traditionally)?", a:"Nile", o:["Amazon","Nile","Yangtze","Ganges"]},
  {q:"Rearrange 'CIFAIPC' to get?", a:"Pacific", o:["Pacific","Atlantic","Indian","Arctic"]},
  {q:"Which number is prime?", a:"17", o:["15","16","17","18"]},
  {q:"Riddle: I'm tall when I'm young and short when I'm old.", a:"Candle", o:["Tree","Candle","Human","Shadow"]},
  {q:"Which metal is liquid at room temperature?", a:"Mercury", o:["Mercury","Iron","Aluminium","Copper"]},
  {q:"Which language structures web pages?", a:"HTML", o:["Python","HTML","C++","Java"]},
  {q:"Main gas in Earth's atmosphere?", a:"Nitrogen", o:["Oxygen","Nitrogen","Helium","Hydrogen"]},
  {q:"Which animal builds dams?", a:"Beaver", o:["Beaver","Otter","Squirrel","Muskrat"]},
  {q:"How many sides has a hexagon?", a:"6", o:["5","6","7","8"]},
  {q:"What is 7 × 8?", a:"56", o:["54","55","56","58"]},
  {q:"Who proposed special relativity?", a:"Einstein", o:["Newton","Einstein","Bohr","Planck"]},
  {q:"Riddle: What has keys but cannot open locks?", a:"Piano", o:["Map","Piano","Chest","Door"]},
  {q:"Which ocean lies east of Africa?", a:"Indian", o:["Atlantic","Indian","Pacific","Arctic"]},
  {q:"Capital of Japan?", a:"Tokyo", o:["Seoul","Tokyo","Beijing","Bangkok"]},
  {q:"Chemical formula for water?", a:"H2O", o:["CO2","H2O","O2","NaCl"]},
  {q:"Which year did WWII end?", a:"1945", o:["1918","1939","1942","1945"]}
];

const HARD = [
  {q:"Riddle: I speak without a mouth and hear without ears. What am I?", a:"Echo", o:["Echo","Shadow","Wave","Silence"]},
  {q:"Which planet has day longer than its year?", a:"Venus", o:["Mercury","Venus","Mars","Jupiter"]},
  {q:"What is 13 × 13?", a:"169", o:["156","169","144","182"]},
  {q:"Who discovered penicillin?", a:"Alexander Fleming", o:["Fleming","Pasteur","Koch","Ehrlich"]},
  {q:"Riddle: I have branches, but no fruit, trunk or leaves.", a:"Bank", o:["Tree","River","Bank","Railway"]},
  {q:"Powerhouse of the cell?", a:"Mitochondria", o:["Nucleus","Ribosome","Mitochondria","Golgi"]},
  {q:"Next prime after 11?", a:"13", o:["12","13","15","14"]},
  {q:"Chemical symbol for Gold?", a:"Au", o:["Ag","Au","Gd","Ga"]},
  {q:"Riddle: The more you take, the more you leave behind.", a:"Footsteps", o:["Memories","Footsteps","Shadows","Time"]},
  {q:"Most abundant gas in universe?", a:"Hydrogen", o:["Helium","Hydrogen","Oxygen","Carbon"]},
  {q:"Derivative of x²?", a:"2x", o:["x","2x","x²","1"]},
  {q:"Author of 'Origin of Species'?", a:"Charles Darwin", o:["Darwin","Linnaeus","Newton","Mendel"]},
  {q:"Riddle: Head and tail but no body", a:"Coin", o:["Snake","Coin","Worm","Paper"]},
  {q:"What is 17 × 12?", a:"204", o:["192","204","200","216"]},
  {q:"Uncertainty principle physicist?", a:"Heisenberg", o:["Schrodinger","Heisenberg","Bohr","Dirac"]},
  {q:"Riddle: three consecutive double letters word?", a:"Bookkeeper", o:["Balloon","Bookkeeper","Coollook","Committee"]},
  {q:"Which country largest by land area?", a:"Russia", o:["Canada","USA","Russia","China"]},
  {q:"Spectral class of Sun approx?", a:"G2V", o:["M1V","G2V","K5III","O2V"]},
  {q:"Riddle: keys but no locks + space no room", a:"Keyboard", o:["Keyboard","Piano","Phone","Computer"]},
  {q:"Pythagoras famous for?", a:"a² + b² = c²", o:["Area rule","Infinity","a² + b² = c²","Pi"]},
  {q:"Atomic number of Carbon?", a:"6", o:["4","6","8","12"]},
  {q:"Composer of 'Four Seasons'?", a:"Vivaldi", o:["Bach","Vivaldi","Mozart","Beethoven"]},
  {q:"Riddle: Has an eye but cannot see", a:"Needle", o:["Needle","Storm","Potato","Door"]},
  {q:"Value of π approx (2 decimals)?", a:"3.14", o:["3.14","3.15","3.12","3.10"]},
  {q:"Who conjectured Fermat's Last Theorem?", a:"Fermat", o:["Gauss","Fermat","Euler","Riemann"]}
];

questions = [...EASY, ...MEDIUM, ...HARD]; // 75

// show top preview - pulls top 5 from Firebase
function renderLeaderPreview(){
  const ref = db.ref('leaderboard').orderByChild('score').limitToLast(5);
  leaderPreviewList.innerHTML = '<div style="padding:6px;color:#666">Loading...</div>';
  ref.on('value', snap=>{
    const data = snap.val() || {};
    // convert to array sorted desc
    const arr = Object.keys(data).map(k=>data[k]).sort((a,b)=>b.score-a.score).slice(0,5);
    leaderPreviewList.innerHTML = '';
    if(arr.length===0){ leaderPreviewList.innerHTML = '<div style="padding:6px;color:#666">No scores yet</div>'; return; }
    arr.forEach((p,idx)=>{
      const el = document.createElement('div');
      el.style.padding='6px';
      el.style.borderRadius='8px';
      el.style.background='#fff';
      el.style.margin='6px 0';
      el.innerHTML = `<strong>#${idx+1}</strong> ${escapeHtml(p.name)} <span style="float:right;color:#0077ff">${p.score}</span>`;
      leaderPreviewList.appendChild(el);
    });
  });
}
renderLeaderPreview();

// start handler
startBtn.addEventListener('click', ()=>{
  const v = (playerNameInput.value || '').trim();
  playerName = v || playerName || 'Player';
  localStorage.setItem('zen_name', playerName);
  startGame();
});

function startGame(){
  currentIndex=0; score=0; answering=false;
  startScreen.classList.add('hidden'); resultScreen.classList.add('hidden'); gameScreen.classList.remove('hidden');
  updateScoreLevel(); startTimer(); loadQuestion();
}

function updateScoreLevel(){
  levelText.innerText = `Level ${Math.min(currentIndex+1, questions.length)}/${questions.length}`;
  scoreText.innerText = `Score: ${score}`;
}

// timer
function startTimer(){
  stopTimer();
  timerRemaining = TIME_PER_Q;
  timerFill.style.width = '100%';
  timerInterval = setInterval(()=>{
    timerRemaining--;
    const pct = Math.max(0, (timerRemaining / TIME_PER_Q) * 100);
    timerFill.style.width = pct + '%';
    if(timerRemaining <= 0){ stopTimer(); handleTimeout(); }
  },1000);
}
function stopTimer(){ if(timerInterval) clearInterval(timerInterval); timerInterval=null; }

function handleTimeout(){
  const item = questions[currentIndex];
  const btns = optionsBox.querySelectorAll('button');
  btns.forEach(b=>{ b.disabled=true; if(b.innerText === item.a){ b.style.background='#e6ffed'; b.style.border='2px solid #27ae60'; }});
  score -= 20; updateScoreLevel();
  setTimeout(()=>{ currentIndex++; if(currentIndex<questions.length){ updateScoreLevel(); startTimer(); loadQuestion(); } else finishGame(); },900);
}

function loadQuestion(){
  if(currentIndex >= questions.length){ finishGame(); return; }
  const item = questions[currentIndex];
  questionText.innerText = item.q;
  optionsBox.innerHTML = '';
  const opts = shuffleArray([...item.o]);
  opts.forEach(opt=>{
    const b = document.createElement('button');
    b.className = 'option-btn fade';
    b.innerText = opt;
    b.onclick = ()=> handleAnswer(opt,item.a,b);
    optionsBox.appendChild(b);
  });
}

function handleAnswer(selected, correct, btn){
  if(answering) return;
  answering = true;
  stopTimer();
  const all = optionsBox.querySelectorAll('button');
  all.forEach(x=> x.disabled=true);

  if(selected === correct){
    score += 10;
    btn.style.background = '#e6ffed'; btn.style.border='2px solid #27ae60';
    try{ sndCorrect.currentTime=0; sndCorrect.play(); }catch(e){}
  } else {
    score -= 20;
    btn.style.background = '#ffecec'; btn.style.border='2px solid #e53935';
    try{ sndWrong.currentTime=0; sndWrong.play(); }catch(e){}
    all.forEach(x=>{ if(x.innerText === correct){ x.style.background = '#e6ffed'; x.style.border='2px solid #27ae60'; }});
  }

  updateScoreLevel();
  setTimeout(()=>{ answering=false; currentIndex++; if(currentIndex<questions.length){ startTimer(); loadQuestion(); } else finishGame(); },700);
}

function finishGame(){
  stopTimer();
  gameScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');
  finalScoreText.innerText = `Final Score: ${score}`;
  let msg = '';
  if(score < 100) msg = 'Score low — keep practicing!';
  else if(score < 300) msg = 'Good — keep improving!';
  else msg = 'Excellent! You crushed it!';
  iqText.innerText = msg;
  saveNameInput.value = playerName || '';
  renderLeaderboard();
  if(score >= 300){ try{ confettiStart(); }catch(e){} }
}

// ===== GLOBAL LEADERBOARD (FIREBASE) =====
function saveScoreToFirebase(){
  const name = (saveNameInput.value || playerName || 'Player').trim();
  const entry = { name: name, score: score, time: Date.now() };
  // push to realtime DB
  db.ref('leaderboard').push(entry).then(()=>{
    renderLeaderPreview(); // refresh preview
    renderLeaderboard();
  }).catch(err=>{
    console.error('Firebase write error', err);
    alert('Error saving score. Check Firebase config/rules.');
  });
}

// render full leaderboard (sorted desc)
function renderLeaderboard(){
  const ref = db.ref('leaderboard').orderByChild('score').limitToLast(100);
  leaderboardBox.innerHTML = '<div style="padding:8px;color:#666">Loading leaderboard...</div>';
  ref.once('value').then(snap=>{
    const data = snap.val() || {};
    const arr = Object.keys(data).map(k=>data[k]).sort((a,b)=>b.score-a.score);
    leaderboardBox.innerHTML = '';
    if(arr.length===0){ leaderboardBox.innerHTML = '<div style="padding:12px;color:#666">No scores yet</div>'; return; }
    arr.forEach((p,idx)=>{
      const el = document.createElement('div');
      el.className = 'leader-item';
      // avatar initials
      const initials = (p.name || 'P').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase();
      el.innerHTML = `<div class="leader-left"><div class="avatar">${escapeHtml(initials)}</div><div style="margin-left:6px"><strong>${escapeHtml(p.name)}</strong><div style="font-size:12px;color:#666">${new Date(p.time).toLocaleString()}</div></div></div><div style="font-weight:800;color:#0077ff">${p.score}</div>`;
      leaderboardBox.appendChild(el);
    });
  }).catch(err=>{
    console.error('Firebase read error', err);
    leaderboardBox.innerHTML = '<div style="padding:12px;color:#c00">Error loading leaderboard</div>';
  });
}

// attach save button
saveScoreBtn.addEventListener('click', saveScoreToFirebase);
playAgainBtn.addEventListener('click', ()=> location.reload());

// utility
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function shuffleArray(arr){ for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]];} return arr; }

// initial load: preview and maybe top leaderboard
renderLeaderPreview();