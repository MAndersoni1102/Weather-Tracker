// This will add the search button functionality such as it will get the element after its clicked
document.getElementById("searchBtn").addEventListener("click", function () {
    const city = document.getElementById("cityInput").value.trim();
    if (city) {
      fetchWeatherData(city);
      saveSearchHistory(city);
    }
  });
  
  function fetchWeatherData(city) {
    const apiKey = "32cc4d5a09b1957cdd1fb48b0d593060"; // API key
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${apiKey}&units=imperial`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
      city
    )}&appid=${apiKey}&units=imperial`;
  
    // This will fetch the current weather
    fetch(weatherUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Weather data fetch failed: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        updateCurrentWeather(data);
        saveSearchHistory(city); // This will save cities to the search history
      })
      .catch((error) => console.error("Fetching current weather failed:", error));
  
    // This will grab the 5 day forecast
    fetch(forecastUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Could not find forecast data': ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => updateForecast(data))
      .catch((error) => console.error("Fetching forecast failed:", error));
  }
  
  function updateCurrentWeather(data) {
    const weatherDetails = document.getElementById("weather-details");
    const date = new Date(data.dt * 1000).toLocaleDateString();
    const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
  
    weatherDetails.innerHTML = `<h3>${data.name} (${date})</h3>
                                  <img src="${iconUrl}" alt="${data.weather[0].description}">
                                  <p><strong>Temperature:</strong> ${data.main.temp}°F</p>
                                  <p><strong>Wind:</strong> ${data.wind.speed} MPH</p>
                                  <p><strong>Humidity:</strong> ${data.main.humidity}%</p>`;
  }
  
  function updateForecast(data) {
    const forecastDetails = document.getElementById("forecast-details");
    forecastDetails.innerHTML = ""; // Removes previous entries
  
    // This will process the forecast over the next 5 days

    for (let i = 0; i < data.list.length; i += 8) {
      const forecast = data.list[i];
      const date = new Date(forecast.dt * 1000).toLocaleDateString();
      const iconUrl = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
  
      const forecastElem = document.createElement("div");
      forecastElem.classList.add("forecast-day");
      forecastElem.innerHTML = `<p><strong>${date}</strong></p>
                                    <img src="${iconUrl}" alt="${forecast.weather[0].description}">
                                    <p>Temp: ${forecast.main.temp}°F</p>
                                    <p>Wind: ${forecast.wind.speed} MPH</p>
                                    <p>Humidity: ${forecast.main.humidity}%</p>`;
      forecastDetails.appendChild(forecastElem);
    }
  }
  
  function saveSearchHistory(city) {
    let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    if (!history.includes(city)) {
      history.unshift(city); // Moves to the front of the search history 
      history = history.slice(0, 8); // This is going to limit the history so its not overwhelmed
      localStorage.setItem("searchHistory", JSON.stringify(history));
    }
    updateSearchHistory();
  }
  
  function updateSearchHistory() {
    let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    const historyContainer = document.getElementById("search-history");
    historyContainer.innerHTML = ""; // This clears the history
  
    history.forEach((city) => {
      const cityElem = document.createElement("button");
      cityElem.textContent = city;
      cityElem.addEventListener("click", () => {
        document.getElementById("cityInput").value = city; 
        fetchWeatherData(city);
      });
      historyContainer.appendChild(cityElem);
    });
  }
  
  // Initializes the search history on page load
  document.addEventListener("DOMContentLoaded", updateSearchHistory);