let currentSessionId = null;
let currentUserId = null;
let currentRow = 0;
let currentCol = 0;

document.addEventListener("DOMContentLoaded", function() {
  console.log("Document loaded");
  startNewGame();
  
  const keys = document.querySelectorAll('.keyboard-row button');
  keys.forEach(key => {
    key.addEventListener('click', handleKeyClick);
  });

  document.addEventListener('keydown', handleKeyPress);
});

async function startNewGame() {
  const response = await fetch("http://localhost:5000/new_session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  });
  const data = await response.json();
  currentSessionId = data.session_id;
  currentUserId = data.user_id;
  console.log("New session started with ID:", currentSessionId, "User ID:", currentUserId, "and solution word:", data.solution_word);
  initializeGameBoard();
  resetKeyboardColors();
}

function initializeGameBoard() {
  const cells = document.querySelectorAll('td');
  cells.forEach(cell => {
    cell.textContent = '';
    cell.className = '';
  });
  currentRow = 0;
  currentCol = 0;
}

function resetKeyboardColors() {
  const keys = document.querySelectorAll('.keyboard-row button');
  keys.forEach(key => {
    key.className = ''; // Reset classes for each key
  });
}

function handleKeyClick(event) {
  const key = event.target.textContent;
  console.log("Key clicked:", key);

  if (key === 'Enter') {
    submitGuess();
  } else if (key === 'Delete') {
    deleteLetter();
  } else {
    insertLetter(key);
  }
}

function handleKeyPress(event) {
  const key = event.key.toUpperCase();
  console.log("Key pressed:", key);

  if (key === 'ENTER') {
    submitGuess();
  } else if (key === 'BACKSPACE' || key === 'DELETE') {
    deleteLetter();
  } else if (key.match(/^[A-Z]$/) && key.length === 1) {
    insertLetter(key);
  }
}

function insertLetter(letter) {
  if (currentCol < 5) {
    const rows = document.querySelectorAll('tr');
    const cell = rows[currentRow].children[currentCol];
    cell.textContent = letter;
    currentCol++;
  }
}

function deleteLetter() {
  if (currentCol > 0) {
    currentCol--;
    const rows = document.querySelectorAll('tr');
    const cell = rows[currentRow].children[currentCol];
    cell.textContent = '';
  }
}

async function submitGuess() {
  console.log("submitGuess function called");

  if (currentCol !== 5) {
    alert("Please enter a 5-letter word.");
    return;
  }

  const rows = document.querySelectorAll('tr');
  let guessedWord = '';
  for (let i = 0; i < 5; i++) {
    guessedWord += rows[currentRow].children[i].textContent;
  }

  guessedWord = guessedWord.toLowerCase(); // Ensure the guessed word is in lowercase
  console.log("Guessed word before API call:", guessedWord);

  const response = await fetch("http://localhost:5000/guess_word", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      session_id: currentSessionId,
      user_id: currentUserId,
      guessed_word: guessedWord
    })
  });

  const data = await response.json();
  console.log("Guess response:", data);
  console.log("Guessed word after API call:", guessedWord);

  if (!data.solution_word) {
    console.error("Solution word is null or undefined in the response");
    return;
  }

  updateGameBoard(guessedWord, data.result, data.solution_word);

  if (data.result === 'correct' || currentRow === 5) {
    setTimeout(() => {
      if (data.result === 'correct') {
        if (currentRow === 5) { // Check if it's the 6th attempt
          alert("Phew! You Win!");
        } else {
          alert("You Win!");
        }
      } else {
        alert("Game Over! The correct word was " + data.solution_word);
      }
      startNewGame();
    }, 500);
  } else {
    currentRow++;
    currentCol = 0;
    console.log("Moving to next row:", currentRow);
  }
}

function updateGameBoard(guessedWord, result, solutionWord) {
  if (!solutionWord) {
    console.error("Solution word is null or undefined in updateGameBoard");
    return;
  }

  const rows = document.querySelectorAll('tr');
  const currentRowCells = rows[currentRow].children;

  const solutionWordArray = solutionWord.split('');
  const guessedWordArray = guessedWord.split('');

  // Arrays to keep track of matched letters
  const correctMatches = new Array(5).fill(false);
  const solutionWordUsed = new Array(5).fill(false);

  // First pass: Check for correct letters in the correct position (green)
  for (let i = 0; i < 5; i++) {
    if (guessedWordArray[i] === solutionWordArray[i]) {
      correctMatches[i] = true;
      solutionWordUsed[i] = true;
      currentRowCells[i].classList.add('correct');
      updateKeyboardColor(guessedWordArray[i], 'correct');
    }
  }

  // Second pass: Check for correct letters in the wrong position (yellow)
  for (let i = 0; i < 5; i++) {
    if (!correctMatches[i]) {
      for (let j = 0; j < 5; j++) {
        if (!solutionWordUsed[j] && guessedWordArray[i] === solutionWordArray[j]) {
          solutionWordUsed[j] = true;
          currentRowCells[i].classList.add('incorrect');
          updateKeyboardColor(guessedWordArray[i], 'incorrect');
          break;
        }
      }
    }
  }

  // Third pass: Mark remaining letters as invalid (grey)
  for (let i = 0; i < 5; i++) {
    if (!correctMatches[i] && !currentRowCells[i].classList.contains('incorrect')) {
      currentRowCells[i].classList.add('invalid');
      updateKeyboardColor(guessedWordArray[i], 'invalid');
    }
  }

  console.log(`Updated game board for row ${currentRow} with guessed word: ${guessedWord} and result: ${result}`);
}

function updateKeyboardColor(letter, colorClass) {
  const keys = document.querySelectorAll('.keyboard-row button');
  keys.forEach(key => {
    if (key.textContent === letter.toUpperCase()) {
      key.className = ''; // Remove existing classes
      key.classList.add(colorClass);
    }
  });
}
