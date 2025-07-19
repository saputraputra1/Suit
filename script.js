// Variabel Global
let currentMode = "single";
let player1Choice = null;
let player2Choice = null;
let player1Score = 0;
let player2Score = 0;
let timer1, timer2;
let timeLeft1 = 10;
let timeLeft2 = 10;
let isTimerRunning = false;

// Element References
const player1Section = document.getElementById('player1');
const player2Section = document.getElementById('player2');
const resultText = document.getElementById('result-text');
const resetButton = document.getElementById('reset');
const score1Element = document.getElementById('score1');
const score2Element = document.getElementById('score2');
const player1Display = document.getElementById('player1-display');
const player2Display = document.getElementById('player2-display');
const vsElement = document.getElementById('vs');

// Audio Elements
const clickSound = document.getElementById('click-sound');
const winSound = document.getElementById('win-sound');
const loseSound = document.getElementById('lose-sound');
const drawSound = document.getElementById('draw-sound');
const tickSound = document.getElementById('tick-sound');
const bgMusic = document.getElementById('bg-music');

// Musik Background (otomatis play)
bgMusic.volume = 0.3;
document.addEventListener('click', () => {
  bgMusic.play().catch(e => console.log("Autoplay blocked"));
}, { once: true });

// Mode Selection
document.getElementById('single-mode').addEventListener('click', () => {
  currentMode = "single";
  player2Section.classList.add('hidden');
  resetGame();
});

document.getElementById('multi-mode').addEventListener('click', () => {
  currentMode = "multi";
  player2Section.classList.remove('hidden');
  resetGame();
});

// Player Choices
document.querySelectorAll('.choice').forEach(button => {
  button.addEventListener('click', (e) => {
    clickSound.play();
    
    if (e.target.closest('#player1')) {
      player1Choice = e.target.dataset.choice;
      player1Display.textContent = player1Choice;
      player1Display.classList.add('bounce');
      setTimeout(() => player1Display.classList.remove('bounce'), 500);
      document.querySelector('#player1 .status').textContent = `Kamu memilih: ${player1Choice}`;
      resetTimer();
      
      if (currentMode === "single") {
        playSingleMode();
      } else {
        startPlayer2Timer();
        document.querySelector('#player2 .status').textContent = "Pacar, pilih sekarang!";
      }
    } else if (e.target.closest('#player2')) {
      player2Choice = e.target.dataset.choice;
      player2Display.textContent = player2Choice;
      player2Display.classList.add('bounce');
      setTimeout(() => player2Display.classList.remove('bounce'), 500);
      document.querySelector('#player2 .status').textContent = `Pacar memilih: ${player2Choice}`;
      resetTimer();
      playMultiMode();
    }
  });
});

// Timer Functions
function startPlayer1Timer() {
  resetTimer();
  timeLeft1 = 10;
  updateTimerDisplay('player1', timeLeft1);
  animateProgressBar('player1-timer-bar', 10);
  
  timer1 = setInterval(() => {
    timeLeft1--;
    updateTimerDisplay('player1', timeLeft1);
    
    if (timeLeft1 <= 3 && timeLeft1 > 0) {
      tickSound.play();
    }
    
    if (timeLeft1 <= 0) {
      clearInterval(timer1);
      handleTimeOut('player1');
    }
  }, 1000);
}

function startPlayer2Timer() {
  timeLeft2 = 10;
  updateTimerDisplay('player2', timeLeft2);
  animateProgressBar('player2-timer-bar', 10);
  
  timer2 = setInterval(() => {
    timeLeft2--;
    updateTimerDisplay('player2', timeLeft2);
    
    if (timeLeft2 <= 3 && timeLeft2 > 0) {
      tickSound.play();
    }
    
    if (timeLeft2 <= 0) {
      clearInterval(timer2);
      handleTimeOut('player2');
    }
  }, 1000);
}

function updateTimerDisplay(player, time) {
  document.getElementById(`${player}-timer`).textContent = `${time}s`;
}

function animateProgressBar(elementId, duration) {
  const progressBar = document.getElementById(elementId);
  progressBar.innerHTML = '';
  const innerBar = document.createElement('div');
  innerBar.style.height = '100%';
  innerBar.style.width = '100%';
  innerBar.style.background = 'linear-gradient(90deg, #ff6b8b, #ff8e53)';
  innerBar.style.borderRadius = '10px';
  innerBar.style.transition = `width ${duration}s linear`;
  progressBar.appendChild(innerBar);
  
  setTimeout(() => {
    innerBar.style.width = '0%';
  }, 10);
}

function resetTimer() {
  clearInterval(timer1);
  clearInterval(timer2);
  document.getElementById('player1-timer-bar').innerHTML = '';
  document.getElementById('player2-timer-bar').innerHTML = '';
}

// Game Logic
function playSingleMode() {
  const choices = ['✊', '✌️', '✋'];
  player2Choice = choices[Math.floor(Math.random() * 3)];
  player2Display.textContent = player2Choice;
  player2Display.classList.add('bounce');
  setTimeout(() => player2Display.classList.remove('bounce'), 500);
  determineWinner();
}

function playMultiMode() {
  if (player1Choice && player2Choice) {
    determineWinner();
  }
}

function handleTimeOut(player) {
  if (player === "player1") {
    player1Choice = null;
    player1Display.textContent = "⌛";
    document.querySelector('#player1 .status').textContent = "Waktu habis! 😢";
    if (currentMode === "single") playSingleMode();
  } else {
    player2Choice = null;
    player2Display.textContent = "⌛";
    document.querySelector('#player2 .status').textContent = "Pacar tidak memilih!";
  }

  if (currentMode === "multi" && (player1Choice === null || player2Choice === null)) {
    determineWinner();
  }
}

function determineWinner() {
  vsElement.style.opacity = '1';
  let result = "";
  
  if (player1Choice === null || player2Choice === null) {
    result = player1Choice === null ? "Pacar MENANG! 😘" : "Kamu MENANG! 💖";
    if (player1Choice === null) {
      player2Score++;
      loseSound.play();
    } else {
      player1Score++;
      winSound.play();
    }
  } else if (player1Choice === player2Choice) {
    result = "Seri! 😊";
    drawSound.play();
  } else if (
    (player1Choice === "✊" && player2Choice === "✌️") ||
    (player1Choice === "✌️" && player2Choice === "✋") ||
    (player1Choice === "✋" && player2Choice === "✊")
  ) {
    result = "Kamu MENANG! 💖";
    player1Score++;
    winSound.play();
  } else {
    result = "Pacar MENANG! 😘";
    player2Score++;
    loseSound.play();
  }
  
  resultText.textContent = result;
  score1Element.textContent = player1Score;
  score2Element.textContent = player2Score;
  resetButton.classList.remove('hidden');
}

// Reset Game
resetButton.addEventListener('click', resetGame);

function resetGame() {
  resetTimer();
  player1Choice = null;
  player2Choice = null;
  player1Display.textContent = "?";
  player2Display.textContent = "?";
  vsElement.style.opacity = '0.5';
  document.querySelector('#player1 .status').textContent = "Pilih sekarang!";
  document.querySelector('#player2 .status').textContent = currentMode === "multi" ? "Menunggu..." : "";
  resultText.textContent = "Ayo mainkan!";
  resetButton.classList.add('hidden');
  
  if (currentMode === "multi") {
    startPlayer1Timer();
  }
}

// Init Game
resetGame();
