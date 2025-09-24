import { WeatherCondition } from "./WeatherConditionData.js";

class ForecastDayData {
    constructor(date, day, hour) {
        this.date = date;
        this.day = day;     // DayData
        this.hour = hour;   // HourData[] 
    }
}

class DayData {
    constructor(obj) {
        this.maxtemp_c = obj.maxtemp_c;
        this.maxtemp_f = obj.maxtemp_f;
        this.mintemp_c = obj.mintemp_c;
        this.mintemp_f = obj.mintemp_f;
        this.avgtemp_c = obj.avgtemp_c;
        this.avgtemp_f = obj.avgtemp_f;
        this.maxwind_mph = obj.maxwind_mph;
        this.maxwind_kph = obj.maxwind_kph;
        this.totalprecip_mm = obj.totalprecip_mm;
        this.totalprecip_in = obj.totalprecip_in;
        this.avghumidity = obj.avghumidity;
        this.daily_chance_of_rain = obj.daily_chance_of_rain;
        this.daily_chance_of_snow = obj.daily_chance_of_snow;
        this.condition = new WeatherCondition(
            obj.condition.text,
            obj.condition.icon,
        );
        this.uv = obj.uv;
    }
}

class HourData {
    constructor(obj) {
        this.time = obj.time;
        this.temp_c = obj.temp_c;
        this.temp_f = obj.temp_f;
        this.is_day = obj.is_day;
        this.condition = new WeatherCondition(
            obj.condition.text,
            obj.condition.icon,
        );
        this.wind_mph = obj.wind_mph;
        this.wind_kph = obj.wind_kph;
        this.wind_degree = obj.wind_degree;
        this.wind_dir = obj.wind_dir;
        this.pressure_mb = obj.pressure_mb;
        this.pressure_in = obj.pressure_in;
        this.precip_mm = obj.precip_mm;
        this.precip_in = obj.precip_in;
        this.humidity = obj.humidity;
        this.feelslike_c = obj.feelslike_c;
        this.feelslike_f = obj.feelslike_f;
        this.chance_of_rain = obj.chance_of_rain;
        this.chance_of_snow = obj.chance_of_snow;
        this.uv = obj.uv;
    }
}

class ForecastData {
    constructor(forecastObj) {
        this.forecastday = forecastObj.forecastday.map(dayObj =>
            new ForecastDayData(
                dayObj.date,
                new DayData(dayObj.day),
                dayObj.hour.map(hourObj => new HourData(hourObj))
            )
        );
    }
}

export { ForecastDayData, DayData, HourData , ForecastData };