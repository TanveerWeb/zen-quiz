const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const quizScreen = document.getElementById('quiz-screen');
const startScreen = document.getElementById('start-screen');
const resultScreen = document.getElementById('result-screen');
const questionElem = document.getElementById('question');
const optionsElem = document.getElementById('options');
const scoreElem = document.getElementById('score');
const levelElem = document.getElementById('level');
const resultText = document.getElementById('result-text');
const leaderboardElem = document.getElementById('leaderboard');

let currentQuestion = 0;
let score = 0;
let usedQuestions = [];

const questions = [
  { q: "What has to be broken before you can use it?", a: "Egg", o: ["Egg","Glass","Box","Seal"] },
  { q: "What has hands but can’t clap?", a: "Clock", o: ["Clock","Monkey","Tree","Fan"] },
  { q: "What gets wetter as it dries?", a: "Towel", o: ["Towel","Water","Rain","Sun"] },
  { q: "What has keys but can’t open locks?", a: "Piano", o: ["Piano","Computer","Car","Lock"] },
  { q: "What can travel around the world while staying in a corner?", a: "Stamp", o: ["Stamp","Sun","Wind","Sound"] },
  { q: "What gas do plants produce during photosynthesis?", a: "Oxygen", o: ["Oxygen","Carbon","Nitrogen","Helium"] },
  { q: "Who painted the Mona Lisa?", a: "Leonardo da Vinci", o: ["Leonardo da Vinci","Picasso","Michelangelo","Van Gogh"] },
  { q: "What is the capital of India?", a: "New Delhi", o: ["New Delhi","Mumbai","Kolkata","Chennai"] },
  { q: "What number should come next? 2,4,8,16,?", a: "32", o: ["32","24","30","36"] },
  { q: "Which is heavier: 1 kg cotton or 1 kg iron?", a: "Same", o: ["Same","Iron","Cotton","None"] },
  { q: "What can fill a room but takes up no space?", a: "Light", o: ["Light","Air","Water","Sound"] },
  { q: "Who invented the light bulb?", a: "Thomas Edison", o: ["Thomas Edison","Newton","Tesla","Bell"] },
  { q: "What has a neck but no head?", a: "Bottle", o: ["Bottle","Snake","Drum","Shirt"] },
  { q: "Which is the smallest ocean?", a: "Arctic", o: ["Arctic","Pacific","Indian","Atlantic"] },
  { q: "What belongs to you but is used by others?", a: "Name", o: ["Name","Phone","Money","Book"] },
  { q: "Which planet is known as the Red Planet?", a: "Mars", o: ["Mars","Earth","Venus","Jupiter"] },
  { q: "What organ pumps blood?", a: "Heart", o: ["Heart","Liver","Brain","Lungs"] },
  { q: "What has an ear but cannot hear?", a: "Corn", o: ["Corn","Pot","Radio","Drum"] },
  { q: "If A=1, B=2, C=3, then Z=?", a: "26", o: ["26","24","25","23"] },
  { q: "What’s half of 2 plus 2?", a: "3", o: ["3","2","4","2.5"] },
  { q: "If 5 cats catch 5 mice in 5 minutes, 100 mice in 100 min need?", a: "5", o: ["5","10","20","50"] },
  { q: "Who is known as Missile Man of India?", a: "A.P.J. Abdul Kalam", o: ["A.P.J. Abdul Kalam","Einstein","Newton","Raman"] },
  { q: "Which animal is known as Ship of Desert?", a: "Camel", o: ["Camel","Horse","Elephant","Ox"] },
  { q: "What has legs but doesn’t walk?", a: "Table", o: ["Table","Car","Chair","Tree"] },
  { q: "What is the national flower of India?", a: "Lotus", o: ["Lotus","Rose","Sunflower","Tulip"] },
  { q: "What has one eye but can’t see?", a: "Needle", o: ["Needle","Storm","Eye","Fish"] },
  { q: "What can’t talk but replies when spoken to?", a: "Echo", o: ["Echo","Shadow","Mirror","Bell"] },
  { q: "What’s always in front of you but can’t be seen?", a: "Future", o: ["Future","Air","Mirror","Light"] },
  { q: "Which planet has rings?", a: "Saturn", o: ["Saturn","Venus","Mars","Mercury"] },
  { q: "What is full of holes but still holds water?", a: "Sponge", o: ["Sponge","Cup","Bag","Rock"] },
  { q: "What is the capital of France?", a: "Paris", o: ["Paris","London","Berlin","Rome"] },
  { q: "What has many teeth but can’t bite?", a: "Comb", o: ["Comb","Dog","Gear","Brush"] },
  { q: "Which river is longest?", a: "Nile", o: ["Nile","Amazon","Ganga","Yangtze"] },
  { q: "What can fly without wings?", a: "Time", o: ["Time","Air","Bird","Sound"] },
  { q: "Which gas do we breathe in?", a: "Oxygen", o: ["Oxygen","Hydrogen","CO2","Nitrogen"] },
  { q: "What gets bigger the more you take away?", a: "Hole", o: ["Hole","Balloon","Number","Water"] },
  { q: "Which country is Land of Rising Sun?", a: "Japan", o: ["Japan","India","China","Korea"] },
  { q: "What’s next in pattern: A,C,F,J,O,?", a: "U", o: ["U","T","S","V"] },
  { q: "What has roots that nobody sees?", a: "Mountain", o: ["Mountain","Tree","Grass","River"] },
  { q: "Who discovered gravity?", a: "Isaac Newton", o: ["Isaac Newton","Einstein","Tesla","Edison"] },
  { q: "What number of colors in rainbow?", a: "Seven", o: ["Seven","Six","Five","Eight"] },
  { q: "If yesterday was Thursday, after tomorrow?", a: "Sunday", o: ["Sunday","Saturday","Monday","Tuesday"] },
  { q: "What organ helps you think?", a: "Brain", o: ["Brain","Heart","Eye","Lungs"] },
  { q: "What number after 11,14,17,20?", a: "23", o: ["23","24","21","25"] },
  { q: "What’s next 1,1,2,3,5,8,?", a: "13", o: ["13","10","12","14"] },
  { q: "Who wrote Romeo & Juliet?", a: "William Shakespeare", o: ["William Shakespeare","Milton","Keats","Byron"] },
  { q: "Which planet closest to Sun?", a: "Mercury", o: ["Mercury","Earth","Mars","Venus"] },
  { q: "Which is hardest natural substance?", a: "Diamond", o: ["Diamond","Iron","Gold","Silver"] },
  { q: "Which is largest planet?", a: "Jupiter", o: ["Jupiter","Earth","Saturn","Neptune"] },
  { q: "Which bird can imitate human speech?", a: "Parrot", o: ["Parrot","Crow","Sparrow","Eagle"] }
];

function startQuiz() {
  startScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');
  currentQuestion = 0;
  score = 0;
  usedQuestions = [];
  nextQuestion();
}

function nextQuestion() {
  if (usedQuestions.length === questions.length) return showResult();
  let qIndex;
  do {
    qIndex = Math.floor(Math.random() * questions.length);
  } while (usedQuestions.includes(qIndex));
  usedQuestions.push(qIndex);

  const q = questions[qIndex];
  levelElem.textContent = `Level ${usedQuestions.length}`;
  questionElem.textContent = q.q;
  optionsElem.innerHTML = '';

  const shuffled = [...q.o].sort(() => 0.5 - Math.random());
  shuffled.forEach(opt => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.onclick = () => selectAnswer(opt === q.a);
    optionsElem.appendChild(btn);
  });
}

function selectAnswer(correct) {
  if (correct) score += 10;
  else score -= 5;
  scoreElem.textContent = `Score: ${score}`;

  if (usedQuestions.length === 50) showResult();
  else nextQuestion();
}

function showResult() {
  quizScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');
  let msg = "";
  if (score < 100) msg = "Your IQ was low, work harder!";
  else if (score < 250) msg = "Very good, but keep practicing!";
  else msg = "Genius! Outstanding performance!";
  resultText.textContent = `${msg} Final Score: ${score}`;

  saveLeaderboard(score);
  showLeaderboard();
}

function saveLeaderboard(score) {
  const name = prompt("Enter your name:");
  const data = JSON.parse(localStorage.getItem('leaderboard') || "[]");
  data.push({ name, score });
  data.sort((a, b) => b.score - a.score);
  localStorage.setItem('leaderboard', JSON.stringify(data.slice(0,5)));
}

function showLeaderboard() {
  const data = JSON.parse(localStorage.getItem('leaderboard') || "[]");
  leaderboardElem.innerHTML = "<h3>Leaderboard</h3>";
  data.forEach((item, i) => {
    leaderboardElem.innerHTML += `<div>${i+1}. ${item.name} — ${item.score}</div>`;
  });
}

startBtn.onclick = startQuiz;
restartBtn.onclick = () => location.reload();