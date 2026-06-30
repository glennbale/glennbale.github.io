//Global variables
let randomNumber;
let attempts = 0;
let numberOfWins = 0;
let numberOfLoses = 0;

initializeGame();

function initializeGame() {
  randomNumber = Math.floor(Math.random() * 99) + 1;
  console.log("randomNumber:" + randomNumber);
  attempts = 0;
  document.getElementById("attemptsLeft").textContent = 7;

  //hiding the Reset button
  document.querySelector("#resetBtn").style.display = "none";

  //showing the Guess button
  document.querySelector("#guessBtn").style.display = "inline";

  let playerGuess = document.querySelector("#playerGuess");
  playerGuess.focus(); // adding focus to textbox
  playerGuess.value = ""; // clearing texbox

  let feedback = document.querySelector("#feedback");
  feedback.textContent = ""; // clearing feedback

  //clearing previous guesses
  document.querySelector("#guesses").textContent = "";
}

//Event Listeners
document.querySelector("#guessBtn").addEventListener("click", checkGuess);
document.querySelector("#resetBtn").addEventListener("click", initializeGame);

function checkGuess() {
  let feedback = document.querySelector("#feedback");
  feedback.textContent = "";
  let guess = document.querySelector("#playerGuess").value;
  console.log("Player guess: " + guess);
  if (guess < 1 || guess > 99) {
    let feedback = document.querySelector("#feedback");
    feedback.textContent = "Enter a number between 1 and 99";
    feedback.style.color = "red";
    return;
  }
  attempts++;
  document.getElementById("attemptsLeft").textContent = 7 - attempts;
  console.log("Attempts:" + attempts);
  feedback.style.color = "orange";
  if (guess == randomNumber) {
    feedback.textContent = "You guessed it! You Won!";
    numberOfWins++;
    document.getElementById("numberOfWins").textContent = numberOfWins;
    feedback.style.color = "darkgreen";
    gameOver();
  } else {
    document.querySelector("#guesses").textContent += guess + " ";
    if (attempts == 7) {
      feedback.textContent = "Sorry, you lost!";
      numberOfLoses++;
      document.getElementById("numberOfLoses").textContent = numberOfLoses;
      feedback.style.color = "red";
      gameOver();
    } else if (guess > randomNumber) {
      feedback.textContent = "Guess was high";
    } else {
      feedback.textContent = "Guess was low";
    }
  }
}

function gameOver() {
  let guessBtn = document.querySelector("#guessBtn");
  let resetBtn = document.querySelector("#resetBtn");
  guessBtn.style.display = "none";
  resetBtn.style.display = "inline";
}
