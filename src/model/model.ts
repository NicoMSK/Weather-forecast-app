import * as weatherApi from "@/model/api/weather.api.ts";
import * as weatherType from "@/model/api/type";
import { getTextSlice } from "@/util";

export const DAY_OPT_BY_DATE_MODE = {
  today: { days: 1, dateDays: 0, currentPeriod: "time" },
  tommorow: { days: 2, dateDays: 1, currentPeriod: "time" },
  threeDay: { days: 3, dateDays: 2, currentPeriod: "date" },
} as const;

export type WeatherDateMode = keyof typeof DAY_OPT_BY_DATE_MODE;

const TEMPERATURE_TYPE = {
  celcium: "℃",
  farenheight: "℉",
} as const;

type TemperatureType = keyof typeof TEMPERATURE_TYPE;

export class WeatherModel {
  location: string = "";
  days: number = 0;
  unit: TemperatureType = "celcium";

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
    if (this.unit === "celcium") {
      return (this.unit = "farenheight");
    } else {
      return (this.unit = "celcium");
    }
  }

  get unitSymbolTemperature() {
    return TEMPERATURE_TYPE[this.unit];
  }

  getTempKeyDayCurrent(unit: TemperatureType) {
    try {
      if (unit === "celcium") {
        return { current: "temp_c", avg: "avgtemp_c" };
      } else {
        return { current: "temp_f", avg: "avgtemp_f" };
      }
    } catch (error) {
      throw new Error("unexpected unit: " + unit);
    }
  }

  getFormattedDataFromApi(
    weatherData: weatherType.ForecastDayWeather,
    period: string,
    days?: number
  ) {
    const LOCATION = weatherData.location.name;
    const LOCAL_TIME = weatherData.location.localtime;

    if (period === "today") {
      const temperaruteKey = this.getTempKeyDayCurrent(this.unit);

      return {
        location: LOCATION,
        localtime: LOCAL_TIME,
        temperature: weatherData.current[temperaruteKey.current],
        img: weatherData.current.condition.icon,
        imgText: weatherData.current.condition.text,
        humidity: weatherData.current.humidity,
        vis: weatherData.current.vis_km,
        precip: weatherData.current.precip_mm,
        wind: weatherData.current.wind_kph,
      };
    } else {
      const tempKeyThreeDay = this.getTempKeyDayCurrent(this.unit);

      if (days === undefined) {
        throw new Error("days НЕ верное число");
      }

      return {
        location: LOCATION,
        localtime: LOCAL_TIME,
        temperature:
          weatherData.forecast.forecastday[days].day[tempKeyThreeDay.avg],
        img: weatherData.forecast.forecastday[days].day.condition.icon,
        imgText: weatherData.forecast.forecastday[days].day.condition.text,
        humidity: weatherData.forecast.forecastday[days].day.avghumidity,
        vis: weatherData.forecast.forecastday[days].day.avgvis_km,
        precip: weatherData.forecast.forecastday[days].day.totalprecip_mm,
        wind: weatherData.forecast.forecastday[days].day.maxwind_kph,
      };
    }
  }

  getDataForWeatherRender(
    weatherData: weatherType.ForecastDayWeather,
    period: string
  ) {
    switch (period) {
      case "today":
        return this.getFormattedDataFromApi(weatherData, period);
      case "tommorow":
        return this.getFormattedDataFromApi(weatherData, period, 0);
      case "threeDay":
        return this.getFormattedDataFromApi(weatherData, period, 2);
    }
  }

  getWeatherForDay(
    weatherData: weatherType.ForecastDayWeather,
    timePeriod: string
  ) {
    const renderDaysData = [];
    let hoursSort = null;

    if (timePeriod === "today") {
      hoursSort = weatherData.forecast.forecastday[0].hour;
    } else {
      hoursSort = weatherData.forecast.forecastday[1].hour;
    }

    if (!hoursSort) throw new Error("hoursSort не существует");

    const evenHours = hoursSort.filter((hour, index) => index % 2 === 0);
    const tempKeyDay = this.getTempKeyDayCurrent(this.unit);

    for (let i = 0; i < evenHours.length; i++) {
      renderDaysData.push({
        time: getTextSlice(evenHours[i].time),
        imgUrl: evenHours[i].condition.icon,
        imgText: evenHours[i].condition.text,
        temperature: Math.round(evenHours[i][tempKeyDay.current]),
      });
    }

    return renderDaysData;
  }

  getWeatherForThreeDay(weatherData: weatherType.ForecastDayWeather) {
    const renderDaysData = [];
    const daysSort = weatherData.forecast.forecastday;
    const tempKeyThreeDay = this.getTempKeyDayCurrent(this.unit);

    if (!daysSort) throw new Error("daysSort не существует");

    for (let i = 0; i < daysSort.length; i++) {
      renderDaysData.push({
        date: daysSort[i].date.split("-").reverse().join("-"),
        imgUrl: daysSort[i].day.condition.icon,
        imgText: daysSort[i].day.condition.text,
        temperature: Math.round(daysSort[i].day[tempKeyThreeDay.avg]),
      });
    }

    return renderDaysData;
  }

  getDataRenderFooter(
    weatherData: weatherType.ForecastDayWeather,
    timePeriod: string
  ) {
    if (timePeriod === "threeDay") {
      return this.getWeatherForThreeDay(weatherData);
    } else {
      return this.getWeatherForDay(weatherData, timePeriod);
    }
  }
}
