import * as weatherApi from "@/model/api/weather.api.ts";
import * as weatherType from "@/model/api/type";

const START_STRING = 16;
const END_STRING = 10;

export type WeatherDateType = "today" | "tommorow" | "threeDay";

export class WeatherModel {
  location: string = "";
  days: number = 0;

  setParametersLocation(location: string, days: number) {
    this.location = location;
    this.days = days;
  }

  async getWeather() {
    try {
      return await weatherApi.getWeatherFromAPI(this.location, this.days);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  dataForFooterRender(
    weatherData: weatherType.ForecastDayWeather,
    timePeriod: string
  ) {
    const renderDaysData = [];
    let hoursSort = null;

    switch (timePeriod) {
      case "today":
        hoursSort = weatherData.forecast.forecastday[0].hour;
        break;
      case "tommorow":
        hoursSort = weatherData.forecast.forecastday[1].hour;
        break;
    }

    if (!hoursSort) {
      throw new Error("hoursSort не существует");
    }

    const evenHourse = hoursSort.filter((hour, index) => index % 2 === 0);

    for (let i = 0; i < evenHourse.length; i++) {
      const time = evenHourse[i].time.substring(START_STRING, END_STRING);
      const imgUrl = evenHourse[i].condition.icon;
      const imgText = evenHourse[i].condition.text;
      const temperature = Math.round(evenHourse[i].temp_c);

      renderDaysData.push({ time, imgUrl, imgText, temperature });
    }

    return renderDaysData;
  }

  dataWeekForFooterRender(weatherData: weatherType.ForecastDayWeather) {
    const renderThreeDayData = [];
    const daysSort = weatherData.forecast.forecastday;

    for (let i = 0; i < daysSort.length; i++) {
      const date = daysSort[i].date.split("-").reverse().join("-");
      const imgUrl = daysSort[i].day.condition.icon;
      const imgText = daysSort[i].day.condition.text;
      const temperature = Math.round(daysSort[i].day.avgtemp_c);

      renderThreeDayData.push({ date, imgUrl, imgText, temperature });
    }

    return renderThreeDayData;
  }
}
