
  $(document).ready(function () {
    var apiKey = "07667a2d1b623f2802be27c8d67b3bd6";
    var cityHistory = [];
    var placedCities = JSON.parse(localStorage.getItem("cityName"));
  
    // updating array from LS
    if (placedCities !== null) {
      cityHistory = placedCities;
    }
  
    function renderCities() {
    $("#history").empty();
  
      // create city list
      for (var i = 0; i < cityHistory.length; i++) {
        var city = cityHistory[i];
   
        var li = $("<li>");
        li.text(city);
        li.addClass("list-group-item list-group-item-primary list-group-item-action");
        li.attr("data-name", city);
        $("#history").prepend(li);
        
      }
    }
  
    //working with search button
    $("#search-button").on("click", function (e) {
      e.preventDefault();
      var cityName = $("#search-value").val();
  
      if (cityHistory.indexOf(cityName) === -1) {
        cityHistory.push(cityName);
        localStorage.setItem("cityName", JSON.stringify(cityHistory));
        renderCities();
      }
  
      currentWeather(cityName);
      fiveForecast(cityName);
  
      // clear search box
      $("#search-value").val("");
    });
  
    
  
    //function to get current weather conditions
    function currentWeather(cityName) {
      var queryURL =
        "https://api.openweathermap.org/data/2.5/weather?q=" + cityName +"&appid=" + apiKey + "&units=imperial";
       $.ajax({
        url: queryURL,
        method: "GET",
      }).then(function (response) {

        //current weather vars
        
        var city = response.name;
        var currentDate = moment().format("M/DD/YYYY");
        var temp = response.main.temp;
        var humidity = response.main.humidity;
        var wind = response.wind.speed;
  
        //Create HTML elements for current weather
        var current = $("#current");
        var currentCard = $("<div>").addClass("card").attr("class", "m-3");
        var currentCardTitle = $("<h3>").addClass("card-title").text(city + " " + "(" + currentDate + ")");
        var currentWeatherIcon = $("<img>").attr("src", "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png");
        var currentCardData = $("<div>").addClass("card-text");
        var currentTemp = $("<p>").text("Temperature: " + temp + " °F");
        var currentHumidity = $("<p>").text("Humidity: " + humidity + "%");
        var currentWind = $("<p>").text("Wind Speed: " + wind + " MPH");
  
        //clear current weather when another city is searched
        current.empty();
  
        //UV ajax and function 
        var queryUV ="https://api.openweathermap.org/data/2.5/onecall?lat=" +response.coord.lat + "&lon=" + response.coord.lon + "&appid=" + apiKey + "&units=imperial";


        $.ajax({
          url: queryUV,
          method: "GET",
        }).then(function (data) {
          var uvNumber = data.current.uvi;
          var currentUV = $("<p>").text("UV Index: ");
          currentCardData.append(currentUV);
          var uvColor = $("<span>").addClass("btn btn-sm").text(uvNumber);
          // change colors in uv data
          if (uvNumber <= 2) {
            uvColor.addClass("btn btn-outline-primary");
          } else if (uvNumber >=2 && uvNumber < 6){
           uvColor.addClass("btn btn-outline-success");
          } else if (uvNumber >=6 && uvNumber < 7) {
            uvColor.addClass(" btn btn-outline-warning");
          } else {
            uvColor.addClass("btn btn-outline-danger");
          }
          $("#today .card-body").append(currentUV.append(uvColor));
        });
  
        //Append current weather card and contents to the page
        current.append(currentCard);
        currentCard.append(currentCardTitle,currentCardData);
        currentCardTitle.append(currentWeatherIcon);
        currentCardData.append(currentTemp, currentHumidity, currentWind);
      });
    }
  
    //function to get 5-day forecast
    function fiveForecast(cityName) {
      var queryURL =
        "https://api.openweathermap.org/data/2.5/forecast?q=" +cityName +"&appid=" +apiKey +"&units=imperial";
      $.ajax({
        url: queryURL,
        method: "GET",
      }).then(function (response) {
        $("#fiveDay").empty();
        var forecast = $("#forecast");
        forecast.empty();
        var forecastInfo = $("<h3>").text("5-Day Forecast").attr("class", "m-3");
        $("#fiveDay").append(forecastInfo);
  

        for (i = 6; i < response.list.length; i += 8) {
          //variables for data to display on 5-day forecast weather cards
          var forecastDate = moment(response.list[i].dt_txt).format("MM/DD/YYYY");
          var forecastWeatherIcon = response.list[i].weather.icon;
          var forecastTemp = response.list[i].main.temp;
          var forecastHumidity = response.list[i].main.humidity;
  
          //Create HTML elements for forecast weather
          var forecastCol = $("<div>").attr("class", "col-md-2");
          var forecastCard = $("<div>").addClass("card bg-primary");
          var forecastCardTitle = $("<h5>").addClass("card-title text-white ml-3 mt-2").text(forecastDate);
          var forecastCardData = $("<div>").addClass("card-text text-white ml-3").attr("id", "forecastData");
           
           
          var forecastWeatherIcon = $("<img>").attr("src","http://openweathermap.org/img/w/" + response.list[i].weather[0].icon +".png");
          var forecastTemp = $("<p>").text("Temp: " + forecastTemp + " °F");
          var forecastHumidity = $("<p>").text("Humidity: " + forecastHumidity + "%");
  
          //Append forecast weather values

          forecast.append(forecastCol);
          forecastCol.append(forecastCard);
          forecastCard.append(forecastCardTitle, forecastCardData);
          forecastCardData.append(forecastWeatherIcon,forecastTemp,forecastHumidity);
        }
      });
    }
  
    renderCities();
  
    // making cities from list clickable and show info
    $(document).on("click", "li", function () {
      var cityName = $(this).attr("data-name");
      currentWeather(cityName);
      fiveForecast(cityName);
    });

  });
  
