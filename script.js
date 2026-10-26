// ---------- 1. Sample data ----------
const weatherData = {
  lagos:  { name: "Lagos",  temperature: 31,  condition: "Sunny",         humidity: 78, windSpeed: 14 },
  london: { name: "London", temperature: 12,  condition: "Rainy",         humidity: 88, windSpeed: 22 },
  tokyo:  { name: "Tokyo",  temperature: 18,  condition: "Cloudy",        humidity: 65, windSpeed: 10 },
  abuja:  { name: "Abuja",  temperature: 29,  condition: "Partly Cloudy", humidity: 60, windSpeed: 12 },
  paris:  { name: "Paris",  temperature: 15,  condition: "Rainy",         humidity: 82, windSpeed: 18 },
  moscow: { name: "Moscow", temperature: -5,  condition: "Snowy",         humidity: 90, windSpeed: 25 },
  miami:  { name: "Miami",  temperature: 30,  condition: "Stormy",        humidity: 85, windSpeed: 40 }
};

const weatherIcons = {
  Sunny: "☀️",
  Rainy: "🌧️",
  Cloudy: "☁️",
  "Partly Cloudy": "⛅",
  Snowy: "❄️",
  Stormy: "⛈️"
};

// ---------- 2. Get the page elements ----------
const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const errorMessage = document.getElementById("error-message");
const weatherCard = document.getElementById("weather-card");
const weatherIcon = document.getElementById("weather-icon");
const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind");

// ---------- 3. Show the weather for a city ----------
function showWeather(city) {
  const key = city.trim().toLowerCase();

  // Validation: empty input
  if (key === "") {
    showError("Please enter a city name.");
    return;
  }

  // Validation: city not in our data
  const data = weatherData[key];
  if (!data) {
    showError(`We couldn't find "${city.trim()}". Try Lagos, London, Tokyo, Abuja, Paris, Moscow, or Miami.`);
    return;
  }

  // City found: hide the error and fill the card
  errorMessage.classList.add("hidden");
  weatherIcon.textContent = weatherIcons[data.condition] || "🌡️";
  cityName.textContent = data.name;
  temperature.textContent = `${data.temperature}°C`;
  condition.textContent = data.condition;
  humidity.textContent = `${data.humidity}%`;
  windSpeed.textContent = `${data.windSpeed} km/h`;
  weatherCard.classList.remove("hidden");
    saveRecentSearch(data.name);
  renderRecentSearches();
}

// ---------- 4. Show an error and hide the card ----------
function showError(message) {
  weatherCard.classList.add("hidden");
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
}

// ---------- 5. Handle the form submit ----------
form.addEventListener("submit", function (event) {
  event.preventDefault(); // stop the page from reloading
  showWeather(cityInput.value);
});
// ---------- 6. Recent searches (localStorage) ----------
const recentContainer = document.getElementById("recent-searches");
const MAX_RECENT = 5;

// Read the saved list safely
function getRecentSearches() {
  try {
    return JSON.parse(localStorage.getItem("recentSearches")) || [];
  } catch (error) {
    return []; // if the saved data is corrupt, start fresh
  }
}

// Save a city to the front of the list
function saveRecentSearch(name) {
  let recent = getRecentSearches();
  recent = recent.filter(item => item !== name); // remove duplicates
  recent.unshift(name);                          // add to the front
  recent = recent.slice(0, MAX_RECENT);          // keep only 5
  localStorage.setItem("recentSearches", JSON.stringify(recent));
}

// Draw the list as clickable buttons
function renderRecentSearches() {
  const recent = getRecentSearches();
  recentContainer.innerHTML = "";

  if (recent.length === 0) {
    recentContainer.innerHTML = `<p class="text-gray-400 text-sm">No searches yet.</p>`;
    return;
  }

  recent.forEach(name => {
    const button = document.createElement("button");
    button.textContent = name;
    button.className = "bg-sky-100 hover:bg-sky-200 text-sky-800 text-sm px-3 py-1 rounded-full";
    button.addEventListener("click", () => showWeather(name));
    recentContainer.appendChild(button);
  });
}
renderRecentSearches();
// ---------- 7. Show today's date ----------
const dateElement = document.getElementById("current-date");
dateElement.textContent = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric"
});