/* script.js */

document.getElementById('search-button').addEventListener('click', function() {
  var cityName = document.getElementById('city-input').value;
  
  // fetch coordinates of city
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=7f4b9b7e546a83457dc7067c9af87b36`)
      .then(response => response.json())
      .then(data => {
          var lat = data.coord.lat;
          var lon = data.coord.lon;
          
          // fetch weather data using coordinates
       
fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=7f4b9b7e546a83457dc7067c9af87b36`)
              .then(response => response.json())
              .then(data => {
                  // display the fetched data on the page
                  displayWeatherData(data);
                  
                  // store the search history
                  storeSearchHistory(cityName);
              });
      });
});

function displayWeatherData(data) {
  var currentWeather = document.getElementById('current-weather');
  var forecast = document.getElementById('forecast');

  var current = data.list[0];
  var city = data.city.name;
  var date = new Date(current.dt * 1000);
  var weather = current.weather[0].main;
  var icon = current.weather[0].icon;
  var temp = (current.main.temp - 273.15).toFixed(2); // convert from Kelvin to Celsius
  var humidity = current.main.humidity;
  var windSpeed = current.wind.speed;

  // display the current weather
currentWeather.innerHTML = `
<div class="card-body">
  <h2 class="card-title">${city} (${date.toDateString()})</h2>
  <img src="http://openweathermap.org/img/wn/${icon}.png" alt="${weather}" style="width:50px;height:50px;">
  <p class="card-text">Temperature: ${temp} °C</p>
  <p class="card-text">Humidity: ${humidity}%</p>
  <p class="card-text">Wind Speed: ${windSpeed} m/s</p>
</div>
`;

  // display the 5-day forecast
  forecast.innerHTML = '<h2>5-Day Forecast:</h2>';
  for (var i = 1; i < data.list.length; i += 8) { // only take one reading per day
      var forecastData = data.list[i];
      date = new Date(forecastData.dt * 1000);
      weather = forecastData.weather[0].main;
      icon = forecastData.weather[0].icon;
      temp = (forecastData.main.temp - 273.15).toFixed(2); // convert from Kelvin to Celsius
      humidity = forecastData.main.humidity;
      windSpeed = forecastData.wind.speed;

      forecast.innerHTML += `
          <div>
              <h3>${date.toDateString()}</h3>
              <img src="http://openweathermap.org/img/wn/${icon}.png" alt="${weather}">
              <p>Temperature: ${temp} °C</p>
              <p>Humidity: ${humidity}%</p>
              <p>Wind Speed: ${windSpeed} m/s</p>
          </div>
      `;
  }
}


function storeSearchHistory(cityName) {
  var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  if (!searchHistory.includes(cityName)) {
      searchHistory.push(cityName);
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
      
      var button = document.createElement('button');
      button.innerText = cityName;
      button.classList.add('btn', 'btn-secondary', 'mb-2'); // apply Bootstrap button classes
      button.addEventListener('click', function() {
          document.getElementById('city-input').value = cityName;
          document.getElementById('search-button').click();
      });
      
      document.getElementById('search-history').appendChild(button);
  }
}
window.addEventListener('load', function() {
  var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  for (var i = 0; i < searchHistory.length; i++) {
      var cityName = searchHistory[i];
      
      var button = document.createElement('button');
      button.innerText = cityName;
      button.classList.add('btn', 'btn-secondary', 'mb-2'); // apply Bootstrap button classes
      button.addEventListener('click', function() {
          document.getElementById('city-input').value = cityName;
          document.getElementById('search-button').click();
      });
      
      document.getElementById('search-history').appendChild(button);
  }
});
