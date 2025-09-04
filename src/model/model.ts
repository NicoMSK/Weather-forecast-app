import * as weatherApi from "@/model/api/weather.api.ts";

export class WeatherModel {
  location: string;

  constructor(location: string) {
    this.location = location;
  }

  async getWeather() {
    const weatherData = await weatherApi.getWeatherFromAPI(this.location);
    return weatherData;
  }
}
