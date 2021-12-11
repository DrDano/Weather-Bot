var locationForm = document.querySelector("#location-form");
var locationInput = document.querySelector("#location-input");
var date = new Date().toLocaleDateString("en-US", {
  day: "numeric",
  month: "numeric",
  year: "numeric",
});
var historyList = document.querySelector("#search-history-list");
var cityName;

var formSubmitHandler = function (event) {
  event.preventDefault();

  var newDiv = document.createElement("div");

  var location = locationInput.value.trim();
  cityName = location;
  // © OpenStreetMap contributors
  var cityURL = `https://forward-reverse-geocoding.p.rapidapi.com/v1/search?q=${location}&accept-language=en&polygon_threshold=0.0`;
  if (location) {
    localStorage.setItem(`${location}`, location);
    newDiv.textContent = locationInput.value;
    newDiv.className = "w-full h-12 bg-gray-300 text-center";
    historyList.appendChild(newDiv);
    getLatLong(cityURL);

    location.textContent = "";
  } else {
    alert("Please enter a city name");
  }
};

var getLatLong = function (city) {
  fetch(city, {
    method: "GET",
    headers: {
      "x-rapidapi-host": "forward-reverse-geocoding.p.rapidapi.com",
      "x-rapidapi-key": "98749236fcmsh9a0a6d6e384a89ep1d7bd0jsn68ffef7de409",
    },
  })
    .then(function (response) {
      // request was retrieved successfully
      if (response.ok) {
        response.json().then(function (data) {
          getWeatherData(data);
        });
      } else {
        alert("Error: City name did not return valid lat long coordinates");
      }
    })
    .catch(function (error) {
      alert("Invalid city name");
    });
};

var getWeatherData = function (coordinates) {
  var lat = coordinates[0].lat;
  var long = coordinates[0].lon;
  var part = "minutely,hourly";
  var apiKey = "15bbf77d97c1faec8173196d7f04e456";
  openWeatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=${part}&units=imperial&appid=${apiKey}`;

  fetch(openWeatherUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayWeather(data);
          displayForecast(data);
        });
      } else {
        alert("Error: Weather data unable to be fetched due to server problem");
      }
    })
    .catch(function (error) {
      console.log("Invalid coordinates transmitted from server");
    });
};

var displayWeather = function (weatherData) {
  var container = document.querySelector("#city-date-icon");
  var tempContainer = document.querySelector("#temp-div");
  var windContainer = document.querySelector("#wind-div");
  var humidityContainer = document.querySelector("#humidity-div");
  var uvIndexContainer = document.querySelector("#uv-index-div");
  var iconCode = weatherData.current.weather[0].icon;
  var iconAddress = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

  var cityDateIconString = `<h3 id="city-date-icon" class="grid grid-rows-1">${cityName} (${date})<img src="${iconAddress}" class="object-scale-down"></img></h3>`;

  container.innerHTML = cityDateIconString;
  tempContainer.textContent = "Temp: " + weatherData.current.temp + "F";
  windContainer.textContent =
    "Wind-speed: " + weatherData.current.wind_speed + "mph";
  humidityContainer.textContent =
    "Humidity: " + weatherData.current.humidity + "%";
  uvIndexContainer.textContent = "UV Index: " + weatherData.current.uvi;

  if (weatherData.current.uvi < 3) {
    uvIndexContainer.className = "bg-green-400 box-border h-12 max-w-20px";
  } else if (weatherData.current.uvi > 3 && weatherData.current.uvi < 6) {
    uvIndexContainer.className = "bg-orange-400 box-border h-12 max-w-20px";
  } else if (weatherData.current.uvi > 6 && weatherData.current.uvi < 8) {
    uvIndexContainer.className = "bg-red-400 box-border h-12 max-w-20px";
  } else {
    uvIndexContainer.className = "bg-red-700 box-border h-12 max-w-20px";
  }
};

var displayForecast = function (weatherData) {
  var containerChildren = document.querySelector("#forc-grid").children;
  var weatherDayArr = weatherData.daily;

  for (let i = 0; i < containerChildren.length; i++) {
    var dayWeather = weatherDayArr[i];
    var dayEl = containerChildren[i];
    var d = new Date(dayWeather.dt * 1000);
    var forcDate = d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
    var iconCode = dayWeather.weather[0].icon;
    var temp = dayWeather.temp.day;
    var wind = dayWeather.wind_speed;
    var humidity = dayWeather.humidity;
    var iconAddress = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

    var IconString = `<div id="forc-icon-${i}"><img src="${iconAddress}" class="object-scale-down"></img></div>`;

    var dataArr = [
      forcDate,
      iconAddress,
      humidity + "%",
      wind + "mph",
      temp + "F",
    ];
    var dataStrArr = ["Date: ", "icon", "Humidity: ", "Wind: ", "Temp: "];

    //   This first loop fills all 5 forecast elements with the date and icon
    var dayChildren = dayEl.children;
    dayChildren[0].textContent = forcDate;
    dayChildren[0].className = "font-light tracking-tight leading-relaxed text-gray-200 mx-1"
    dayChildren[1].innerHTML = IconString;

    function deleteChildNodes(parent) {
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }
    }

    deleteChildNodes(dayChildren[2]);

    //   This second loop fills the elements with weather data list items
    for (let i = 4; i > 1; i--) {
      var newLi = document.createElement("li");
      newLi.textContent = `${dataStrArr[i]}${dataArr[i]}`;
      newLi.className = "font-medium tracking-tight leading-relaxed text-gray-200 mx-3"
      dayChildren[2].appendChild(newLi);
    }
  }
};

var getHistory = function (city) {
  if (localStorage.key(0)) {
    for (let i = 0; i < 10; i++) {
      var newDiv = document.createElement("div");
      newDiv.className = "w-full h-12 bg-gray-300 text-center align-middle";
      newDiv.textContent = localStorage.getItem(localStorage.key(i));
      historyList.appendChild(newDiv);
    }
  }
};

var historyListClickHandler = function (event) {
  var city = event.target;
  var cityURL = `https://forward-reverse-geocoding.p.rapidapi.com/v1/search?q=${city.innerText}&accept-language=en&polygon_threshold=0.0`;
  cityName = event.target.innerText;
  getLatLong(cityURL);
};

getHistory();
locationForm.addEventListener("submit", formSubmitHandler);
historyList.addEventListener("click", historyListClickHandler);
