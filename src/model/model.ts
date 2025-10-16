import * as weatherApi from "@/model/api/weather.api.ts";
import * as weatherType from "@/model/api/weatherType";
import * as cityApi from "@/model/api/city.api";
import { getFormattedTime } from "@/util";
import type { CityNames } from "./api/cityType";

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
  location: string = "Париж";
  currentDateMode: WeatherDateMode = "today";
  unit: TemperatureType = "celcium";
  weatherData: weatherType.ForecastDayWeather | null = null;
  nameCity: CityNames | null = null;

  async getCity() {
    const resultCityApi = await cityApi.getCityFromApi(this.location);
    console.log(resultCityApi);
    if (!resultCityApi || resultCityApi.length === 0) {
      console.log("Такого города не существует");
      return null;
    }

    this.nameCity = resultCityApi;
    return this.nameCity;
  }

  async getWeather() {
    const daysOpt = DAY_OPT_BY_DATE_MODE[this.currentDateMode].days;

    if (!this.nameCity) {
      throw new Error("Нет такого города");
    }

    this.weatherData = await weatherApi.getWeatherFromAPI(
      this.nameCity[0].name,
      daysOpt
    );

    if (!this.weatherData) {
      throw new Error("weatherData не существует");
    }

    return this.getFormattedDataFromApi(this.weatherData);
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
        return { current: "temp_c", avg: "avgtemp_c" } as const;
      } else {
        return { current: "temp_f", avg: "avgtemp_f" } as const;
      }
    } catch (error) {
      throw new Error("unexpected unit: " + unit);
    }
  }

  getFormattedDataFromApi(weatherData: weatherType.ForecastDayWeather) {
    const { location, current, forecast } = weatherData;
    const temperaruteKey = this.getTempKeyDayCurrent(this.unit);
    const days = DAY_OPT_BY_DATE_MODE[this.currentDateMode].dateDays;

    if (this.currentDateMode === "today") {
      return {
        location: location.name,
        localtime: location.localtime,
        temperature: current[temperaruteKey.current],
        img: current.condition.icon,
        imgText: current.condition.text,
        humidity: current.humidity,
        vis: current.vis_km,
        precip: current.precip_mm,
        wind: current.wind_kph,
      };
    }

    return {
      location: location.name,
      localtime: location.localtime,
      temperature: forecast.forecastday[days].day[temperaruteKey.avg],
      img: forecast.forecastday[days].day.condition.icon,
      imgText: forecast.forecastday[days].day.condition.text,
      humidity: forecast.forecastday[days].day.avghumidity,
      vis: forecast.forecastday[days].day.avgvis_km,
      precip: forecast.forecastday[days].day.totalprecip_mm,
      wind: forecast.forecastday[days].day.maxwind_kph,
    };
  }

  getWeatherForDay(weatherData: weatherType.ForecastDayWeather) {
    const renderDaysData = [];
    const { forecast } = weatherData;
    let hoursSort = null;

    if (this.currentDateMode === "today") {
      hoursSort = forecast.forecastday[0].hour;
    } else {
      hoursSort = forecast.forecastday[1].hour;
    }

    const evenHours = hoursSort.filter((hour, index) => index % 2 === 0);
    const tempKeyDay = this.getTempKeyDayCurrent(this.unit);

    for (let i = 0; i < evenHours.length; i++) {
      renderDaysData.push({
        time: getFormattedTime(evenHours[i].time),
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

  getDataRenderFooter() {
    if (!this.weatherData) {
      throw new Error("weatherData не существует");
    }

    if (this.currentDateMode === "threeDay") {
      return this.getWeatherForThreeDay(this.weatherData);
    } else {
      return this.getWeatherForDay(this.weatherData);
    }
  }
}
