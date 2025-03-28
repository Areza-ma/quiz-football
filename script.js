// ✅ Correction du blocage à la dernière question + ajout des avatars dans le classement

// script.js (mis à jour avec stats finales)
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

const questions = [
  {
    question: "Quel pays a remporté la Coupe du monde 2018 ?",
    answers: ["Brésil", "France", "Allemagne", "Argentine"],
    correct: "France",
    imageQuestion: "coupe-du-monde.png",
    imagesAnswers: [
      "bresil.png",
      "france.png",
      "allemagne.png",
      "argentine.png"
    ]
  },
  {
    question: "Quel joueur est surnommé 'La Pulga' ?",
    answers: ["Cristiano Ronaldo", "Messi", "Neymar", "Kylian Mspeed"],
    correct: "Messi",
    imageQuestion: "pulga.png",
    imagesAnswers: [
      "ronaldo.png",
      "messi.png",
      "neymar.png",
      "mbappe.png"
    ]
  },
  {
    question: "Quel club a gagné le plus de Ligues des Champions ?",
    answers: ["Barcelone", "FC Musulman", "Manchester United", "Real Madrid"],
    correct: "Real Madrid",
    imageQuestion: "ucl-trophy.png",
    imagesAnswers: [
      "barcelone.png",
      "fcmuslim.png",
      "manutd.png",
      "realmadrid.png"
    ]
  },
  {
    question: "En quelle année a eu lieu la première Coupe du monde ?",
    answers: ["1928", "1930", "2001", "2050"],
    correct: "1930",
    imageQuestion: "wc.png",
    imagesAnswers: [
      "1928.png",
      "1930.png",
      "2001.png",
      "2050.png"
    ]
  },
  {
    question: "Quel joueur a remporté le plus de Ballons d'Or ?",
    answers: ["Palmer", "Cristiano Ronaldo", "Messi", "T-Bag"],
    correct: "Messi",
    imageQuestion: "ballon-or.png",
    imagesAnswers: [
      "palmer.png",
      "ronaldoo.png",
      "messii.png",
      "tbag.png"
    ]
  },
  {
    question: "Quel joueur a déjà graille un adversaire en plein match ?",
    answers: ["Pepe", "Luis Suárez", "CR7", "Walter White"],
    correct: "Luis Suárez",
    imageQuestion: "morsure.png",
    imagesAnswers: [
      "pepefou.png",
      "suarezmordu.png",
      "cr7fou.png",
      "WW.png"
    ]
  },
  {
    question: "Qui est connu pour avoir dit : «  le fer aiguise le fer » ?",
    answers: ["Sensei WU", "Schofield", "Byilhann", "Mourinho"],
    correct: "Sensei WU",
    imageQuestion: "conix.png",
    imagesAnswers: [
      "senseiWu.png",
      "schofield.png",
      "bylhann.png",
      "mourinho.png"
    ]
  },
  {
    question: "Quel joueur a déjà fait la célébration du H ?",
    answers: ["Elon Musk", "Muller", "Van Persi", "jsp c'est qui"],
    correct: "jsp c'est qui",
    imageQuestion: "hcelebration.png",
    imagesAnswers: [
      "musk.png",
      "muller.png",
      "vpersie.png",
      "malade.png"
    ]
  }
  
];
let currentQuestion = 0;
let score = 0;
let pseudo = "";
let avatar = "";
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
let startTime = 0;
let totalTime = 0;
let wrongCount = new Array(questions.length).fill(0);

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const scoreEl = document.getElementById("score");

function selectAvatar(img) {
  document.querySelectorAll('.avatar-option').forEach(el => el.classList.remove('selected'));
  img.classList.add('selected');
  avatar = img.src;
}

function startQuiz() {
  const input = document.getElementById("pseudo-input");
  if (input.value.trim() === "") {
    alert("Veuillez entrer un pseudo !");
    return;
  }
  const selectedAvatar = document.querySelector(".avatar-option.selected");
  if (!selectedAvatar) {
    alert("Veuillez choisir un avatar !");
    return;
  }
  pseudo = input.value.trim();
  avatar = selectedAvatar.src;
  document.getElementById("pseudo-screen").style.display = "none";
  document.querySelector(".container").style.display = "block";
  showQuestion();
}

function showQuestion() {
  const q = questions[currentQuestion];
  questionEl.textContent = q.question;
  document.getElementById("image-question").src = q.imageQuestion;
  answersEl.innerHTML = "";
  startTime = Date.now();

  q.answers.forEach((answer, index) => {
    const btn = document.createElement("button");
    btn.classList.add("answer-btn");
    btn.innerHTML = `
      <img src="${q.imagesAnswers[index]}" alt="${answer}" />
      <span>${answer}</span>
    `;
    btn.onclick = () => checkAnswer(answer, btn);
    answersEl.appendChild(btn);
  });
}

function checkAnswer(answer, button) {
  const correct = questions[currentQuestion].correct;
  const allButtons = document.querySelectorAll(".answer-btn");
  allButtons.forEach(btn => btn.disabled = true);

  const elapsed = (Date.now() - startTime) / 1000;
  totalTime += elapsed;

  if (answer === correct) {
    score++;
    scoreEl.textContent = `Score : ${score}`;
    button.classList.add("correct");
    showFeedback("correct.gif", "Bonne réponse !");
  } else {
    wrongCount[currentQuestion]++;
    button.classList.add("wrong");
    showFeedback("wrong.gif", "Mauvaise réponse !");
  }

  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      showQuestion();
    } else {
      setTimeout(endQuiz, 100); // 🔥 Correction : on passe bien à la fin
    }
  }, 4500);
}

function showFeedback(image, message) {
  const feedback = document.createElement("div");
  feedback.className = "feedback";
  feedback.innerHTML = `<img src="${image}" alt="feedback" /><p>${message}</p>`;
  document.body.appendChild(feedback);
  setTimeout(() => {
    document.body.removeChild(feedback);
  }, 4500);
}

async function endQuiz() {
  document.querySelector(".container").style.display = "none";
  document.getElementById("leaderboard").style.display = "block";
  document.getElementById("final-message").style.display = "block";

  const finalText = document.getElementById("final-text");
  const finalImage = document.getElementById("final-image");
  if (score < 3) {
    finalText.textContent = "Arrête d'être con...";
    finalImage.src = "connerie.png";
  } else {
    finalText.textContent = "Bien joué, t'as géré !";
    finalImage.src = "gg.png";
  }

  const averageTime = (totalTime / questions.length).toFixed(2);
  const percentage = ((score / questions.length) * 100).toFixed(0);
  const worstIndex = wrongCount.indexOf(Math.max(...wrongCount));
  const worstQuestion = questions[worstIndex]?.question || "Aucune";

  const stats = document.createElement("div");
  stats.innerHTML = `
    <p><strong>📊 Stats de ta partie :</strong></p>
    <p>⏱️ Temps moyen : <strong>${averageTime}</strong> sec/question</p>
    <p>✅ Pourcentage de bonnes réponses : <strong>${percentage}%</strong></p>
    <p>😅 Question la plus difficile : <em>"${worstQuestion}"</em></p>
  `;
  document.getElementById("final-message").appendChild(stats);

  import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

await addDoc(collection(window.db, "scores"), {
  pseudo,
  avatar,
  score,
  time: parseFloat(averageTime),
  date: new Date().toISOString().split("T")[0]
});

  renderLeaderboards();

  const devMsg = document.createElement("p");
  devMsg.textContent = "Ce site est un début... d'autres meilleures versions arrivent bientôt !";
  devMsg.style.marginTop = "20px";
  document.getElementById("final-message").appendChild(devMsg);
}

function renderLeaderboards() {
  const today = new Date().toISOString().split("T")[0];
  const recentDates = [...new Set(leaderboard.map(e => e.date))].slice(-2);
  const todayList = leaderboard.filter(e => e.date === today)
    .sort((a, b) => b.score - a.score || a.time - b.time);
  const oldList = leaderboard.filter(e => recentDates.includes(e.date) && e.date !== today);

  const lb = document.getElementById("leaderboard-list");
  lb.innerHTML = "<li><strong>Rang | Avatar | Pseudo | Score | Temps moyen</strong></li>";
  todayList.forEach((entry, index) => {
    const li = document.createElement("li");
    const avatarImg = entry.avatar ? `<img src="${entry.avatar}" class="avatar-small" alt="avatar" />` : "";
    li.innerHTML = `${index + 1}. ${avatarImg} ${entry.pseudo} | ${entry.score} | ${entry.time}s`;
    lb.appendChild(li);
  });

  const oldDiv = document.getElementById("old-leaderboards");
  oldDiv.innerHTML = "";
  oldList.forEach(entry => {
    const div = document.createElement("div");
    div.className = "old-entry";
    div.textContent = `${entry.date} → ${entry.pseudo} (${entry.score})`;
    oldDiv.appendChild(div);
  });

  const updatedLB = leaderboard.filter(e => recentDates.includes(e.date));
  localStorage.setItem("leaderboard", JSON.stringify(updatedLB));
}
