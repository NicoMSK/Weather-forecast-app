import * as date from "@/model/formatDate";
import { WeatherModel } from "@/model/model";
import type { WeatherDateType } from "@/model/model";
import * as renderView from "@/view/view";
import * as temperatureToggle from "@/view/temperatureSwitching.view";

let weatherDateType: WeatherDateType = {
  currentDateMode: "today",
  days: 1,
  dateDays: 0,
  currentPeriod: "time",
};

const weatherModel = new WeatherModel();

async function startRenderWeather(location: string) {
  weatherModel.setParametersLocation(location, weatherDateType.days);
  const weatherDataToday = await weatherModel.getWeather();
  if (!weatherDataToday) {
    throw new Error("weatherDataToday не существует");
  }

  const renderFooterToday = await weatherModel.dataForFooterRender(
    weatherDataToday,
    weatherDateType.currentDateMode
  );

  const dateCurrent = date.formatDate(weatherDateType.dateDays);

  const dataWeather = weatherModel.getDataForWeatherRender(
    weatherDataToday,
    weatherDateType.currentDateMode
  );

  if (!dataWeather) {
    throw new Error(`${dataWeather} не существует`);
  }

  renderView.mainWeather.renderWeatherMain(
    dataWeather,
    dateCurrent,
    weatherModel.unitSymbolTemperature
  );

  renderView.mainWeather.renderFooter({
    footerItems: renderFooterToday,
    period: weatherDateType.currentPeriod,
    unitMeasurement: weatherModel.unitSymbolTemperature,
  });
}

startRenderWeather("Moscow");

temperatureToggle.temperatureToggle?.addEventListener("click", () => {
  temperatureToggle.temperatureToggle?.classList.toggle("header__toggle--on");

  weatherModel.toggleUnitTemperature();

  startRenderWeather("Moscow");
});

renderView.todayButton?.addEventListener("click", async () => {
  weatherDateType = {
    currentDateMode: "today",
    days: 1,
    dateDays: 0,
    currentPeriod: "time",
  };

  startRenderWeather("Moscow");

  renderView.updateControlButtons(weatherDateType.currentDateMode);
});

renderView.tommorowButton?.addEventListener("click", async () => {
  weatherDateType = {
    currentDateMode: "tommorow",
    days: 2,
    dateDays: 1,
    currentPeriod: "time",
  };
  startRenderWeather("Moscow");

  renderView.updateControlButtons(weatherDateType.currentDateMode);
});

renderView.threeDaysButton?.addEventListener("click", async () => {
  weatherDateType = {
    currentDateMode: "threeDay",
    days: 3,
    dateDays: 2,
    currentPeriod: "date",
  };
  startRenderWeather("Moscow");

  renderView.updateControlButtons(weatherDateType.currentDateMode);
});
