/* ==========================
   🎬  Tela inicial + som
========================== */
const startBtn = document.getElementById("start-btn");
const startScreen = document.getElementById("start-screen");
const game = document.getElementById("game");

// som ao iniciar
const startSound = new Audio("/assets/start.mp3");

startBtn.addEventListener("click", () => {
  startSound.play(); // toca o som
  startScreen.classList.add("hidden");
  game.classList.remove("hidden");
});

/* ==========================
   🌌 Hiperdrive (canvas)
========================== */
const canvas = document.getElementById("hyperdrive");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
const numStars = 400;

for (let i = 0; i < numStars; i++) {
  stars.push({
    x: (Math.random() - 0.5) * canvas.width,
    y: (Math.random() - 0.5) * canvas.height,
    z: Math.random() * canvas.width
  });
}

function drawStars() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < numStars; i++) {
    let star = stars[i];
    let prevZ = star.z; // guarda a posição anterior
    star.z -= 8; // velocidade da estrela (aumente para mais "warp speed")

    if (star.z <= 0) {
      star.x = (Math.random() - 0.5) * canvas.width;
      star.y = (Math.random() - 0.5) * canvas.height;
      star.z = canvas.width;
      prevZ = star.z; // reinicia também o rastro
    }

    // posição anterior
    let kPrev = 128.0 / prevZ;
    let prevX = star.x * kPrev + canvas.width / 2;
    let prevY = star.y * kPrev + canvas.height / 2;

    // posição atual
    let k = 128.0 / star.z;
    let x = star.x * k + canvas.width / 2;
    let y = star.y * k + canvas.height / 2;

    if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
      ctx.strokeStyle = "white";
      ctx.lineWidth = 1.5; // grossura da linha do rastro
      ctx.beginPath();
      ctx.moveTo(prevX, prevY); // ponto anterior
      ctx.lineTo(x, y);         // ponto atual
      ctx.stroke();
    }
  }

  requestAnimationFrame(drawStars);
}
drawStars();

// Sons
const jediSound = new Audio("/assets/lightsaber.mp3");
const sithSound = new Audio("/assets/lightsaber2.mp3");
const neutralSound = new Audio("/assets/lightsaber3.mp3");

// Referências
const playerChoice = document.getElementById("player-choice");
const computerChoice = document.getElementById("computer-choice");
const resultDisplay = document.getElementById("result");
const playerPoints = document.getElementById("player-points");
const computerPoints = document.getElementById("computer-points");

let playerScoreNumber = 0
let computerScoreNumber = 0

// Opções do jogo
const choices = ["Jedi", "Sith", "Neutro"];

// Função de resultado
function playRound(playerSelection) {
  // Escolha do computador
  const computerSelection = choices[Math.floor(Math.random() * choices.length)];

  // Mostrar escolhas
  playerChoice.textContent = playerSelection;
  computerChoice.textContent = computerSelection;

  // Tocar som
  if (playerSelection === "Jedi") jediSound.play();
  if (playerSelection === "Sith") sithSound.play();
  if (playerSelection === "Neutro") neutralSound.play();

  // Determinar resultado && Somar pontos
  let result = "";
  if (playerSelection === computerSelection) {
    result = "Empate!";
  } else if (
    (playerSelection === "Jedi" && computerSelection === "Sith") ||
    (playerSelection === "Sith" && computerSelection === "Neutro") ||
    (playerSelection === "Neutro" && computerSelection === "Jedi")
  ) {
    playerScoreNumber++;
    playerPoints.innerHTML = playerScoreNumber;
    result = "Você venceu! ✨";
  } else {
    computerScoreNumber++;
    computerPoints.innerHTML = computerScoreNumber;
    result = "Você perdeu... 🌑";
  }

  resultDisplay.textContent = "Resultado: " + result;
}

// Eventos para os botões
document.querySelector(".jedi").addEventListener("click", () => playRound("Jedi"));
document.querySelector(".sith").addEventListener("click", () => playRound("Sith"));
document.querySelector(".neutral").addEventListener("click", () => playRound("Neutro"));

// Contador de visitas
fetch("https://api.countapi.xyz/hit/jokenpo-jedi-vs-sith/visits")
  .then(res => res.json())
  .then(res => {
    document.getElementById("visitor-counter").textContent =
      `👀 Visitas: ${res.value}`;
  });