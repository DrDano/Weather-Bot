var locationForm = document.querySelector("#location-form")
var locationInput = document.querySelector("#location-input")

var formSubmitHandler = function(event) {
    event.preventDefault();

    var location = locationInput.value.trim();
    // © OpenStreetMap contributors
    var cityURL = `https://forward-reverse-geocoding.p.rapidapi.com/v1/search?q=${location}&accept-language=en&polygon_threshold=0.0`
    if (location) {
      getLatLong(cityURL);
  
      location.textContent = "";
    } else {
      alert("Please enter a city name");
    }
  };

  var getLatLong = function(city) {
    fetch(city, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "forward-reverse-geocoding.p.rapidapi.com",
            "x-rapidapi-key": "98749236fcmsh9a0a6d6e384a89ep1d7bd0jsn68ffef7de409"
        }
    })
    .then(function(response) {
      // request was retrieved successfully
      if (response.ok) {
        response.json().then(function(data) {
          console.log(data);
          getWeatherData(data);
        });
      } else {
        alert('Error: City name did not return valid lat long coordinates');
      }
    })
    .catch(function(error) {
      alert("Unable to connect to Geocoding API");
    });
  }

  var getWeatherData = function(coordinates) {
      var lat = coordinates[0].lat;
      var long = coordinates[0].lon;
      var part = "minutely,hourly";
      var apiKey = "15bbf77d97c1faec8173196d7f04e456"
      openWeatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=${part}&units=imperial&appid=15bbf77d97c1faec8173196d7f04e456`

      fetch(openWeatherUrl).then(function(response) {
          if(response.ok) {
              response.json().then(function(data) {
                  console.log(data);

              });
          } else {
              alert('Error: Weather data unable to be fetched due to server problem')
          }
      })
      .catch(function(error) {
          console.log("Unable to connect with weather server")
      });
  }

  locationForm.addEventListener("submit", formSubmitHandler);