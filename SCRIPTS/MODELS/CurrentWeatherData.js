class CurrentWeather {
    constructor(condition, feelslike_c, feelslike_f, humidity, last_updated, precip_in, precip_mm, pressure_in,
        pressure_mb, temp_c, temp_f, uv, vis_km, vis_miles, wind_degree, wind_dir, wind_kph, wind_mph) {
        this.condition = condition;
        this.feelslike_c = feelslike_c; //feels like temperature in celsius
        this.feelslike_f = feelslike_f; //feels like temperature in fahrenheit
        this.humidity = humidity; //humidity in percentage
        this.last_updated = last_updated; //time of last update
        this.precip_in = precip_in; //precipitation in inches
        this.precip_mm = precip_mm; //precipitation in millimeters
        this.pressure_in = pressure_in; //pressure in inches
        this.pressure_mb = pressure_mb; //pressure in millibars
        this.temp_c = temp_c; //temperature in celsius
        this.temp_f = temp_f; //temperature in fahrenheit
        this.uv = uv; //UV index
        this.vis_km = vis_km; //visibility in kilometers
        this.vis_miles = vis_miles; //visibility in miles
        this.wind_degree = wind_degree; //wind direction in degrees
        this.wind_dir = wind_dir; //wind direction as text
        this.wind_kph = wind_kph; //wind speed in kph
        this.wind_mph = wind_mph; //wind speed in mph
    }
}
export { CurrentWeather };