const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("startBtn");
const scoreText = document.getElementById("score");
const highText = document.getElementById("high");

let gameRunning = false;
let score = 0;
let highScore = 0;
let speed = 2;

const player = {
  x: 180,
  y: 520,
  w: 40,
  h: 40,
  dx: 0
};

let enemies = [];

// Controls
let leftPressed = false;
let rightPressed = false;

// Keyboard
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" || e.key === "a") leftPressed = true;
  if (e.key === "ArrowRight" || e.key === "d") rightPressed = true;
});
document.addEventListener("keyup", e => {
  if (e.key === "ArrowLeft" || e.key === "a") leftPressed = false;
  if (e.key === "ArrowRight" || e.key === "d") rightPressed = false;
});

// Touch
document.getElementById("left").ontouchstart = () => leftPressed = true;
document.getElementById("left").ontouchend = () => leftPressed = false;
document.getElementById("right").ontouchstart = () => rightPressed = true;
document.getElementById("right").ontouchend = () => rightPressed = false;

// Start
startBtn.onclick = startGame;

function startGame() {
  enemies = [];
  score = 0;
  speed = 2;
  player.x = 180;
  gameRunning = true;
  startBtn.style.display = "none";
  loop();
}

function spawnEnemy() {
  enemies.push({
    x: Math.random() * 360,
    y: -40,
    w: 40,
    h: 40
  });
}

function update() {
  if (leftPressed) player.x -= 5;
  if (rightPressed) player.x += 5;

  if (player.x < 0) player.x = 0;
  if (player.x > 360) player.x = 360;

  enemies.forEach(e => {
    e.y += speed;
  });

  enemies = enemies.filter(e => e.y < 600);

  if (Math.random() < 0.03) spawnEnemy();

  // Collision
  enemies.forEach(e => {
    if (
      player.x < e.x + e.w &&
      player.x + player.w > e.x &&
      player.y < e.y + e.h &&
      player.y + player.h > e.y
    ) {
      endGame();
    }
  });

  score++;
  speed += 0.0008;

  scoreText.textContent = "Score: " + score;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player
  ctx.fillStyle = "#38bdf8";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  // Enemies
  ctx.fillStyle = "#ef4444";
  enemies.forEach(e => {
    ctx.fillRect(e.x, e.y, e.w, e.h);
  });
}

function endGame() {
  gameRunning = false;
  startBtn.style.display = "inline-block";
  startBtn.textContent = "PLAY AGAIN";

  if (score > highScore) highScore = score;
  highText.textContent = "Best: " + highScore;
}

function loop() {
  if (!gameRunning) return;
  update();
  draw();
  requestAnimationFrame(loop);
}
