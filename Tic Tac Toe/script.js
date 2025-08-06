const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const namesDisplay = document.getElementById("names-display");

const board = document.getElementById("board");
const popup = document.getElementById("popup");
const message = document.getElementById("message");
const newGameBtn = document.getElementById("new-game");
const startBtn = document.getElementById("start");
const resetScoresBtn = document.getElementById("reset-scores");
const resetGameBtn = document.getElementById("reset-game");
const muteToggle = document.getElementById("mute-toggle");

const xNameEl = document.getElementById("x-name");
const oNameEl = document.getElementById("o-name");
const xScoreEl = document.getElementById("x-score");
const oScoreEl = document.getElementById("o-score");
const drawScoreEl = document.getElementById("draw-score");

const playerXInput = document.getElementById("playerX");
const playerOInput = document.getElementById("playerO");
const opponentSelect = document.getElementById("opponent");
const aiDifficultyGroup = document.getElementById("ai-difficulty-group");
const aiDifficulty = document.getElementById("aiDifficulty");
const playerOGroup = document.getElementById("playerO-group");

const clickSound = document.getElementById("click-sound");
const winSound = document.getElementById("win-sound");
const drawSound = document.getElementById("draw-sound");
const bgMusic = document.getElementById("bg-music");
const muteBtnList = document.querySelectorAll("#mute-toggle");

let musicStarted = false;


const winningPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const winQuotes = [
  "I told you I’d win! 😎",
  "Victory is mine! 🏆",
  "That was easy! 💪",
  "Better luck next time! 😉",
  "I’m the champion! 🎉",
  "Unstoppable, as always. 🚀",
  "Checkmate! 🎯",
  "No one can beat me! 🔥",
  "Another win in the bag. 👜",
  "That was fun — and I won! 😄",
];

const loseQuotes = [
  "You got lucky this time. 😉",
  "Okay okay, you win… but next time it’s mine! 🔄",
  "Well played. I’ll train harder! 🏋️‍♀️",
  "Hmph, beginner’s luck! 😏",
  "Alright champ, enjoy it while it lasts. 😎",
  "Not bad… but I’ll be back. 🔥",
  "You win now, but the war isn’t over! ⚔️",
  "You really earned it. 👏",
  "Fine… you’re good at this. 😌",
  "Next time I won’t go easy on you. 😜",
];

const drawQuotes = [
  "So close! We’re evenly matched. 🤝",
  "Nobody wins, nobody loses — just a great game. 😌",
  "It’s a tie! Time for a rematch. 🔄",
  "Wow, that was intense… and equal! 😮",
  "We both deserve a trophy for that one. 🏆",
  "Neither of us backed down — respect! 🙌",
  "Okay, next round decides it! ⚔️",
  "Great minds think alike. 🧠",
  "We’re too good to beat each other. 😎",
  "Let’s call it even… for now. 😉",
];

let xTurn = true,
  count = 0,
  boardState = [];
let xWins = 0,
  oWins = 0,
  draws = 0;
let muted = false,
  aiMode = "human";

opponentSelect.addEventListener("change", () => {
  if (opponentSelect.value === "human") {
    playerOGroup.style.display = "block";
    aiDifficultyGroup.style.display = "none";
  } else {
    playerOGroup.style.display = "none";
    aiDifficultyGroup.style.display = "block";
  }
});

startBtn.addEventListener("click", () => {
  const player1Name = playerXInput.value || "Player 1";
  const opponentType = opponentSelect.value;

  if (opponentType === "human") {
    aiMode = "human";
    xNameEl.textContent = player1Name;
    oNameEl.textContent = playerOInput.value || "Player 2";
  } else {
    aiMode = aiDifficulty.value;
    xNameEl.textContent = player1Name;
    oNameEl.textContent = "AI";
  }

  namesDisplay.textContent = `${xNameEl.textContent} vs ${oNameEl.textContent}`;
  startScreen.style.display = "none";
  gameScreen.style.display = "flex";

  resetBoard();
});

resetScoresBtn.addEventListener("click", () => {
  xWins = oWins = draws = 0;
  xScoreEl.textContent = oScoreEl.textContent = drawScoreEl.textContent = "0";
});
resetGameBtn.addEventListener("click", () => {
  resetBoard();
});
newGameBtn.addEventListener("click", resetBoard);

muteToggle.addEventListener("click", () => {
  muted = !muted;
  muteToggle.textContent = muted ? "🔇" : "🔊";
});

function playSound(sound) {
  if (!muted) {
    sound.pause();
    sound.currentTime = 0;
    sound.volume = 1;
    sound.play();
  }
}

function resetBoard() {
  board.innerHTML = "";
  boardState = Array(9).fill("");
  xTurn = true;
  count = 0;
  for (let i = 0; i < 9; i++) {
    const btn = document.createElement("button");
    btn.classList.add("button-option");
    btn.addEventListener("click", () => handleClick(i, btn));
    board.appendChild(btn);
  }
  popup.classList.add("hide");
  document.title = "Tic Tac Toe";
}

function handleClick(index, btn) {
  if (boardState[index] !== "") return;
  boardState[index] = xTurn ? "X" : "O";
  btn.textContent = boardState[index];
  btn.disabled = true;
  playSound(clickSound);
  btn.classList.add(boardState[index] === "X" ? "x-played" : "o-played");
  count++;

  if (checkWin()) {
    endGame(`${boardState[index]} Wins! 🎉`);
    if (boardState[index] === "X") {
      xWins++;
      xScoreEl.textContent = xWins;
    } else {
      oWins++;
      oScoreEl.textContent = oWins;
    }
    return;
  }
  if (count === 9) {
    endGame("Draw 😎");
    draws++;
    drawScoreEl.textContent = draws;
    return;
  }
  xTurn = !xTurn;
  if (!xTurn && aiMode !== "human") {
    setTimeout(() => aiMove(), 500);
  }
}

function checkWin() {
  for (let pattern of winningPatterns) {
    const [a, b, c] = pattern;
    if (
      boardState[a] &&
      boardState[a] === boardState[b] &&
      boardState[b] === boardState[c]
    ) {
      pattern.forEach((i) => board.children[i].classList.add("winner"));
      document.title = `${boardState[a]} Wins! 🎉`;
      playSound(winSound);
      return true;
    }
  }
  return false;
}

function endGame(msg) {
  popup.classList.remove("hide");

  const player1 = xNameEl.textContent;
  const player2 = oNameEl.textContent;

  if (/draw/i.test(msg)) {
    playSound(drawSound);

    const randomDrawQuote1 =
      drawQuotes[Math.floor(Math.random() * drawQuotes.length)];
    let randomDrawQuote2;
    do {
      randomDrawQuote2 =
        drawQuotes[Math.floor(Math.random() * drawQuotes.length)];
    } while (randomDrawQuote2 === randomDrawQuote1);

    message.innerHTML = `
      <div style="font-size:1.4em; font-weight:bold;">Draw 😎</div>
      <div><small>${player1}: ${randomDrawQuote1}</small></div>
      <div><small>${player2}: ${randomDrawQuote2}</small></div>
    `;
    document.title = "Draw 😎";
  } else {
    playSound(winSound);

    const winner = msg.includes("X") ? player1 : player2;
    const loser = msg.includes("X") ? player2 : player1;

    const randomWinQuote =
      winQuotes[Math.floor(Math.random() * winQuotes.length)];
    const randomLoseQuote =
      loseQuotes[Math.floor(Math.random() * loseQuotes.length)];

    message.innerHTML = `
      <div style="font-size:1.4em; font-weight:bold;">${winner} Wins! 🎉</div>
      <div><small>${winner}: ${randomWinQuote}</small></div>
      <div><small>${loser}: ${randomLoseQuote}</small></div>
    `;
    document.title = `${winner} Wins! 🎉`;
  }
}

// AI Logic
function aiMove() {
  let move;
  if (aiMode === "easy") {
    move = randomMove();
  } else if (aiMode === "medium") {
    move = mediumMove();
  } else if (aiMode === "hard") {
    move = hardMove();
  }
  if (move !== undefined) board.children[move].click();
}

function randomMove() {
  const empty = boardState
    .map((v, i) => (v === "" ? i : null))
    .filter((v) => v !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}

function mediumMove() {
  return findWinningMove("O") || findWinningMove("X") || randomMove();
}

function hardMove() {
  return (
    findWinningMove("O") ||
    findWinningMove("X") ||
    takeCenter() ||
    takeCorner() ||
    randomMove()
  );
}

function findWinningMove(player) {
  for (let pattern of winningPatterns) {
    const [a, b, c] = pattern;
    const line = [boardState[a], boardState[b], boardState[c]];
    const emptyIndex = line.indexOf("");
    if (emptyIndex !== -1 && line.filter((v) => v === player).length === 2) {
      return pattern[emptyIndex];
    }
  }
  return null;
}

function takeCenter() {
  if (boardState[4] === "") return 4;
  return null;
}

function takeCorner() {
  const corners = [0, 2, 6, 8].filter((i) => boardState[i] === "");
  if (corners.length > 0) {
    return corners[Math.floor(Math.random() * corners.length)];
  }
  return null;
}

// Start music after first interaction
document.addEventListener("click", () => {
  if (!musicStarted) {
    bgMusic.volume = 0.5;
    bgMusic.play().catch(err => console.warn("Autoplay blocked:", err));
    musicStarted = true;
  }
});

// Mute toggle — works on both screens
muteBtnList.forEach(muteBtn => {
  muteBtn.addEventListener("click", () => {
    muted = !muted;
    muteBtnList.forEach(btn => btn.textContent = muted ? "🔇" : "🔊");

    if (muted) {
      bgMusic.pause();
    } else {
      bgMusic.play().catch(err => console.warn("Autoplay blocked:", err));
    }
  });
});
