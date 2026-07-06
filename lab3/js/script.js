loadStates();
// document.addEventListener("DOMContentLoaded", loadStates);
document.querySelector("#state").addEventListener("change", updateCounties);
document.querySelector("#zip").addEventListener("change", displayCity);
document.querySelector("#username").addEventListener("change", checkUsername);
document.querySelector("#password").addEventListener("focus", suggestPassword);
document.querySelector("#signupForm").addEventListener("submit", validateForm);

async function validateForm(event) {
  event.preventDefault();
  let isValid = true;

  // username validation
  let username = document.querySelector("#username").value;
  let usernameError = document.querySelector("#usernameError");

  usernameError.textContent = "";

  if (username.length === 0) {
    usernameError.textContent = "Username required!";
    usernameError.style.color = "red";
    isValid = false;
  } else {
    let usernameAvailable = await checkUsername();

    if (usernameAvailable === false) {
      isValid = false;
    }
  }

  // password validation
  let password = document.querySelector("#password").value;
  let passwordAgain = document.querySelector("#passwordAgain").value;
  let passwordError = document.querySelector("#passwordError");

  if (password.length < 6) {
    passwordError.textContent = "Password must be at least 6 characters";
    passwordError.style.color = "red";
    isValid = false;
  } else if (password !== passwordAgain) {
    passwordError.textContent = "Passwords do not match";
    passwordError.style.color = "red";
    isValid = false;
  }

  if (isValid) {
    document.querySelector("#signupForm").submit();
  }
}

// functions related to user and password
async function checkUsername() {
  let username = document.querySelector("#username").value;
  let usernameError = document.querySelector("#usernameError");

  if (username.length === 0) {
    usernameError.textContent = "Username required";
    usernameError.style.color = "red";
    return false;
  }

  let url = `https://csumb.space/api/usernamesAPI.php?username=${username}`;
  let response = await fetch(url);
  let data = await response.json();

  if (data.available) {
    usernameError.textContent = "Username available!";
    usernameError.style.color = "green";
    return true;
  } else {
    usernameError.textContent = "Username taken";
    usernameError.style.color = "red";
    return false;
  }
}

function randomChar() {
  let chars = "0123456789!@#$%";
  let index = Math.floor(Math.random() * chars.length);
  return chars[index];
}

async function suggestPassword() {
  let username = document.querySelector("#username").value;
  let validUser = await checkUsername();
  let passwordSuggestion = document.querySelector("#passwordSuggestion");

  if (!validUser) {
    passwordSuggestion.textContent =
      "Valid username is required for password suggestion";
    passwordSuggestion.style.color = "yellow";
    return;
  }

  let suggested = "";

  for (let letter of username) {
    suggested += letter + randomChar();
  }

  passwordSuggestion.textContent = "Suggested password: " + suggested;
  passwordSuggestion.style.color = "blue";
}

// functions for grabbing data
async function loadStates() {
  let stateMenu = document.querySelector("#state");

  stateMenu.textContent = "";

  let defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select One";
  stateMenu.appendChild(defaultOption);

  try {
    let url = "https://csumb.space/api/allStatesAPI.php";
    let response = await fetch(url);
    let data = await response.json();

    for (let item of data) {
      let option = document.createElement("option");
      option.value = item.usps;
      option.textContent = item.state;
      stateMenu.appendChild(option);
    }
  } catch (error) {
    console.error(error);

    stateMenu.textContent = "";

    let errorOption = document.createElement("option");
    errorOption.value = "";
    errorOption.textContent = "Unable to load states";
    stateMenu.appendChild(errorOption);
  }
}

async function updateCounties() {
  let state = document.querySelector("#state").value;
  let countyMenu = document.querySelector("#county");

  countyMenu.textContent = "";

  let defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select One";
  countyMenu.appendChild(defaultOption);

  try {
    let url = `https://csumb.space/api/countyListAPI.php?state=${state}`;
    let response = await fetch(url);
    let data = await response.json();

    for (let county of data) {
      let option = document.createElement("option");
      option.textContent = county.county;
      option.value = county.county;
      countyMenu.appendChild(option);
    }
  } catch (error) {
    console.error(error);

    countyMenu.textContent = "";

    let errorOption = document.createElement("option");
    errorOption.value = "";
    errorOption.textContent = "Unable to load counties";
    countyMenu.appendChild(errorOption);
  }
}

async function displayCity() {
  try {
    let zipCode = document.querySelector("#zip").value;
    let city = document.querySelector("#city");
    let latitude = document.querySelector("#latitude");
    let longitude = document.querySelector("#longitude");
    let zipError = document.querySelector("#zipError");

    city.textContent = "";
    latitude.textContent = "";
    longitude.textContent = "";
    zipError.textContent = "";

    let url = `https://csumb.space/api/cityInfoAPI.php?zip=${zipCode}`;
    let response = await fetch(url);
    let data = await response.json();

    // the API returns false when the zip code is not found, so we can check for that case before trying to access the city property

    if (data === false) {
      zipError.textContent = "Zip code not found";
      zipError.style.color = "red";
      return;
    }

    city.textContent = data.city;
    latitude.textContent = data.latitude;
    longitude.textContent = data.longitude;
  } catch (error) {
    document.querySelector("#city").textContent = "Unable to retrieve city";
    console.error(error);
  }
}
