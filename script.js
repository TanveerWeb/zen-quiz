// ZenQuiz — 75 questions (Easy→Medium→Hard), +10 / -20 scoring
// Put index.html, style.css, script.js, logo.png in same folder

// --- Elements ---
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

// --- state ---
let playerName = localStorage.getItem('zen_name') || '';
let questions = []; // will be built from easy/medium/hard
let currentIndex = 0;
let score = 0;
let answering = false;

// --- data: easy(25), medium(25), hard(25) ---
// Easy (1-25) — straightforward
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
  {q:"What is the largest planet in our solar system?", a:"Jupiter", o:["Earth","Mars","Jupiter","Venus"]},
  {q:"How many seconds in a minute?", a:"60", o:["30","45","60","90"]},
  {q:"Which fruit is yellow and long?", a:"Banana", o:["Apple","Banana","Orange","Grapes"]},
  {q:"Which instrument has keys and strings - often used in classical music?", a:"Piano", o:["Guitar","Violin","Piano","Drums"]},
  {q:"What do bees make?", a:"Honey", o:["Milk","Honey","Cheese","Butter"]},
  {q:"Which is a common shape of the Earth?", a:"Sphere", o:["Cube","Sphere","Cylinder","Cone"]},
  {q:"What do we call frozen water?", a:"Ice", o:["Steam","Ice","Sand","Vinegar"]},
  {q:"Which animal is known as the king of the jungle?", a:"Lion", o:["Tiger","Lion","Elephant","Bear"]},
  {q:"Which gas do we breathe in to live?", a:"Oxygen", o:["Carbon dioxide","Oxygen","Hydrogen","Helium"]},
  {q:"How many vowels in English alphabet?", a:"5", o:["4","5","6","7"]},
  {q:"What is 10 × 5?", a:"50", o:["40","45","50","55"]},
  {q:"Which day is considered the start of the week in many countries?", a:"Monday", o:["Sunday","Monday","Saturday","Friday"]},
  {q:"Which animal gives us milk?", a:"Cow", o:["Dog","Cat","Cow","Sheep"]},
  {q:"Which is used to write on blackboard?", a:"Chalk", o:["Pen","Pencil","Chalk","Brush"]},
  {q:"Which planet is closest to the Sun?", a:"Mercury", o:["Venus","Mercury","Earth","Mars"]},
  {q:"Which shape has three sides?", a:"Triangle", o:["Square","Circle","Triangle","Rectangle"]}
];

// Medium (26-50) — moderate difficulty
const MEDIUM = [
  {q:"Which scientist proposed the law of gravity?", a:"Isaac Newton", o:["Einstein","Newton","Galileo","Tesla"]},
  {q:"What is the boiling point of water at sea level (°C)?", a:"100", o:["0","50","100","150"]},
  {q:"Which instrument measures temperature?", a:"Thermometer", o:["Speedometer","Thermometer","Barometer","Altimeter"]},
  {q:"What is the square root of 144?", a:"12", o:["10","11","12","14"]},
  {q:"Who wrote 'Romeo and Juliet'?", a:"William Shakespeare", o:["Shakespeare","Tolstoy","Homer","Austen"]},
  {q:"Which gas is used in party balloons (lighter than air)?", a:"Helium", o:["Oxygen","Helium","Nitrogen","Carbon dioxide"]},
  {q:"What is 15% of 200?", a:"30", o:["20","25","30","35"]},
  {q:"Which organ filters blood in the human body?", a:"Kidney", o:["Liver","Kidney","Spleen","Pancreas"]},
  {q:"Which country is known for pizza origin?", a:"Italy", o:["France","Italy","Mexico","Greece"]},
  {q:"Which is the longest river in the world (traditionally)?", a:"Nile", o:["Amazon","Nile","Yangtze","Ganges"]},
  {q:"If you rearrange the letters 'CIFAIPC' you get a name of a?", a:"Pacific (ocean)", o:["Pacific","Atlantic","Indian","Arctic"]},
  {q:"Which number is prime?", a:"17", o:["15","16","17","18"]},
  {q:"Riddle: I’m tall when I’m young and short when I’m old. What am I?", a:"Candle", o:["Tree","Candle","Human","Shadow"]},
  {q:"Which metal is liquid at room temperature?", a:"Mercury", o:["Mercury","Iron","Aluminium","Copper"]},
  {q:"Which language is primarily used to build web pages (structure)?", a:"HTML", o:["Python","HTML","C++","Java"]},
  {q:"What is the main gas in Earth’s atmosphere?", a:"Nitrogen", o:["Oxygen","Nitrogen","Helium","Hydrogen"]},
  {q:"Which animal is famous for building dams?", a:"Beaver", o:["Beaver","Otter","Squirrel","Muskrat"]},
  {q:"How many sides has a regular hexagon?", a:"6", o:["5","6","7","8"]},
  {q:"What is 7 × 8?", a:"56", o:["54","55","56","58"]},
  {q:"Who proposed the theory of relativity (special)?", a:"Einstein", o:["Newton","Einstein","Bohr","Planck"]},
  {q:"Riddle: What has keys but cannot open locks?", a:"Piano", o:["Map","Piano","Chest","Door"]},
  {q:"Which ocean lies to the east of Africa?", a:"Indian", o:["Atlantic","Indian","Pacific","Arctic"]},
  {q:"What is the capital of Japan?", a:"Tokyo", o:["Seoul","Tokyo","Beijing","Bangkok"]},
  {q:"What is the chemical formula for water?", a:"H2O", o:["CO2","H2O","O2","NaCl"]},
  {q:"Which year did World War II end (approx)?", a:"1945", o:["1918","1939","1942","1945"]}
];

// Hard (51-75) — tougher
const HARD = [
  {q:"Riddle: I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", a:"Echo", o:["Echo","Shadow","Wave","Silence"]},
  {q:"Which planet has a day longer than its year?", a:"Venus", o:["Mercury","Venus","Mars","Jupiter"]},
  {q:"What is 13 × 13?", a:"169", o:["156","169","144","182"]},
  {q:"Which scientist discovered penicillin?", a:"Alexander Fleming", o:["Fleming","Pasteur","Koch","Ehrlich"]},
  {q:"Riddle: I have branches, but no fruit, trunk or leaves. What am I?", a:"Bank", o:["Tree","River","Bank","Railway"]},
  {q:"What is the powerhouse of the cell?", a:"Mitochondria", o:["Nucleus","Ribosome","Mitochondria","Golgi"]},
  {q:"Which number is next in series: 2, 3, 5, 7, 11, ?", a:"13", o:["12","13","15","14"]},
  {q:"What is the chemical symbol of Gold?", a:"Au", o:["Ag","Au","Gd","Ga"]},
  {q:"Riddle: The more you take, the more you leave behind. What am I?", a:"Footsteps", o:["Memories","Footsteps","Shadows","Time"]},
  {q:"Which gas is most abundant in the universe?", a:"Hydrogen", o:["Helium","Hydrogen","Oxygen","Carbon"]},
  {q:"What is the derivative of x² (basic calculus)?", a:"2x", o:["x","2x","x²","1"]},
  {q:"Who is the author of 'The Origin of Species'?", a:"Charles Darwin", o:["Darwin","Linnaeus","Newton","Mendel"]},
  {q:"Riddle: What has a head, a tail, is brown, and has no legs?", a:"Penny/Coin", o:["Snake","Coin","Comet","Worm"]},
  {q:"What is 17 × 12?", a:"204", o:["192","204","200","216"]},
  {q:"Which physicist is known for the uncertainty principle?", a:"Heisenberg", o:["Schrodinger","Heisenberg","Bohr","Dirac"]},
  {q:"Riddle: What English word has three consecutive double letters?", a:"Bookkeeper", o:["Balloon","Bookkeeper","Coollook","Committee"]},
  {q:"Which country has the largest land area?", a:"Russia", o:["Canada","USA","Russia","China"]},
  {q:"What is the spectral class of our Sun (approx)?", a:"G2V", o:["M1V","G2V","K5III","O2V"]},
  {q:"Riddle: I have keys but no locks and space but no room. You can enter but can’t go outside. What am I?", a:"Keyboard", o:["Keyboard","Piano","Phone","Computer"]},
  {q:"Which mathematician is known for the theorem 'a² + b² = c²'?", a:"Pythagoras", o:["Euclid","Pythagoras","Archimedes","Fermat"]},
  {q:"What is the atomic number of Carbon?", a:"6", o:["4","6","8","12"]},
  {q:"Which composer wrote the 'Four Seasons'?", a:"Vivaldi", o:["Bach","Vivaldi","Mozart","Beethoven"]},
  {q:"Riddle: What has an eye but cannot see?", a:"Needle", o:["Needle","Storm","Potato","Door"]},
  {q:"What is the value of π (pi) approximately to 2 decimals?", a:"3.14", o:["3.14","3.15","3.12","3.10"]},
  {q:"Which mathematician conjectured Fermat’s Last Theorem (proved later)?", a:"Pierre de Fermat", o:["Gauss","Fermat","Euler","Riemann"]}
];

// build full list in order easy → medium → hard (no intermix)
questions = [...EASY, ...MEDIUM, ...HARD]; // length 75

// shuffle options helper
function shuffleArray(arr){
  for(let i=arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// show preview leaderboard on start screen
function renderLeaderPreview(){
  const key = 'zen_leaderboard_v3';
  const data = JSON.parse(localStorage.getItem(key) || '[]').slice(0,5);
  leaderPreviewList.innerHTML = '';
  if(data.length === 0){
    leaderPreviewList.innerHTML = '<div style="padding:6px;color:#666">No scores yet</div>';
    return;
  }
  data.forEach((p,idx)=>{
    const el = document.createElement('div');
    el.style.padding='6px';
    el.style.borderRadius='8px';
    el.style.background='#fff';
    el.style.margin='6px 0';
    el.innerHTML = `<strong>#${idx+1}</strong> ${p.name} <span style="float:right;color:#0077ff">${p.score}</span>`;
    leaderPreviewList.appendChild(el);
  });
}

// initial render
renderLeaderPreview();

// start game handler
startBtn.addEventListener('click', ()=> {
  const v = (playerNameInput.value || '').trim();
  playerName = v || playerName || 'Player';
  localStorage.setItem('zen_name', playerName);
  startGame();
});

function startGame(){
  // reset
  currentIndex = 0;
  score = 0;
  answering = false;

  // show game, hide start
  startScreen.classList.add('hidden');
  resultScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');

  // update UI
  updateScoreLevel();
  loadQuestion();
}

// load question by currentIndex (ordered easy→medium→hard)
function loadQuestion(){
  if(currentIndex >= questions.length){
    return finishGame();
  }

  const item = questions[currentIndex];
  levelText.innerText = `Level ${currentIndex+1}/75`;
  scoreText.innerText = `Score: ${score}`;

  // set question
  questionText.innerText = item.q;
  // build options randomized
  const opts = shuffleArray([...item.o]);
  optionsBox.innerHTML = '';
  opts.forEach(opt=>{
    const b = document.createElement('button');
    b.className = 'option-btn fade';
    b.innerText = opt;
    b.onclick = ()=> handleAnswer(opt, item.a, b);
    optionsBox.appendChild(b);
  });
}

// answer handling
function handleAnswer(selected, correct, btn){
  if(answering) return;
  answering = true;

  // disable all
  const all = optionsBox.querySelectorAll('button');
  all.forEach(x=> x.disabled = true);

  if(selected === correct){
    score += 10;
    btn.style.background = '#e6ffed';
    btn.style.border = '2px solid #27ae60';
  } else {
    score -= 20;
    btn.style.background = '#ffecec';
    btn.style.border = '2px solid #e53935';
    // highlight correct
    all.forEach(x=>{
      if(x.innerText === correct){
        x.style.background = '#e6ffed';
        x.style.border = '2px solid #27ae60';
      }
    });
  }

  // tiny delay then next
  setTimeout(()=>{
    answering = false;
    currentIndex++;
    if(currentIndex < questions.length){
      updateScoreLevel();
      loadQuestion();
    } else {
      finishGame();
    }
  }, 700);
}

// update UI
function updateScoreLevel(){
  scoreText.innerText = `Score: ${score}`;
  levelText.innerText = `Level ${Math.min(currentIndex+1, questions.length)}/${questions.length}`;
}

// finish
function finishGame(){
  gameScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');

  finalScoreText.innerText = `Final Score: ${score}`;
  // IQ style feedback
  let msg = '';
  if(score < 100) msg = 'Score low — keep practicing!';
  else if(score < 300) msg = 'Good! Keep improving!';
  else msg = 'Excellent! You crushed it!';
  iqText.innerText = msg;

  // fill save input with stored name
  saveNameInput.value = playerName || '';
  renderLeaderboard();
}

// leaderboard functions
function saveScore(){
  const name = (saveNameInput.value || playerName || 'Player').trim();
  const key = 'zen_leaderboard_v3';
  const board = JSON.parse(localStorage.getItem(key) || '[]');
  board.push({name:name, score: score, time: Date.now()});
  board.sort((a,b)=> b.score - a.score);
  localStorage.setItem(key, JSON.stringify(board.slice(0,50)));
  renderLeaderboard();
  renderLeaderPreview(); // update small preview too
}

// render leaderboard into box
function renderLeaderboard(){
  const key = 'zen_leaderboard_v3';
  const board = JSON.parse(localStorage.getItem(key) || '[]');
  leaderboardBox.innerHTML = '';
  if(board.length === 0){
    leaderboardBox.innerHTML = '<div style="padding:12px;color:#666">No scores saved yet</div>';
    return;
  }
  board.slice(0,50).forEach((p,idx)=>{
    const el = document.createElement('div');
    el.className = 'leader-item';
    el.innerHTML = `<div><strong>#${idx+1}</strong> ${escapeHtml(p.name)}</div><div style="color:#0077ff;font-weight:700">${p.score}</div>`;
    leaderboardBox.appendChild(el);
  });
}

// utilities
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

// save button
saveScoreBtn.addEventListener('click', saveScore);
// play again
playAgainBtn.addEventListener('click', ()=> {
  // reload to reset ordering
  location.reload();
});