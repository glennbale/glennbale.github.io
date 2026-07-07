//event listeners
document.querySelector("#filterBtn").addEventListener("click", applyFilters);
document.querySelector("#resetBtn").addEventListener("click", resetFilters);

//global variables
let baseUrl = "https://rickandmortyapi.com/api/character";
let currentPage = 1;
let currentNameFilter = "";
let currentLocationFilter = "";
let filteredCharacters = [];
let filteredMode = false;
let charactersPerPage = 20;

loadCharacters(1);
loadLocations();

async function loadCharacters(page) {
  currentPage = page;

  let url = `${baseUrl}?page=${page}`;

  if (currentNameFilter !== "") {
    url += `&name=${currentNameFilter}`;
  }

  let response = await fetch(url);

  if (!response.ok) {
    document.querySelector("#results").innerHTML = "";
    document.querySelector("#pagination").innerHTML = "";
    document.querySelector("#errorMessage").textContent =
      "No characters found.";
    return;
  }

  let data = await response.json();

  document.querySelector("#errorMessage").textContent = "";
  displayCharacters(data.results);
  displayPagination(data.info);
}

function displayCharacters(characters) {
  let results = document.querySelector("#results");

  results.innerHTML = "";

  for (let character of characters) {
    results.innerHTML += `
      <div class="col-md-4">
        <div class="card h-100 shadow">
          <img
            src="${character.image}"
            class="card-img-top"
            alt="${character.name}">

          <div class="card-body">
            <h5 class="card-title">${character.name}</h5>

            <p class="card-text">
              <strong>Status:</strong> ${character.status}<br>
              <strong>Species:</strong> ${character.species}<br>
              <strong>Gender:</strong> ${character.gender}<br>
              <strong>Origin:</strong> ${character.origin.name}<br>
              <strong>Episodes:</strong> ${character.episode.length}
            </p>
          </div>
        </div>
      </div>
    `;
  }
}

async function loadLocations() {
  let page = 1;
  let morePages = true;
  let locationSelect = document.querySelector("#locationName");

  while (morePages) {
    let response = await fetch(
      `https://rickandmortyapi.com/api/location?page=${page}`,
    );

    let data = await response.json();

    for (let location of data.results) {
      locationSelect.innerHTML += `
        <option value="${location.id}">
          ${location.name}
        </option>
      `;
    }

    if (data.info.next) {
      page++;
    } else {
      morePages = false;
    }
  }
}

async function getCharactersByLocation(locationId) {
  let response = await fetch(
    `https://rickandmortyapi.com/api/location/${locationId}`,
  );

  if (!response.ok) {
    return [];
  }

  let location = await response.json();

  if (location.residents.length === 0) {
    return [];
  }

  let characterPromises = location.residents.map(function (characterUrl) {
    return fetch(characterUrl).then(function (response) {
      return response.json();
    });
  });

  let characters = await Promise.all(characterPromises);

  return characters;
}

function displayPagination(info) {
  let pagination = document.querySelector("#pagination");

  pagination.innerHTML = "";

  for (let i = 1; i <= info.pages; i++) {
    pagination.innerHTML += `
      <button class="btn ${i === currentPage ? "btn-primary" : "btn-outline-primary"} m-1 page-btn"
        data-page="${i}">
        ${i}
      </button>
    `;
  }

  let pageButtons = document.querySelectorAll(".page-btn");

  for (let button of pageButtons) {
    button.addEventListener("click", function () {
      let page = Number(this.getAttribute("data-page"));
      loadCharacters(page);
    });
  }
}

// filter
async function applyFilters() {
  let errorMessage = document.querySelector("#errorMessage");

  errorMessage.textContent = "";

  currentNameFilter = document.querySelector("#characterName").value.trim();
  currentLocationFilter = document.querySelector("#locationName").value;

  if (currentNameFilter === "" && currentLocationFilter === "") {
    errorMessage.textContent =
      "Please enter a character name or select a location.";
    return;
  }

  if (currentLocationFilter !== "") {
    let locationCharacters = await getCharactersByLocation(
      currentLocationFilter,
    );

    if (currentNameFilter !== "") {
      locationCharacters = locationCharacters.filter(function (character) {
        return character.name
          .toLowerCase()
          .includes(currentNameFilter.toLowerCase());
      });
    }

    if (locationCharacters.length === 0) {
      document.querySelector("#results").innerHTML = "";
      document.querySelector("#pagination").innerHTML = "";
      errorMessage.textContent = "No characters found.";
      return;
    }

    filteredCharacters = locationCharacters;
    filteredMode = true;
    displayFilteredPage(1);
    return;
  }

  filteredCharacters = [];
  loadCharacters(1);
}

function displayFilteredPage(page) {
  currentPage = page;

  let start = (page - 1) * charactersPerPage;
  let end = start + charactersPerPage;

  let pageCharacters = filteredCharacters.slice(start, end);

  displayCharacters(pageCharacters);
  displayFilteredPagination();
}

function displayFilteredPagination() {
  let pagination = document.querySelector("#pagination");
  let totalPages = Math.ceil(filteredCharacters.length / charactersPerPage);

  pagination.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `
      <button
        class="btn ${i === currentPage ? "btn-primary" : "btn-outline-primary"} m-1 filtered-page-btn"
        data-page="${i}">
        ${i}
      </button>
    `;
  }

  let pageButtons = document.querySelectorAll(".filtered-page-btn");

  for (let button of pageButtons) {
    button.addEventListener("click", function () {
      let page = Number(this.getAttribute("data-page"));
      displayFilteredPage(page);
    });
  }
}

function resetFilters() {
  // Reset form fields
  document.querySelector("#characterName").value = "";
  document.querySelector("#locationName").value = "";

  // Reset global variables
  currentNameFilter = "";
  currentLocationFilter = "";
  filteredCharacters = [];
  currentPage = 1;

  // Clear error message
  document.querySelector("#errorMessage").textContent = "";

  // Reload the default character list
  loadCharacters(1);
}
