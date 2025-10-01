import * as weatherApi from "@/model/api/weather.api.ts";
import * as weatherType from "@/model/api/type";

const START_STRING = 16;
const END_STRING = 10;

export type WeatherDateType = {
  currentDateMode: "today" | "tommorow" | "threeDay";
  days: 1 | 2 | 3;
  dateDays: 0 | 1 | 2;
  currentPeriod: "time" | "date";
};

export class WeatherModel {
  location: string = "";
  days: number = 0;
  unit: "c" | "f" = "c";

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

  toggleUnitTemperature() {
    if (this.unit === "c") {
      this.unit = "f";
    } else {
      this.unit = "c";
    }
  }

  get unitSymbolTemperature(): "℃" | "℉" {
    if (this.unit === "c") {
      return "℃";
    } else {
      return "℉";
    }
  }

  getDataForWeatherRender(
    weatherData: weatherType.ForecastDayWeather,
    period: string
  ) {
    const tempKeyDayCurrent = `temp_${this.unit}` as "temp_c" | "temp_f";
    const tempKeyThreeDay = `avgtemp_${this.unit}` as "avgtemp_c" | "avgtemp_f";

    switch (period) {
      case "today":
        return {
          location: weatherData.location.name,
          localtime: weatherData.location.localtime,
          temperature: weatherData.current[tempKeyDayCurrent],
          img: weatherData.current.condition.icon,
          imgText: weatherData.current.condition.text,
          humidity: weatherData.current.humidity,
          vis: weatherData.current.vis_km,
          precip: weatherData.current.precip_mm,
          wind: weatherData.current.wind_kph,
        };
      case "tommorow":
        return {
          location: weatherData.location.name,
          localtime: weatherData.location.localtime,
          temperature: weatherData.forecast.forecastday[0].day[tempKeyThreeDay],
          img: weatherData.forecast.forecastday[0].day.condition.icon,
          imgText: weatherData.forecast.forecastday[0].day.condition.text,
          humidity: weatherData.forecast.forecastday[0].day.avghumidity,
          vis: weatherData.forecast.forecastday[0].day.avgvis_km,
          precip: weatherData.forecast.forecastday[0].day.totalprecip_mm,
          wind: weatherData.forecast.forecastday[0].day.maxwind_kph,
        };
      case "threeDay":
        return {
          location: weatherData.location.name,
          localtime: weatherData.location.localtime,
          temperature: weatherData.forecast.forecastday[2].day[tempKeyThreeDay],
          img: weatherData.forecast.forecastday[2].day.condition.icon,
          imgText: weatherData.forecast.forecastday[2].day.condition.text,
          humidity: weatherData.forecast.forecastday[2].day.avghumidity,
          vis: weatherData.forecast.forecastday[2].day.avgvis_km,
          precip: weatherData.forecast.forecastday[2].day.totalprecip_mm,
          wind: weatherData.forecast.forecastday[2].day.maxwind_kph,
        };
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
      case "threeDay":
        const daysSort = weatherData.forecast.forecastday;
        const tempKeyThreeDay = `avgtemp_${this.unit}` as
          | "avgtemp_c"
          | "avgtemp_f";
        if (!daysSort) throw new Error(`${daysSort} не существует`);

        for (let i = 0; i < daysSort.length; i++) {
          const date = daysSort[i].date.split("-").reverse().join("-");
          const imgUrl = daysSort[i].day.condition.icon;
          const imgText = daysSort[i].day.condition.text;
          const temperature = Math.round(daysSort[i].day[tempKeyThreeDay]);

          renderDaysData.push({ date, imgUrl, imgText, temperature });
        }

        return renderDaysData;
    }

    if (!hoursSort) throw new Error(`${hoursSort} не существует`);

    const evenHourse = hoursSort.filter((hour, index) => index % 2 === 0);

    for (let i = 0; i < evenHourse.length; i++) {
      const tempKeyDay = `temp_${this.unit}` as "temp_c" | "temp_f";
      const time = evenHourse[i].time.substring(START_STRING, END_STRING);
      const imgUrl = evenHourse[i].condition.icon;
      const imgText = evenHourse[i].condition.text;
      const temperature = Math.round(evenHourse[i][tempKeyDay]);

      renderDaysData.push({ time, imgUrl, imgText, temperature });
    }

    return renderDaysData;
  }
}
