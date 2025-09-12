import * as weatherApi from "@/model/api/weather.api.ts";
import * as weatherType from "@/model/api/type.api";

export class WeatherModel {
  location: string;
  currentOrFuture: string;
  days: number;

  constructor(location: string, currentOrFuture: string, days: number) {
    this.location = location;
    this.currentOrFuture = currentOrFuture;
    this.days = days;
  }

  async getWeather() {
    return await weatherApi.getWeatherFromAPI(
      this.location,
      this.currentOrFuture,
      this.days
    );
  }

  dataForFooterRender(
    weatherData: weatherType.ForecastDayWeather,
    timePeriod: string
  ) {
    let time = null;
    let imgUrl = null;
    let imgText = null;
    let temperature = null;
    let dataRenderDays = [];
    let hourseSort = null;

    switch (timePeriod) {
      case "today":
        hourseSort = weatherData.forecast.forecastday[0].hour;
        break;
      case "tomorrow":
        hourseSort = weatherData.forecast.forecastday[1].hour;
        break;
    }

    if (!hourseSort) {
      throw new Error("hourseSort не существует");
    }

    const evenHourse = hourseSort.filter((hour, index) => index % 2 === 0);

    for (let i = 0; i < evenHourse.length; i++) {
      time = evenHourse[i].time.substring(16, 10);
      imgUrl = evenHourse[i].condition.icon;
      imgText = evenHourse[i].condition.text;
      temperature = Math.round(evenHourse[i].temp_c);

      dataRenderDays.push({ time, imgUrl, imgText, temperature });
    }

    return dataRenderDays;
  }
  // ниже функция которая отвечает за ренедер на 3 дня
  dataWeekForFooterRender(weatherData: weatherType.ForecastDayWeather) {
    let date = null;
    let imgUrl = null;
    let imgText = null;
    let temperature = null;
    let dataRenderWeek = [];
    const daysSort = weatherData.forecast.forecastday;

    console.log({ daysSort });
  }
}
