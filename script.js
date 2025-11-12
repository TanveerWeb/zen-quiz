// =======================
// 🌐 ZEN QUIZ FINAL JS
// =======================

// Elements
const startBtn = document.getElementById("startBtn");
const gameContainer = document.getElementById("gameContainer");
const questionText = document.getElementById("question");
const optionsContainer = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const scoreDisplay = document.getElementById("score");
const resultContainer = document.getElementById("resultContainer");
const resultText = document.getElementById("resultText");
const leaderboardContainer = document.getElementById("leaderboard");
const leaderboardList = document.getElementById("leaderboardList");

// Variables
let currentQuestionIndex = 0;
let score = 0;
let usedQuestions = [];
let username = localStorage.getItem("playerName") || prompt("Enter your name:");
localStorage.setItem("playerName", username);

// ✅ 50 MIX QUESTIONS
const questions = [
  // Riddles
  { q: "Ek aisi cheez jo hamesha badhti hai par kabhi ghat'ti nahi?", a: "Age", o: ["Age", "Height", "Time", "Money"] },
  { q: "Kis cheez ke pair hote hain par chal nahi sakti?", a: "Table", o: ["Chair", "Car", "Table", "Spoon"] },
  { q: "Main bina muh ke bolta hoon, bina kaan ke sunta hoon. Main kaun hoon?", a: "Echo", o: ["Wind", "Shadow", "Echo", "Sound"] },
  { q: "Kis cheez ka sir aur poonch hota hai par shareer nahi?", a: "Coin", o: ["Snake", "Coin", "Bottle", "Lizard"] },
  { q: "Kya hamesha aata hai par kabhi pahunchta nahi?", a: "Tomorrow", o: ["Train", "Tomorrow", "Sun", "Cloud"] },

  // Logic
  { q: "Agar 5 machine 5 item 5 minute me banati hain, to 100 machine 100 item banane me kitna time legi?", a: "5 minutes", o: ["1 minute", "5 minutes", "100 minutes", "10 minutes"] },
  { q: "Kis number me 3 bar 3 hota hai?", a: "333", o: ["333", "3333", "33", "303"] },
  { q: "Ek kachua aur ek khargosh race kar rahe hain, kaun jeetega?", a: "Depends on speed", o: ["Tortoise", "Rabbit", "Both", "Depends on speed"] },
  { q: "Agar ek ghari 12 baar bajti hai 12 ghante me, to 6 ghante me kitni baar bajegi?", a: "6", o: ["6", "12", "3", "9"] },
  { q: "2 aadmi 2 din me 2 ghar banate hain. To 6 aadmi 6 din me kitne ghar banayenge?", a: "18", o: ["12", "18", "6", "9"] },

  // GK
  { q: "Bharat ki rajdhani kya hai?", a: "New Delhi", o: ["Mumbai", "New Delhi", "Kolkata", "Chennai"] },
  { q: "Taj Mahal kisne banwaya?", a: "Shah Jahan", o: ["Akbar", "Shah Jahan", "Babur", "Aurangzeb"] },
  { q: "World's longest river?", a: "Nile", o: ["Amazon", "Ganga", "Nile", "Yangtze"] },
  { q: "Who wrote 'Ramayana'?", a: "Valmiki", o: ["Tulsidas", "Valmiki", "Vyasa", "Kalidas"] },
  { q: "Which planet is called the Red Planet?", a: "Mars", o: ["Earth", "Jupiter", "Mars", "Venus"] },

  // Mix more (same pattern, to reach 50)
  { q: "Light travels faster than?", a: "Sound", o: ["Sound", "Water", "Air", "Electricity"] },
  { q: "Which gas do plants release?", a: "Oxygen", o: ["Carbon Dioxide", "Oxygen", "Nitrogen", "Helium"] },
  { q: "What is 12 × 12?", a: "144", o: ["124", "142", "144", "146"] },
  { q: "Which month has 28 days?", a: "All months", o: ["February", "All months", "January", "None"] },
  { q: "How many hours in 2 days?", a: "48", o: ["24", "48", "36", "72"] },

  { q: "Kis janwar ke daant hamesha badhte rehte hain?", a: "Rabbit", o: ["Dog", "Cat", "Rabbit", "Horse"] },
  { q: "Which color forms when you mix red and blue?", a: "Purple", o: ["Green", "Yellow", "Purple", "Orange"] },
  { q: "Which ocean is largest?", a: "Pacific", o: ["Indian", "Pacific", "Atlantic", "Arctic"] },
  { q: "Which organ purifies blood?", a: "Kidney", o: ["Liver", "Kidney", "Heart", "Lungs"] },
  { q: "How many continents are there?", a: "7", o: ["5", "6", "7", "8"] },

  { q: "India got independence in?", a: "1947", o: ["1945", "1947", "1950", "1930"] },
  { q: "Which is the smallest planet?", a: "Mercury", o: ["Mars", "Mercury", "Earth", "Venus"] },
  { q: "Who discovered gravity?", a: "Newton", o: ["Einstein", "Newton", "Galileo", "Edison"] },
  { q: "Which festival is of lights?", a: "Diwali", o: ["Holi", "Eid", "Diwali", "Baisakhi"] },
  { q: "National animal of India?", a: "Tiger", o: ["Lion", "Tiger", "Elephant", "Peacock"] },

  { q: "Who invented bulb?", a: "Edison", o: ["Edison", "Newton", "Tesla", "Einstein"] },
  { q: "Largest desert?", a: "Sahara", o: ["Thar", "Sahara", "Gobi", "Arabian"] },
  { q: "Fastest land animal?", a: "Cheetah", o: ["Tiger", "Cheetah", "Lion", "Leopard"] },
  { q: "Largest mammal?", a: "Blue Whale", o: ["Elephant", "Blue Whale", "Shark", "Giraffe"] },
  { q: "Human body has how many bones?", a: "206", o: ["205", "210", "206", "201"] },

  { q: "Water freezes at?", a: "0°C", o: ["0°C", "32°C", "100°C", "−10°C"] },
  { q: "Which is India’s national bird?", a: "Peacock", o: ["Parrot", "Peacock", "Crow", "Sparrow"] },
  { q: "Which planet has rings?", a: "Saturn", o: ["Saturn", "Mars", "Neptune", "Venus"] },
  { q: "Who painted Mona Lisa?", a: "Leonardo da Vinci", o: ["Leonardo da Vinci", "Picasso", "Michelangelo", "Van Gogh"] },
  { q: "Brain of computer?", a: "CPU", o: ["Mouse", "CPU", "RAM", "Hard disk"] },

  { q: "Which metal is liquid at room temp?", a: "Mercury", o: ["Mercury", "Iron", "Silver", "Copper"] },
  { q: "Which day comes after Tuesday?", a: "Wednesday", o: ["Monday", "Wednesday", "Friday", "Sunday"] },
  { q: "How many letters in English alphabet?", a: "26", o: ["24", "25", "26", "28"] },
  { q: "National fruit of India?", a: "Mango", o: ["Apple", "Banana", "Mango", "Grapes"] },
  { q: "Which sense organ helps us to see?", a: "Eyes", o: ["Ears", "Eyes", "Nose", "Skin"] },

  { q: "Earth revolves around?", a: "Sun", o: ["Moon", "Sun", "Mars", "Venus"] },
  { q: "Which animal gives wool?", a: "Sheep", o: ["Goat", "Cow", "Sheep", "Buffalo"] },
  { q: "Which shape has 3 sides?", a: "Triangle", o: ["Square", "Circle", "Triangle", "Pentagon"] },
  { q: "Which country invented paper?", a: "China", o: ["India", "China", "Japan", "Egypt"] },
  { q: "First man on moon?", a: "Neil Armstrong", o: ["Neil Armstrong", "Buzz Aldrin", "Yuri Gagarin", "Kalpana Chawla"] }
];

// ✅ Shuffle options for randomness
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// ✅ Load next question
function loadQuestion() {
  if (usedQuestions.length === questions.length) return endGame();
  let qIndex;
  do {
    qIndex = Math.floor(Math.random() * questions.length);
  } while (usedQuestions.includes(qIndex));

  usedQuestions.push(qIndex);
  const q = questions[qIndex];
  questionText.textContent = q.q;
  optionsContainer.innerHTML = "";
  shuffle(q.o).forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.className = "option";
    btn.onclick = () => checkAnswer(opt, q.a);
    optionsContainer.appendChild(btn);
  });
}

// ✅ Check answer
function checkAnswer(selected, correct) {
  const buttons = document.querySelectorAll(".option");
  buttons.forEach(b => (b.disabled = true));
  if (selected === correct) {
    score += 10;
    scoreDisplay.textContent = `Score: ${score}`;
  } else {
    score -= 5;
    scoreDisplay.textContent = `Score: ${score}`;
  }
  nextBtn.style.display = "block";
}

// ✅ Next button
nextBtn.onclick = () => {
  currentQuestionIndex++;
  nextBtn.style.display = "none";
  if (currentQuestionIndex < 50) {
    loadQuestion();
  } else {
    endGame();
  }
};

// ✅ End game + Leaderboard
function endGame() {
  gameContainer.style.display = "none";
  resultContainer.style.display = "block";
  let iqMessage = "";
  if (score < 150) iqMessage = "😢 Your IQ was low, work harder!";
  else if (score < 300) iqMessage = "🙂 Good job, but improve a bit!";
  else iqMessage = "🚀 Genius! You nailed it!";

  resultText.textContent = `${username}, your final score is ${score}. ${iqMessage}`;
  updateLeaderboard(username, score);
}

// ✅ Leaderboard local storage
function updateLeaderboard(name, score) {
  let data = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  data.push({ name, score });
  data.sort((a, b) => b.score - a.score);
  data = data.slice(0, 5);
  localStorage.setItem("leaderboard", JSON.stringify(data));
  leaderboardList.innerHTML = "";
  data.forEach(d => {
    const li = document.createElement("li");
    li.textContent = `${d.name} — ${d.score}`;
    leaderboardList.appendChild(li);
  });
}

// ✅ Start game
startBtn.onclick = () => {
  startBtn.style.display = "none";
  gameContainer.style.display = "block";
  loadQuestion();
};