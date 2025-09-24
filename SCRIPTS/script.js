import { LocationData } from "./MODELS/LocationData.js";
import { WeatherCondition } from "./MODELS/WeatherConditionData.js";
import { CurrentWeather } from "./MODELS/CurrentWeatherData.js";
import { CityWeatherData } from "./MODELS/CityWeatherData.js";

const historicalButton = document.getElementById("historicalDataButton");
const forecastButton = document.getElementById("forecastDataButton");
const todayButton = document.getElementById("todayDataButton");
const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchBtn");
const currentDataContainer = document.getElementById("currentData");
const forecastDataContainer = document.getElementById("forecastData");
const historicalDataContainer = document.getElementById("historicalData");

const apiURL = "http://api.weatherapi.com/v1/";

const apiKeyFilePath = "../ASSETS/apiKEY.txt"; //Change this to your path

var apiKey = "";
var navButtonsClickable = false;
var currentCityData = null;

addEventListener("DOMContentLoaded", function() {
    if(!navButtonsClickable) {
        historicalButton.disabled = true;
        forecastButton.disabled = true;
        todayButton.disabled = true;
    }

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
todayButton.addEventListener("click", showCurrentWeather);

function searchCity() {
    let city = cityInput.value;
    if(city === "") {
        alert("Kérem adjon meg egy várost!");
        return;
    }
    else {
        fetch(apiURL + "current.json?key=" + apiKey + "&q=" + city + "&lang=hu")
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
        }).then(() => {
            showCurrentWeather();
            todayButton.disabled = false;
        })
        .catch(error => {
            console.error("Hiba a város adatainak lekérésekor:", error);
        });
    }
}

function showCurrentWeather() {
    if(currentCityData === null) {
        currentDataContainer.style.hidden = true;
        todayButton.disabled = true;
    }
    else {
        //TODO: ez még csak egy teszt, szebbé kell tenni
        currentDataContainer.style.hidden = false;
        forecastDataContainer.style.hidden = true;
        historicalDataContainer.style.hidden = true;
        currentDataContainer.innerHTML = "";
        // currentDataContainer.innerHTML += `
        // <h2>${currentCityData.location.name}, ${currentCityData.location.country}</h2>
        // <h5>${currentCityData.location.region} Helyi idő: ${currentCityData.location.localtime}</h5>
        // <img src="https:${currentCityData.current.condition.icon}" alt="${currentCityData.current.condition.text} icon">
        // <p>Hőmérséklet: ${currentCityData.current.temp_c} °C</p>
        // <p>Érzett hőmérséklet: ${currentCityData.current.feelslike_c} °C</p>
        // <p>Leírás: ${currentCityData.current.condition.text}</p>
        // <p>Páratartalom: ${currentCityData.current.humidity} %</p>
        // <p>Légnyomás: ${currentCityData.current.pressure_mb} mb</p>
        // <p>Szél: ${currentCityData.current.wind_kph} km/h, ${currentCityData.current.wind_dir}</p>
        // <p>Csapadék: ${currentCityData.current.precip_mm} mm</p>
        // <p>UV index: ${currentCityData.current.uv}</p>
        // <p>Látótávolság: ${currentCityData.current.vis_km} km</p>
        // <p>Utolsó frissítés: ${currentCityData.current.last_updated}</p>
        // `;
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
                <ul class="list-group list-group-flush mb-3">
                <li class="list-group-item"><strong>Hőmérséklet:</strong> ${currentCityData.current.temp_c} °C</li>
                <li class="list-group-item"><strong>Érzett hőmérséklet:</strong> ${currentCityData.current.feelslike_c} °C</li>
                <li class="list-group-item"><strong>Leírás:</strong> ${currentCityData.current.condition.text}</li>
                <li class="list-group-item"><strong>Páratartalom:</strong> ${currentCityData.current.humidity} %</li>
                <li class="list-group-item"><strong>Légnyomás:</strong> ${currentCityData.current.pressure_mb} mb</li>
                <li class="list-group-item"><strong>Szél:</strong> ${currentCityData.current.wind_kph} km/h, ${currentCityData.current.wind_dir}</li>
                <li class="list-group-item"><strong>Csapadék:</strong> ${currentCityData.current.precip_mm} mm</li>
                <li class="list-group-item"><strong>UV index:</strong> ${currentCityData.current.uv}</li>
                <li class="list-group-item"><strong>Látótávolság:</strong> ${currentCityData.current.vis_km} km</li>
                </ul>
                <div class="text-end">
                <small class="text-muted">Utolsó frissítés(helyi idő szerint): ${currentCityData.current.last_updated}</small>
                </div>
            </div>
            </div>
        `;
    }
}
