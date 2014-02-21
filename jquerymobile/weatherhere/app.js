var BASE_URL = "http://api.openweathermap.org/data/2.5/weather?q=";

$(function() {
  var WeatherApp = {
    onReady: function () {
      this._initPanels();
      this._initEventHandlers();
      var city = localStorage.getItem("city");
      if (city) {
        this._searchWeatherCity(city);
      }
    },

    _initPanels: function () {
      $( "body>[data-role='panel']" ).panel();
      $( "body>[data-role='panel'] [data-role='listview']" ).listview();
    },

    _initEventHandlers: function () {
      $("#city-search").on("change", function () {
        var city = $("#city-search").val();
        console.log("CITY CHANGED", city);
        localStorage.setItem("city", city);
        this._searchWeatherCity(city);
        $("#city-search").val("").blur();
      }.bind(this));

      $("#weather-reload").on("click", function () {
        var city = localStorage.getItem("city");
        this._searchWeatherCity(city);
       }.bind(this));
    },

    _searchWeatherCity: function(city) {
      return $.ajax(BASE_URL + city, {
        dataType: "json",
        xhrFields: {
          systemXHR: true
        }
      })
        .done(function (data) {
          console.log("DONE", data);
          this._refreshWeatherData(data);
        }.bind(this))
        .fail(function(error) {
          console.log("FAIL", error);
        });
    },

    _refreshWeatherData: function (data) {
      var el;

      $("#home .weather-city").html(data.name);

      $(".weather-table tbody .weather-values")
        .find("img")
        .attr("src",
              "http://openweathermap.org/img/w/" +
              data.weather[0].icon + ".png")
        .find("span")
        .html(data.weather[0].description);

      $(".weather-table tbody .temperatures-values")
        .html((data.main.temp - 273.15).toFixed(2) + " &deg;C");
    }
  };

  window.WeatherApp = WeatherApp;

  WeatherApp.onReady();
});
