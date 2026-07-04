displayQ4Choices();
document.querySelector("button").addEventListener("click", gradeQuiz);

let score = 0;
let attempts = localStorage.getItem("total_attempts");
if (attempts === null) {
  attempts = 0;
} else {
  attempts = Number(attempts);
}

function setMarkImage(index, imageName, altText) {
  let markContainer = document.querySelector(`#markImg${index}`);
  markContainer.textContent = "";

  let img = document.createElement("img");
  img.src = `img/${imageName}`;
  img.alt = altText;
  img.classList.add("mark-icon");
  markContainer.appendChild(img);
}

function rightAnswer(index) {
  let feedback = document.querySelector(`#q${index}Feedback`);
  feedback.textContent = "Correct!";
  feedback.className = "bg-success text-white";
  setMarkImage(index, "checkmark.png", "Checkmark");
  score += 10;
}

function wrongAnswer(index) {
  let feedback = document.querySelector(`#q${index}Feedback`);
  feedback.textContent = "Incorrect!";
  feedback.className = "bg-warning text-white";
  setMarkImage(index, "xmark.png", "X mark");
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function displayQ4Choices() {
  let q4ChoicesArray = ["Maine", "Rhode Island", "Maryland", "Delaware"];
  shuffleArray(q4ChoicesArray);

  let choicesContainer = document.querySelector("#q4Choices");
  choicesContainer.textContent = "";

  for (let choice of q4ChoicesArray) {
    let input = document.createElement("input");
    input.type = "radio";
    input.name = "q4";
    input.id = choice;
    input.value = choice;

    let label = document.createElement("label");
    label.htmlFor = choice;
    label.textContent = choice;

    choicesContainer.appendChild(input);
    choicesContainer.appendChild(label);
    choicesContainer.appendChild(document.createTextNode(" "));
  }
}

function isFormValid() {
  let isValid = true;
  // let q1Response = document.querySelector("#q1").value;
  // let q2Response = document.querySelector("#q2").value;
  let validationFdbk = document.querySelector("#validationFdbk");

  // if (q1Response === "") {
  //   isValid = false;
  //   validationFdbk.textContent = "Question 1 was not answered";
  // }

  //validate questions with id
  for (let i of [1, 2, 7, 8, 9]) {
    let response = document.querySelector(`#q${i}`).value;

    if (response === "") {
      validationFdbk.textContent = `Question ${i} was not answered`;
      return false;
    }
  }

  // validate question 3
  if (
    !document.querySelector("#Jackson").checked &&
    !document.querySelector("#Franklin").checked &&
    !document.querySelector("#Jefferson").checked &&
    !document.querySelector("#Roosevelt").checked
  ) {
    validationFdbk.textContent = "Question 3 was not answered";
    return false;
  }

  // validate question 4
  if (!document.querySelector("input[name='q4']:checked")) {
    validationFdbk.textContent = "Question 4 was not answered";
    return false;
  }

  // validate question 5
  if (!document.querySelector("input[name=q5]:checked")) {
    validationFdbk.textContent = "Question 5 was not answered";
    return false;
  }

  // validate question 6
  if (
    !document.querySelector("#Superior").checked &&
    !document.querySelector("#Michigan").checked &&
    !document.querySelector("#Tahoe").checked &&
    !document.querySelector("#Erie").checked
  ) {
    validationFdbk.textContent = "Question 6 was not answered";
    return false;
  }

  // validate question 10
  if (!document.querySelector("input[name='q10']:checked")) {
    validationFdbk.textContent = "Question 10 was not answered";
    return false;
  }

  return isValid;
}

function gradeQuiz() {
  document.querySelector("#validationFdbk").textContent = "";

  if (!isFormValid()) {
    return;
  }

  score = 0;
  let q1Response = document.querySelector("#q1").value.toLowerCase();
  let q2Response = document.querySelector("#q2").value;

  if (q1Response === "sacramento") {
    rightAnswer(1);
  } else {
    wrongAnswer(1);
  }
  if (q2Response === "mo") {
    rightAnswer(2);
  } else {
    wrongAnswer(2);
  }

  if (
    document.querySelector("#Jefferson").checked &&
    document.querySelector("#Roosevelt").checked &&
    !document.querySelector("#Jackson").checked &&
    !document.querySelector("#Franklin").checked
  ) {
    rightAnswer(3);
  } else {
    wrongAnswer(3);
  }

  let selectedQ4 = document.querySelector("input[name=q4]:checked");

  if (selectedQ4 !== null && selectedQ4.value === "Rhode Island") {
    rightAnswer(4);
  } else {
    wrongAnswer(4);
  }

  let selectedQ5 = document.querySelector("input[name=q5]:checked");
  if (selectedQ5 !== null && selectedQ5.value === "Pacific") {
    rightAnswer(5);
  } else {
    wrongAnswer(5);
  }

  if (
    document.querySelector("#Superior").checked &&
    document.querySelector("#Michigan").checked &&
    document.querySelector("#Erie").checked &&
    !document.querySelector("#Tahoe").checked
  ) {
    rightAnswer(6);
  } else {
    wrongAnswer(6);
  }

  let q7Response = document.querySelector("#q7").value;
  if (q7Response === "ak") {
    rightAnswer(7);
  } else {
    wrongAnswer(7);
  }

  let q8Response = document.querySelector("#q8").value;
  if (q8Response === "50") {
    rightAnswer(8);
  } else {
    wrongAnswer(8);
  }

  let q9Response = document.querySelector("#q9").value.toLowerCase();
  if (q9Response === "florida") {
    rightAnswer(9);
  } else {
    wrongAnswer(9);
  }

  let selectedQ10 = document.querySelector("input[name=q10]:checked");
  if (selectedQ10 !== null && selectedQ10.value === "West") {
    rightAnswer(10);
  } else {
    wrongAnswer(10);
  }
  let totalScore = document.querySelector("#totalScore");
  totalScore.textContent = `Total Score: ${score}/100`;
  if (score <= 80) {
    totalScore.className = "text-danger";
    totalScore.textContent += " You failed!";
  } else {
    totalScore.className = "text-success";
    totalScore.textContent += " Congratulations!!! You have passed";
  }
  //   document.querySelector("#totalScore").textContent = `Total Score: ${score}`;

  attempts++;
  document.querySelector("#totalAttempts").textContent =
    `Total Attempts: ${attempts}`;
  localStorage.setItem("total_attempts", attempts);
}
