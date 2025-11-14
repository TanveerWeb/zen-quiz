// ZenQuiz - final script.js (60 unique questions)
// Paste karo isko script.js mein

// Elements (IDs match index.html from previous message)
const startScreen = document.getElementById('startScreen');
const gameBox = document.getElementById('gameBox');
const questionBox = document.getElementById('questionBox');
const optionsBox = document.getElementById('optionsBox');
const scoreText = document.getElementById('scoreText');
const levelText = document.getElementById('levelText');
const resultScreen = document.getElementById('resultScreen');
const finalScore = document.getElementById('finalScore');
const iqMessage = document.getElementById('iqMessage');
const leaderboardDiv = document.getElementById('leaderboard');

const correctSound = document.getElementById('correctSound');
const wrongSound = document.getElementById('wrongSound');

let playerName = localStorage.getItem('zen_name') || '';
let shuffledQuestions = [];
let currentIndex = 0;
let score = 0;

// 60 unique questions (mix GK, riddles, logic)
const QUESTIONS_MASTER = [
  { q: "What is the capital of India?", o: ["New Delhi","Mumbai","Kolkata","Chennai"], a: "New Delhi" },
  { q: "Which planet is known as the Red Planet?", o: ["Earth","Mars","Venus","Jupiter"], a: "Mars" },
  { q: "How many days are there in a leap year?", o: ["365","366","364","367"], a: "366" },
  { q: "Which gas do plants absorb for photosynthesis?", o: ["Oxygen","Carbon Dioxide","Nitrogen","Helium"], a: "Carbon Dioxide" },
  { q: "Who invented the telephone?", o: ["Alexander Graham Bell","Thomas Edison","Nikola Tesla","Guglielmo Marconi"], a: "Alexander Graham Bell" },
  { q: "Largest ocean in the world?", o: ["Atlantic","Indian","Arctic","Pacific"], a: "Pacific" },
  { q: "5 × 6 = ?", o: ["20","25","30","35"], a: "30" },
  { q: "Which animal is called the King of the Jungle?", o: ["Tiger","Elephant","Lion","Leopard"], a: "Lion" },
  { q: "Fastest land animal?", o: ["Cheetah","Horse","Lion","Tiger"], a: "Cheetah" },
  { q: "Smallest continent by area?", o: ["Asia","Australia","Europe","Antarctica"], a: "Australia" },
  { q: "Water freezes at which temperature (°C)?", o: ["0","100","50","10"], a: "0" },
  { q: "Sun rises in which direction?", o: ["North","West","East","South"], a: "East" },
  { q: "India gained independence in which year?", o: ["1947","1950","1930","1942"], a: "1947" },
  { q: "Which metal is liquid at room temperature?", o: ["Mercury","Iron","Gold","Silver"], a: "Mercury" },
  { q: "Which organ pumps blood?", o: ["Brain","Kidney","Heart","Lungs"], a: "Heart" },
  { q: "How many continents are there?", o: ["5","6","7","8"], a: "7" },
  { q: "Human body has how many bones (adult)?", o: ["206","201","210","220"], a: "206" },
  { q: "Largest mammal?", o: ["Elephant","Blue Whale","Giraffe","Hippopotamus"], a: "Blue Whale" },
  { q: "Which fruit has seeds on the outside?", o: ["Apple","Banana","Strawberry","Mango"], a: "Strawberry" },
  { q: "Square root of 81?", o: ["8","9","7","6"], a: "9" },
  { q: "Which is a programming language?", o: ["HTML","Python","CSS","SQL (not only)"], a: "Python" },
  { q: "Hottest planet in our solar system?", o: ["Mercury","Venus","Mars","Jupiter"], a: "Venus" },
  { q: "Taj Mahal is located in which city?", o: ["Delhi","Agra","Jaipur","Lucknow"], a: "Agra" },
  { q: "Which gas is essential for breathing?", o: ["Carbon Dioxide","Nitrogen","Oxygen","Helium"], a: "Oxygen" },
  { q: "Which country is known as the Land of Rising Sun?", o: ["China","Japan","Korea","Thailand"], a: "Japan" },
  { q: "How many colors are there in a rainbow?", o: ["6","7","8","5"], a: "7" },
  { q: "The 'brain' of a computer is?", o: ["Monitor","CPU","Keyboard","Mouse"], a: "CPU" },
  { q: "Largest desert in the world?", o: ["Sahara","Gobi","Thar","Kalahari"], a: "Sahara" },
  { q: "Who discovered gravity?", o: ["Einstein","Newton","Galileo","Tesla"], a: "Newton" },
  { q: "Instrument to measure temperature?", o: ["Thermometer","Barometer","Speedometer","Odometer"], a: "Thermometer" },
  { q: "National flower of India?", o: ["Rose","Lotus","Lily","Sunflower"], a: "Lotus" },
  { q: "RGB stands for?", o: ["Red Green Blue","Rights Go Back","Run Get Build","Read Go Blue"], a: "Red Green Blue" },
  { q: "Hardest natural substance?", o: ["Gold","Iron","Diamond","Platinum"], a: "Diamond" },
  { q: "Largest river by discharge?", o: ["Nile","Amazon","Ganga","Yangtze"], a: "Amazon" },
  { q: "1 kilogram = ? grams", o: ["500","1000","1500","2000"], a: "1000" },
  { q: "How many hours in a day?", o: ["20","22","24","26"], a: "24" },
  { q: "Which device stores data?", o: ["Monitor","Keyboard","Pen Drive","Speaker"], a: "Pen Drive" },
  { q: "Country with largest population?", o: ["USA","Russia","China","India"], a: "China" },
  { q: "Which gas contributes most to global warming?", o: ["Oxygen","Nitrogen","Carbon Dioxide","Hydrogen"], a: "Carbon Dioxide" },
  { q: "Which shape has 3 sides?", o: ["Square","Triangle","Circle","Hexagon"], a: "Triangle" },
  { q: "Which animal gives wool?", o: ["Cow","Goat","Sheep","Camel"], a: "Sheep" },
  { q: "Human blood color is?", o: ["Blue","Red","Black","White"], a: "Red" },
  { q: "Largest country by land area?", o: ["USA","Russia","China","Canada"], a: "Russia" },
  { q: "Which planet has rings?", o: ["Mars","Venus","Saturn","Mercury"], a: "Saturn" },
  { q: "Who painted Mona Lisa?", o: ["Picasso","Leonardo da Vinci","Van Gogh","Michelangelo"], a: "Leonardo da Vinci" },
  { q: "Used to write on blackboard?", o: ["Pen","Chalk","Brush","Marker"], a: "Chalk" },
  { q: "Festival of lights in India?", o: ["Holi","Eid","Diwali","Baisakhi"], a: "Diwali" },
  { q: "Triangle has how many angles?", o: ["1","2","3","4"], a: "3" },
  { q: "Planet closest to Sun?", o: ["Venus","Mercury","Earth","Mars"], a: "Mercury" },
  { q: "Which is the largest planet?", o: ["Earth","Mars","Jupiter","Saturn"], a: "Jupiter" },
  { q: "Which bird can mimic human speech?", o: ["Parrot","Crow","Sparrow","Pigeon"], a: "Parrot" },
  { q: "What gets wetter as it dries?", o: ["Water","Towel","Sponge","Cloth"], a: "Towel" },
  { q: "What has hands but cannot clap?", o: ["Clock","Robot","Tree","Fan"], a: "Clock" },
  { q: "What has a head and a tail but no body?", o: ["Coin","Snake","Fish","Comet"], a: "Coin" },
  { q: "What runs but never walks?", o: ["River","Car","Person","Clock"], a: "River" },
  { q: "What can fill a room but takes no space?", o: ["Air","Light","Sound","Heat"], a: "Light" },
  { q: "Which grows taller than trees but has no roots seen?", o: ["Mountain","Grass","Bush","Flower"], a: "Mountain" }
];

// Helper: shuffle array in place
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Start game (called from Start button in HTML)
function startGame() {
  if (!playerName) {
    playerName = prompt("Enter your name (for leaderboard):") || "Player";
    localStorage.setItem('zen_name', playerName);
  }

  // reset states
  score = 0;
  currentIndex = 0;
  scoreText.innerText = "Score: " + score;
  levelText.innerText = "Level: 1";
  // shuffle and pick first 60 (we already have 60)
  shuffledQuestions = shuffleArray([...QUESTIONS_MASTER]).slice(0, 60);

  // show UI
  startScreen.classList.add('hidden');
  resultScreen.classList.add('hidden');
  gameBox.classList.remove('hidden');

  // load first
  loadQuestion();
}

// Load current question
function loadQuestion() {
  if (currentIndex >= shuffledQuestions.length) {
    endGame();
    return;
  }

  const item = shuffledQuestions[currentIndex];
  // update texts
  levelText.innerText = "Level: " + (currentIndex + 1);
  questionBox.innerText = item.q;

  // build options (shuffle options too)
  const options = shuffleArray([...item.o]);
  optionsBox.innerHTML = ""; // clear

  options.forEach(optText => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerText = optText;
    btn.style.display = 'block';
    btn.style.margin = '12px auto';
    btn.style.padding = '12px 18px';
    btn.style.borderRadius = '12px';
    btn.style.border = '2px solid #007bff';
    btn.style.background = '#fff';
    btn.style.color = '#007bff';
    btn.style.cursor = 'pointer';
    btn.onclick = () => selectAnswer(optText, item.a, btn);
    optionsBox.appendChild(btn);
  });
}

// when user selects an answer
let answering = false;
function selectAnswer(selectedText, correctText, btn) {
  if (answering) return; // prevent double click
  answering = true;

  // mark buttons disabled
  const allBtns = optionsBox.querySelectorAll('button');
  allBtns.forEach(b => b.disabled = true);

  // check
  if (selectedText === correctText) {
    score += 10;
    scoreText.innerText = "Score: " + score;
    // style green
    btn.style.background = '#d4ffd6';
    btn.style.border = '2px solid #28a745';
    try { correctSound.play(); } catch(e){}
  } else {
    score -= 5;
    scoreText.innerText = "Score: " + score;
    // mark wrong red and reveal correct
    btn.style.background = '#ffd6d6';
    btn.style.border = '2px solid #dc3545';
    try { wrongSound.play(); } catch(e){}
    // highlight correct button
    allBtns.forEach(b => {
      if (b.innerText === correctText) {
        b.style.background = '#d4ffd6';
        b.style.border = '2px solid #28a745';
      }
    });
  }

  // small delay then next question
  setTimeout(() => {
    answering = false;
    currentIndex++;
    if (currentIndex < shuffledQuestions.length) {
      loadQuestion();
    } else {
      endGame();
    }
  }, 700);
}

// End game
function endGame() {
  gameBox.classList.add('hidden');
  resultScreen.classList.remove('hidden');

  finalScore.innerText = `Final Score: ${score}`;
  // IQ message
  let msg = "";
  if (score < 150) msg = "Your IQ was low — work harder!";
  else if (score < 300) msg = "Very good — keep improving!";
  else msg = "Genius level! Amazing work!";

  iqMessage.innerText = msg;

  // update leaderboard
  saveLeaderboard(playerName, score);
  renderLeaderboard();
}

// Leaderboard using localStorage
function saveLeaderboard(name, sc) {
  const key = 'zen_leaderboard_v1';
  let board = JSON.parse(localStorage.getItem(key) || "[]");
  board.push({ name: name, score: sc, time: Date.now() });
  // sort desc
  board.sort((a,b) => b.score - a.score);
  // keep top 10
  board = board.slice(0, 10);
  localStorage.setItem(key, JSON.stringify(board));
}

function renderLeaderboard() {
  const key = 'zen_leaderboard_v1';
  let board = JSON.parse(localStorage.getItem(key) || "[]");
  leaderboardDiv.innerHTML = "";
  if (board.length === 0) {
    leaderboardDiv.innerHTML = "<div style='padding:12px'>No scores yet</div>";
    return;
  }
  board.forEach((p, i) => {
    const d = document.createElement('div');
    d.style.display = 'flex';
    d.style.justifyContent = 'space-between';
    d.style.padding = '10px';
    d.style.margin = '8px auto';
    d.style.width = '90%';
    d.style.maxWidth = '420px';
    d.style.borderRadius = '12px';
    d.style.background = '#ffffff';
    d.style.boxShadow = '0 4px 10px rgba(0,0,0,0.08)';
    d.innerHTML = `<strong>${i+1}. ${p.name}</strong><span>${p.score}</span>`;
    leaderboardDiv.appendChild(d);
  });
}

// restart
function restartGame() {
  resultScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
  // keep player name
}

// on load, render leaderboard if any
renderLeaderboard();