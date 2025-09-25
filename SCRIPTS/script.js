import { LocationData } from "./MODELS/LocationData.js";
import { WeatherCondition } from "./MODELS/WeatherConditionData.js";
import { CurrentWeather } from "./MODELS/CurrentWeatherData.js";
import { CityWeatherData } from "./MODELS/CityWeatherData.js";
import { ForecastData } from "./MODELS/ForecastData.js";

const alertsDataButton = document.getElementById("alertsDataButton");
const forecastButton = document.getElementById("forecastDataButton");
const todayButton = document.getElementById("todayDataButton");
const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchBtn");
const currentDataContainer = document.getElementById("currentData");
const forecastDataContainer = document.getElementById("forecastData");
const celsiusRadio = document.getElementById("celsiusRadio");
const fahrenheitRadio = document.getElementById("fahrenheitRadio");
const pressureMbRadio = document.getElementById("pressureMbRadio");
const pressureInRadio = document.getElementById("pressureInRadio");
const kmhRadio = document.getElementById("kmhRadio");
const mphRadio = document.getElementById("mphRadio");
const precipitationMmRadio = document.getElementById("precipitationMmRadio");
const precipitationInRadio = document.getElementById("precipitationInRadio");
const visibilityKmRadio = document.getElementById("visibilityKmRadio");
const visibilityMilesRadio = document.getElementById("visibilityMilesRadio");

const apiURL = "http://api.weatherapi.com/v1/";

const apiKeyFilePath = "../ASSETS/apiKEY.txt"; //Change this to your path

var apiKey = "";
var currentCityData = null;
var forecastCityData = null;
var cityAlerts = null;
var temperatureUnit = "C"; //C or F
var pressureUnit = "mb"; //mb or in
var windSpeedUnit = "km/h"; //km/h or mph
var precipitationUnit = "mm"; //mm or in
var visibilityUnit = "km"; //km or miles

addEventListener("DOMContentLoaded", function() {
    alertsDataButton.disabled = true;
    forecastButton.disabled = true;
    todayButton.disabled = true;

    if(apiKey === "") { //API key loading from file
        fetch(apiKeyFilePath)
        .then(response => response.text())
        .then(key => {
            apiKey = key.trim();
        })
        .catch(error => {
            console.error("Nem sikerült betölteni az API kulcsot:", error);
        });
    }
});

searchButton.addEventListener("click", searchCity);
cityInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        searchCity();
    }
});
todayButton.addEventListener("click", showCurrentWeather);
forecastButton.addEventListener("click", showForecast);
celsiusRadio.addEventListener("change", () => setTemperatureUnit("C"));
fahrenheitRadio.addEventListener("change", () => setTemperatureUnit("F"));
pressureMbRadio.addEventListener("change", () => setPressureUnit("mb"));
pressureInRadio.addEventListener("change", () => setPressureUnit("in"));
kmhRadio.addEventListener("change", () => setWindSpeedUnit("km/h"));
mphRadio.addEventListener("change", () => setWindSpeedUnit("mph"));
precipitationMmRadio.addEventListener("change", () => setPrecipitationUnit("mm"));
precipitationInRadio.addEventListener("change", () => setPrecipitationUnit("in"));
visibilityKmRadio.addEventListener("change", () => setVisibilityUnit("km"));
visibilityMilesRadio.addEventListener("change", () => setVisibilityUnit("miles"));

function searchCity() {
    let city = cityInput.value;
    if(city === "") {
        alert("Kérem adjon meg egy várost!");
        return;
    }
    else {
        getWeatherData(city);
        getCityAlerts(city);
    }
}

function setTemperatureUnit(unit) {
    if(unit === "C" || unit === "F") {
        temperatureUnit = unit;
        if(currentCityData !== null && forecastCityData !== null) {
            if(currentDataContainer.hidden === false)
                showCurrentWeather();
            if(forecastDataContainer.hidden === false)
                showForecast();
        }
    }
}
function setPressureUnit(unit) {
    if(unit === "mb" || unit === "in") {
        pressureUnit = unit;
        if(currentCityData !== null) {
            showCurrentWeather();
        }
    }
}

function setWindSpeedUnit(unit) {
    if(unit === "km/h" || unit === "mph") {
        windSpeedUnit = unit;
        if(currentCityData !== null && forecastCityData !== null) {
            if(currentDataContainer.hidden === false)
                showCurrentWeather();
            if(forecastDataContainer.hidden === false)
                showForecast();
        }
    }
}

function setPrecipitationUnit(unit) {
    if(unit === "mm" || unit === "in") {
        precipitationUnit = unit;
        if(currentCityData !== null && forecastCityData !== null) {
            if(currentDataContainer.hidden === false)
                showCurrentWeather();
            if(forecastDataContainer.hidden === false)
                showForecast();
        }
    }
}

function setVisibilityUnit(unit) {
    if(unit === "km" || unit === "miles") {
        visibilityUnit = unit;
        if(currentCityData !== null) {
            showCurrentWeather();
        }
    }
}

function getWeatherData(city){
    fetch(apiURL + "forecast.json?key=" + apiKey + "&q=" + city + "&days=3&lang=hu")
        .then(response => {
            if(response.status === 400) {
                todayButton.disabled = true;
                alert("Hibás városnév!");
                throw new Error("Hibás városnév");
            }
            return response.json();    
        })
        .then(data => {
            currentCityData = new CityWeatherData(
                new LocationData(
                    data.location.country,
                    data.location.localtime,
                    data.location.name,
                    data.location.region
                ),
                new CurrentWeather(
                    new WeatherCondition(
                        data.current.condition.text,
                        data.current.condition.icon),
                    data.current.feelslike_c,
                    data.current.feelslike_f,
                    data.current.humidity,
                    data.current.last_updated,
                    data.current.precip_in,
                    data.current.precip_mm,
                    data.current.pressure_in,
                    data.current.pressure_mb,
                    data.current.temp_c,
                    data.current.temp_f,
                    data.current.uv,
                    data.current.vis_km,
                    data.current.vis_miles,
                    data.current.wind_degree,
                    data.current.wind_dir,
                    data.current.wind_kph,
                    data.current.wind_mph
                )
            );
            forecastCityData = new ForecastData(data.forecast);
        }).then(() => {
            showCurrentWeather();
            todayButton.disabled = false;
            forecastButton.disabled = false;
        })
        .catch(error => {
            console.error("Hiba a város adatainak lekérésekor:", error);
        });
}

function getCityAlerts(city) {
    //TODO: implement alerts fetching
    if(cityAlerts !== null) {
        alertsDataButton.disabled = false;
    }
}

function showCurrentWeather() {
    if(currentCityData === null) {
        currentDataContainer.hidden = true;
        todayButton.disabled = true;
        return;
    }
    else {
        currentDataContainer.hidden = false;
        forecastDataContainer.hidden = true;
        currentDataContainer.innerHTML = "";
        currentDataContainer.innerHTML += `
            <div class="card shadow-sm mt-4" style="max-width: 500px; margin: auto;">
            <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                <img src="https:${currentCityData.current.condition.icon}" alt="${currentCityData.current.condition.text} icon" style="width:64px; height:64px;" class="me-3">
                <div>
                    <h2 class="card-title mb-1">${currentCityData.location.name}, ${currentCityData.location.country}</h2>
                    <h6 class="card-subtitle text-muted mb-0">${currentCityData.location.region}</h6>
                    <small class="text-secondary">Helyi idő: ${currentCityData.location.localtime}</small>
                </div>
                </div>
                <ul class="list-group list-group-flush mb-3">` + 
                (cityAlerts !== null ? `<li class="list-group-item"><strong>Figyelmeztetések vannak érvényben! További információért kattintson a Figyelmeztetések gombra!</strong>`:``) +
                `<li class="list-group-item"><strong>Hőmérséklet:</strong> ` + 
                (temperatureUnit === "C" ? `${currentCityData.current.temp_c} °C` : `${currentCityData.current.temp_f} °F`) + `</li>
                <li class="list-group-item"><strong>Érzékelt hőmérséklet:</strong> ` +
                (temperatureUnit ==="C" ? `${currentCityData.current.feelslike_c} °C` : `${currentCityData.current.feelslike_f} °F`) + `</li>
                <li class="list-group-item"><strong>Leírás:</strong> ${currentCityData.current.condition.text}</li>
                <li class="list-group-item"><strong>Páratartalom:</strong> ${currentCityData.current.humidity} %</li>
                <li class="list-group-item"><strong>Légnyomás:</strong> ` + 
                (pressureUnit === "mb" ? `${currentCityData.current.pressure_mb} hPa` : `${currentCityData.current.pressure_in} inHg`) + `</li>
                <li class="list-group-item"><strong>Szél:</strong> ` + 
                (windSpeedUnit ==="km/h"? `${currentCityData.current.wind_kph} km/h` : `${currentCityData.current.wind_mph} mph`) + drawWindDirectionArrow(currentCityData.current.wind_degree) + `</li>
                <li class="list-group-item"><strong>Csapadék:</strong> ` +
                (precipitationUnit === "mm" ? `${currentCityData.current.precip_mm} mm` : `${currentCityData.current.precip_in} inch`) + `</li>
                <li class="list-group-item"><strong>UV index:</strong> ${currentCityData.current.uv}</li>
                <li class="list-group-item"><strong>Látótávolság:</strong> ` +
                (visibilityUnit === "km" ? `${currentCityData.current.vis_km} km` : `${currentCityData.current.vis_miles} mérföld`) + `</li>
                </ul>
                <div class="text-end">
                <small class="text-muted">Utolsó frissítés(helyi idő szerint): ${currentCityData.current.last_updated}</small>
                </div>
            </div>
            </div>
        `;
    }
}

function showForecast() {
    if (!forecastCityData) {
        forecastButton.disabled = true;
        forecastDataContainer.hidden = true;
        return;
    }
    currentDataContainer.hidden = true;
    historicalDataContainer.hidden = true;
    forecastDataContainer.hidden = false;

    //offcanvas
    let html = `
    <div class="offcanvas offcanvas-end" tabindex="-1" id="forecastHoursOffcanvas" aria-labelledby="forecastHoursOffcanvasLabel">
        <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="forecastHoursOffcanvasLabel">Óránkénti előrejelzés</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Bezárás"></button>
        </div>
        <div class="offcanvas-body" id="forecastHoursOffcanvasBody">
        </div>
    </div>
    <style>
        #forecastHoursOffcanvas.offcanvas {
            width: 500px !important;
            max-width: 90vw;
        }
    </style>
    `;

    //carousel
    html += `
    <div id="forecastCarousel" class="carousel slide mt-4" data-bs-ride="carousel">
        <div class="carousel-inner">
            ${forecastCityData.forecastday.map((dayObj, idx) => {
                const day = dayObj.day;
                return `
                <div class="carousel-item${idx === 0 ? " active" : ""}">
                    <div class="card shadow-sm mx-auto" style="max-width: 500px;">
                        <div class="card-body">
                            <div class="d-flex align-items-center mb-2">
                                <img src="https:${day.condition.icon}" alt="${day.condition.text}" style="width:48px; height:48px;" class="me-2">
                                <div>
                                    <h5 class="card-title mb-0">${dayObj.date}</h5>
                                    <small class="text-muted">${day.condition.text}</small>
                                </div>
                            </div>
                            <ul class="list-group list-group-flush mb-2">
                                <li class="list-group-item"><strong>Max hőmérséklet:</strong> ${temperatureUnit === "C" ? `${day.maxtemp_c} °C` : `${day.maxtemp_f} °F`}</li>
                                <li class="list-group-item"><strong>Min hőmérséklet:</strong> ${temperatureUnit === "C" ? `${day.mintemp_c} °C` : `${day.mintemp_f} °F`}</li>
                                <li class="list-group-item"><strong>Átlag hőmérséklet:</strong> ${temperatureUnit === "C" ? `${day.avgtemp_c} °C` : `${day.avgtemp_f} °F`}</li>
                                <li class="list-group-item"><strong>Páratartalom:</strong> ${day.avghumidity} %</li>
                                <li class="list-group-item"><strong>Szél max:</strong> ${windSpeedUnit === "km/h" ? `${day.maxwind_kph} km/h` : `${day.maxwind_mph} mph`}</li>
                                <li class="list-group-item"><strong>Csapadék:</strong> ${precipitationUnit === "mm" ? `${day.totalprecip_mm} mm` : `${day.totalprecip_in} inch`}</li>
                                <li class="list-group-item"><strong>Eső:</strong> ${day.daily_chance_of_rain} %</li>
                                <li class="list-group-item"><strong>Hó:</strong> ${day.daily_chance_of_snow} %</li>
                                <li class="list-group-item"><strong>UV index:</strong> ${day.uv}</li>
                            </ul>
                            <button class="btn btn-dark w-100" type="button"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#forecastHoursOffcanvas"
                                data-day-idx="${idx}">
                                Óránkénti előrejelzés
                            </button>
                        </div>
                    </div>
                </div>
                `;
            }).join("")}
        </div>
        <style>
            .carousel-control-prev-icon,
            .carousel-control-next-icon {
                filter: invert(100%) brightness(0);
                width: 3rem;
                height: 3rem;
                box-shadow: 0 0 0 4px #000;
                border-radius: 50%;
            }
        </style>
        <button class="carousel-control-prev" type="button" data-bs-target="#forecastCarousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon"></span>
            <span class="visually-hidden">Előző</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#forecastCarousel" data-bs-slide="next">
            <span class="carousel-control-next-icon"></span>
            <span class="visually-hidden">Következő</span>
        </button>
    </div>
    `;

    forecastDataContainer.innerHTML = html;
    //hourly data
    document.querySelectorAll('[data-day-idx]').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.getAttribute('data-day-idx'));
            const hours = forecastCityData.forecastday[idx].hour;
            let hoursHtml = `<ul class="list-group">`;
            hours.forEach(hour => {
                hoursHtml += `
                <li class="list-group-item d-flex align-items-center">
                    <img src="https:${hour.condition.icon}" alt="${hour.condition.text}" style="width:32px; height:32px;" class="me-2">
                    <div>
                        <strong>${hour.time.slice(-5)}</strong> - 
                        ${hour.condition.text}
                        <div>
                            Hőmérséklet: ${temperatureUnit === "C" ? `${hour.temp_c} °C` : `${hour.temp_f} °F`}
                            Érzékelt hőmérséklet: ${temperatureUnit === "C" ? `${hour.feelslike_c} °C` : `${hour.feelslike_f} °F`}
                        </div>
                        <div>
                            Szél: ${windSpeedUnit === "km/h" ? `${hour.wind_kph} km/h` : `${hour.wind_mph} mph`} ${drawWindDirectionArrow(hour.wind_degree)}
                        </div>
                        <div>
                            Páratartalom: ${hour.humidity} %
                            Eső: ${hour.chance_of_rain} %
                            Hó: ${hour.chance_of_snow} %
                        </div>
                    </div>
                </li>
                `;
            });
            hoursHtml += `</ul>`;
            document.getElementById('forecastHoursOffcanvasBody').innerHTML = hoursHtml;
            document.getElementById('forecastHoursOffcanvasLabel').textContent = `Óránkénti előrejelzés - ${forecastCityData.forecastday[idx].date}`;
        });
    });
}

function drawWindDirectionArrow(windDegree) {
    let windDir = windDegree + 180;
    return `
    <svg width="32" height="32" viewBox="0 0 32 32" style="transform: rotate(${windDir}deg);">
        <polygon points="16,4 22,20 16,16 10,20" fill="#1976d2"/>
        <line x1="16" y1="28" x2="16" y2="8" stroke="#1976d2" stroke-width="2"/>
    </svg>`;
}