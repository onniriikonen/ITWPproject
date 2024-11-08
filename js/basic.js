const menu = document.querySelector(".menu");
const locationInput = document.getElementById("location-input");
const weatherNow = document.querySelector(".weather-now")
const weatherNow2 = document.querySelector(".weather-now2")
const weatherNow3 = document.querySelector(".weather-now3")
const weatherHourly = document.querySelector(".weather-hourly")
const weatherHourly2 = document.querySelector('.weather-hourly2');
const weatherWeek = document.querySelector(".weather-week");
const weatherWeek2 = document.querySelector(".weather-week2");
const unitSelect = document.getElementById("unit-select");
const weatherSection = document.getElementById("current-weather");
const hourlySection = document.getElementById("hourly-forecast");
const weekSection = document.getElementById("weekly-forecast");
const locationButton = document.getElementById("location-button")
const apiKey = "9d5099095d74571ab7d3174acd4ca707";
const apiKey2 = "a98261316b1b45dcbb062b7b42f7a3f4";
const apiKey3 = "010031plTbIxNDbyzwWJbZeCu2ywB7Zr";


menu.addEventListener("submit", async event => {
    event.preventDefault();
    const location = locationInput.value;
    const unit = unitSelect.value;

    const tz = await getTimezone(location);

    if(location){
        clearError();
        const weatherData = await getWeatherData(location);

        const weatherData2 = await getWeatherData2(location);
        const weatherData3 = await getWeatherData3(location);
        const forecastData = await getForecastData(location);
        const forecastData2 = await getForecastData2(location);
        const weekForecastData = await getWeekForecast(location);
        const weekForecastData2 = await getWeekForecast2(location);
        
        display(weatherData, weatherData2, weatherData3, forecastData, forecastData2, weekForecastData, weekForecastData2, unit, tz)
    } else {
        displayError("Please enter a location");
    }
});

locationButton.addEventListener("click", async () => {
    const unit = unitSelect.value;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async position => {
            clearError();
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const tz = await getTimezoneHere(lat, lon);

            const weatherData = await getWeatherDataHere(lat, lon);
            const weatherData2 = await getWeatherData2Here(lat, lon);
            const weatherData3 = await getWeatherData3Here(lat, lon);
            const forecastData = await getForecastDataHere(lat, lon);
            const forecastData2 = await getForecastData2Here(lat, lon);
            const weekForecastData = await getWeekForecastHere(lat, lon);
            const weekForecastData2 = await getWeekForecast2Here(lat, lon);
            
            display(weatherData, weatherData2, weatherData3, forecastData, forecastData2, weekForecastData, weekForecastData2, unit, tz);
        }, () => {
            displayError("Allow location")
        });
    } else {
        displayError("Location not working");
    }
    
});

function display(weatherData, weatherData2, weatherData3, forecastData, forecastData2, weekForecastData, weekForecastData2, unit, tz) {
    displayWeather(weatherData, unit, tz);
    displayWeather2(weatherData2, unit);
    displayWeather3(weatherData3, unit);
    displayForecast(forecastData, unit);
    displayForecast2(forecastData2, unit, tz);
    displayWeekForecast(weekForecastData, unit);
    displayWeekForecast2(weekForecastData2, unit);
}

async function getTimezone(location) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;

    const response = await fetch(apiUrl);
    const data = await response.json();
    const tz = data.timezone - 3 * 3600;
    return tz;
}

async function getTimezoneHere(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    const tz = data.timezone - 3 * 3600;
    return tz;
}


async function getWeatherData(location) {

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;

    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data.message == "city not found") {
        displayError("City not found");
        return null;
    } else {
    return data;
    }
}

async function getWeatherData2(location) {
    const apiUrl = `https://api.weatherbit.io/v2.0/current?city=${location}&key=${apiKey2}`;

    const response = await fetch(apiUrl);
    const data = await response.json();
    weather = data.data;
    return weather
}


async function getWeatherData3(location) {
    const apiUrl = `https://api.tomorrow.io/v4/weather/realtime?location=${location}&apikey=${apiKey3}`;

    const response = await fetch(apiUrl);
    const data = await response.json();
    return data
}


async function getForecastData(location) {
    const apiUrl = `https://api.weatherbit.io/v2.0/forecast/hourly?city=${location}&key=${apiKey2}&hours=24`;

    const response = await fetch(apiUrl);
    const data = await response.json();
    const forecast = data.data;
    return forecast;

}

async function getForecastData2(location) {
    const apiUrl = `https://api.tomorrow.io/v4/weather/forecast?location=${location}&timesteps=1h&units=metric&apikey=${apiKey3}`;

    const response = await fetch(apiUrl);
    const data = await response.json();
    const forecast = data.timelines.hourly.slice(1, 25);

    return forecast;
}

async function getWeekForecast(location) {
    const apiUrl = `https://api.weatherbit.io/v2.0/forecast/daily?city=${location}&key=${apiKey2}`;

    const response = await fetch(apiUrl);
    const data = await response.json();
    const forecast = data.data.slice(0, 6);

    return forecast;
}

async function getWeekForecast2(location) {
    const apiUrl = `https://api.tomorrow.io/v4/weather/forecast?location=${location}&timesteps=1d&units=metric&apikey=${apiKey3}`;

    const response = await fetch(apiUrl);
    const data = await response.json();
    const forecast = data.timelines.daily;

    return forecast;

}

async function getWeatherDataHere(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}

async function getWeatherData2Here(lat, lon) {
    const apiUrl = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${apiKey2}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.data;
}

async function getWeatherData3Here(lat, lon) {
    const apiUrl = `https://api.tomorrow.io/v4/weather/realtime?location=${lat},${lon}&apikey=${apiKey3}`;
    const response = await fetch(apiUrl);
    return await response.json();
}

async function getForecastDataHere(lat, lon) {
    const apiUrl = `https://api.weatherbit.io/v2.0/forecast/hourly?lat=${lat}&lon=${lon}&key=${apiKey2}&hours=24`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.data;
}

async function getForecastData2Here(lat, lon) {
    const apiUrl = `https://api.tomorrow.io/v4/weather/forecast?location=${lat},${lon}&timesteps=1h&units=metric&apikey=${apiKey3}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.timelines.hourly.slice(1, 25);
}

async function getWeekForecastHere(lat, lon) {
    const apiUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${apiKey2}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.data.slice(0, 6);
}

async function getWeekForecast2Here(lat, lon) {
    const apiUrl = `https://api.tomorrow.io/v4/weather/forecast?location=${lat},${lon}&timesteps=1d&units=metric&apikey=${apiKey3}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.timelines.daily;
}

function displayWeather(data, unit, tz){

    const {name: location,
           main: {temp},
           dt: dt, 
           weather: [{description, id}]} = data;

    weatherNow.textContent = "";

    const locationDisplay = document.createElement("div");

    const localTime = new Date((dt * 1000) + tz * 1000);
    const now = localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    locationDisplay.textContent = 'Current weather in ' + location + ' at ' + now + ' (local)';
    weatherNow.appendChild(locationDisplay);

    const header = document.createElement("h2");
    header.textContent = "OpenWeather"
    weatherNow.appendChild(header);

    const weatherBlock = document.createElement("div");
    weatherBlock.classList.add("weatherBlock");

    const convertedTemp = getUnit(unit, temp);

    
    const weatherIcon = document.createElement("p");
    const tempDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");

    
    weatherIcon.textContent = getWeatherIcon(id);
    tempDisplay.textContent = convertedTemp;
    descDisplay.textContent = description;
    
    locationDisplay.classList.add("locationDisplay");
    tempDisplay.classList.add("tempDisplayNow");
    descDisplay.classList.add("descDisplayNow");
    weatherIcon.classList.add("weatherIconNow");

    weatherBlock.appendChild(tempDisplay);
    weatherBlock.appendChild(weatherIcon);
    weatherBlock.appendChild(descDisplay);
    weatherNow.appendChild(weatherBlock);
    

    setColor(temp, id);
}

function displayWeather2(data, unit) {
    const weatherData = data[0]

    const temp = weatherData.temp;
    const desc = weatherData.weather.description;
    const id = weatherData.weather.code;


    weatherNow2.textContent = "";

    const header = document.createElement("h2");
    header.textContent = "Weatherbit"
    weatherNow2.appendChild(header);

    const weatherBlock2 = document.createElement("div");
    weatherBlock2.classList.add("weatherBlock2");

    const convertedTemp = getUnit(unit, temp);

    const weatherIcon = document.createElement("p");
    const tempDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");

    weatherIcon.textContent = getWeatherIcon(id);
    tempDisplay.textContent = convertedTemp;
    descDisplay.textContent = desc;

    tempDisplay.classList.add("tempDisplayNow");
    descDisplay.classList.add("descDisplayNow");
    weatherIcon.classList.add("weatherIconNow");

    weatherBlock2.appendChild(tempDisplay);
    weatherBlock2.appendChild(weatherIcon);
    weatherBlock2.appendChild(descDisplay);
    weatherNow2.appendChild(weatherBlock2);

}

function displayWeather3(data, unit) {
    const weatherData = data.data.values
    const temp = weatherData.temperature;
    const id = weatherData.weatherCode;

    weatherNow3.textContent = "";

    const header = document.createElement("h2");
    header.textContent = "Tomorrow"
    weatherNow3.appendChild(header);

    const weatherBlock3 = document.createElement("div");
    weatherBlock3.classList.add("weatherBlock3");

    const convertedTemp = getUnit(unit, temp);

    const weatherIcon = document.createElement("p");
    const tempDisplay = document.createElement("p");

    weatherIcon.textContent = getWeatherIcon(id);
    tempDisplay.textContent = convertedTemp;

    tempDisplay.classList.add("tempDisplayNow");
    weatherIcon.classList.add("weatherIconNow");

    weatherBlock3.appendChild(tempDisplay);
    weatherBlock3.appendChild(weatherIcon);
    weatherNow3.appendChild(weatherBlock3);

}

function displayForecast(data, unit) {

    weatherHourly.textContent = "";

    const text = document.createElement("div");
    text.textContent = "Next 24 hours";
    text.classList.add("text");
    weatherHourly.appendChild(text);
    
    const header = document.createElement("h2");
    header.textContent = "Weatherbit"
    weatherHourly.appendChild(header);

    data.forEach(cast => {
        const time = new Date(cast.timestamp_local).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const temp = cast.temp;
        const id = cast.weather.code;


        const forecastBlock = document.createElement("div");
        forecastBlock.classList.add("forecastBlock");

        const convertedTemp = getUnit(unit, temp);

        const timeDisplay = document.createElement("h3");
        const tempDisplay = document.createElement("p");
        const weatherIcon = document.createElement("p");

        timeDisplay.textContent = time;
        tempDisplay.textContent = convertedTemp;
        weatherIcon.textContent = getWeatherIcon(id);

        timeDisplay.classList.add("timeDisplay");
        tempDisplay.classList.add("tempDisplayHour");
        weatherIcon.classList.add("weatherIconHour");

        forecastBlock.appendChild(timeDisplay);
        forecastBlock.appendChild(tempDisplay);
        forecastBlock.appendChild(weatherIcon);
        weatherHourly.appendChild(forecastBlock);
    });

}

function displayForecast2(data, unit, tz) {

    weatherHourly2.textContent = "";

    const header = document.createElement("h2");
    header.textContent = "Tomorrow"
    weatherHourly2.appendChild(header);

    data.forEach(cast => {
        const utcTime = new Date(cast.time);
        const temp = cast.values.temperature;
        const id = cast.values.weatherCode;

        const localTime = new Date(utcTime.getTime() + tz * 1000);

        const time = localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });


        const forecastBlock = document.createElement("div");
        forecastBlock.classList.add("forecastBlock");

        const convertedTemp = getUnit(unit, temp);

        const timeDisplay = document.createElement("h3");
        const tempDisplay = document.createElement("p");
        const weatherIcon = document.createElement("p");

        timeDisplay.textContent = time;
        tempDisplay.textContent = convertedTemp;
        weatherIcon.textContent = getWeatherIcon(id);

        timeDisplay.classList.add("timeDisplay");
        tempDisplay.classList.add("tempDisplayHour");
        weatherIcon.classList.add("weatherIconHour");

        forecastBlock.appendChild(timeDisplay);
        forecastBlock.appendChild(tempDisplay);
        forecastBlock.appendChild(weatherIcon);
        weatherHourly2.appendChild(forecastBlock);
    });
}

function displayWeekForecast(data, unit) {

    weatherWeek.textContent = "";

    const text = document.createElement("div");
    text.textContent = "Next 5 days";
    text.classList.add("text");
    weatherHourly.appendChild(text);

    const header = document.createElement("h2");
    header.textContent = "Weatherbit"
    weatherWeek.appendChild(header);

    data.forEach(day => {
        const date = new Date(day.valid_date).toLocaleDateString([], { month: 'numeric', day: 'numeric' });
        const maxTemp = day.max_temp;
        const id = day.weather.code;


        const weekForecastBlock = document.createElement("div");
        weekForecastBlock.classList.add("weekForecastBlock");

        const convertedTemp = getUnit(unit, maxTemp);

        const dateDisplay = document.createElement("h3");
        const maxTempDisplay = document.createElement("p");
        const weatherIcon = document.createElement("p");

        dateDisplay.textContent = date;
        maxTempDisplay.textContent = convertedTemp;
        weatherIcon.textContent = getWeatherIcon(id);

        dateDisplay.classList.add("dateDisplay");
        maxTempDisplay.classList.add("maxTempDisplay");
        weatherIcon.classList.add("weatherIconWeek");

        weekForecastBlock.appendChild(dateDisplay);
        weekForecastBlock.appendChild(maxTempDisplay);
        weekForecastBlock.appendChild(weatherIcon);
        weatherWeek.appendChild(weekForecastBlock);
    });

}

function displayWeekForecast2(data, unit) {

    weatherWeek2.textContent = "";

    const header = document.createElement("h2");
    header.textContent = "Tomorrow"
    weatherWeek2.appendChild(header);

    data.forEach(day => {
        const date = new Date(day.time).toLocaleDateString([], { month: 'numeric', day: 'numeric' });
        const maxTemp = day.values.temperatureMax;
        const id = day.values.weatherCodeMax;


        const weekForecastBlock = document.createElement("div");
        weekForecastBlock.classList.add("weekForecastBlock");

        const convertedTemp = getUnit(unit, maxTemp);

        const dateDisplay = document.createElement("h3");
        const maxTempDisplay = document.createElement("p");
        const weatherIcon = document.createElement("p");

        dateDisplay.textContent = date;
        maxTempDisplay.textContent = convertedTemp;
        weatherIcon.textContent = getWeatherIcon(id);

        dateDisplay.classList.add("dateDisplay");
        maxTempDisplay.classList.add("maxTempDisplay");
        weatherIcon.classList.add("weatherIconWeek");

        weekForecastBlock.appendChild(dateDisplay);
        weekForecastBlock.appendChild(maxTempDisplay);
        weekForecastBlock.appendChild(weatherIcon);
        weatherWeek2.appendChild(weekForecastBlock);
    });

}
    

function getWeatherIcon(weatherId) {
    switch(true){
        case (weatherId >= 200 && weatherId < 300):
            return "⛈";
        case (weatherId >= 300 && weatherId < 400):
            return "🌦️";
        case (weatherId >= 500 && weatherId < 600):
            return "🌧";
        case (weatherId >= 600 && weatherId < 700):
            return "🌨️";
        case (weatherId >= 700 && weatherId < 760):
            return "🌫️"
        case (weatherId == 800):
            return "☀️"
        case (weatherId > 800):
            return "☁️"
    }
}

function getUnit(unit, temp) {
    if (unit == 'fahrenheit') {
        temp = temp * (9 / 5) + 32;
        temp = Math.round(temp);
        return temp + '°F'
    } else if (unit == 'kelvin') {
        temp = temp + 273.15;
        temp = Math.round(temp);
        return temp + 'K'
    } else if (unit == 'celsius') {
        temp = Math.round(temp);
        return temp + '°C';
    }
}

function setColor(temp) {
    document.body.classList.remove("verycold", "cold", "mid", "chilly", "warm", "hot");
    if (temp <= -20) {
        document.body.classList.add("verycold");
    } else if (temp > -20 && temp <= -5) {
        document.body.classList.add("cold");
    } else if (temp > -5 && temp < 5) {
        document.body.classList.add("mid");
    } else if (temp >= 5 && temp < 17) {
        document.body.classList.add("chilly");
    } else if (temp >= 17 && temp < 30) {
        document.body.classList.add("warm");
    } else if (temp >= 30) {
        document.body.classList.add("hot");
    }
}

function displayError(message) {
    const errorMessage = document.getElementById("error");
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
}

function clearError() {
    const errorMessage = document.getElementById("error");
    errorMessage.style.display = "none";
}
