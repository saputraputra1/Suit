// Inisialisasi Firebase
const database = firebase.database();

// Variabel Game
let player1Choice = null;
let player2Choice = null;
let player1Score = 0;
let player2Score = 0;
let timer1, timer2;
let timeLeft1 = 10;
let timeLeft2 = 10;

// Simpan pilihan ke Firebase
function saveChoice(player, choice) {
  database.ref(`game/player${player}`).set(choice);
}

// Listen perubahan data
database.ref('game').on('value', (snapshot) => {
  const data = snapshot.val();
  if (data) {
    player1Choice = data.player1 || null;
    player2Choice = data.player2 || null;

    // Update UI
    if (player1Choice) {
      document.querySelector('#player1 .status').textContent = `Kamu: ${player1Choice}`;
    }
    if (player2Choice) {
      document.querySelector('#player2 .status').textContent = `Pacar: ${player2Choice}`;
    }

    // Cek pemenang
    if (player1Choice && player2Choice) {
      determineWinner();
    }
  }
});

// Fungsi utama game
function determineWinner() {
  let result = "";
  
  if (player1Choice === player2Choice) {
    result = "Seri! 😊";
  } else if (
    (player1Choice === "✊" && player2Choice === "✌️") ||
    (player1Choice === "✌️" && player2Choice === "✋") ||
    (player1Choice === "✋" && player2Choice === "✊")
  ) {
    result = "Kamu MENANG! 💖";
    player1Score++;
  } else {
    result = "Pacar MENANG! 😘";
    player2Score++;
  }

  // Update UI
  document.getElementById('result-text').textContent = result;
  document.getElementById('score1').textContent = player1Score;
  document.getElementById('score2').textContent = player2Score;
}

// Reset Game
document.getElementById('reset').addEventListener('click', () => {
  database.ref('game').remove();  // Hapus data Firebase
  player1Choice = null;
  player2Choice = null;
  document.querySelector('#player1 .status').textContent = "Pilih sekarang!";
  document.querySelector('#player2 .status').textContent = "Menunggu...";
  document.getElementById('result-text').textContent = "Ayo mainkan!";
});
