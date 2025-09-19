import * as date from "@/model/dateModel.ts";
import { WeatherModel } from "@/model/model";
import type { WeatherDateType } from "@/model/model";
import * as renderView from "@/view/view";
import * as temperatureToggle from "@/view/temperatureSwitching.view";

const dateCurrent = date.dateCurrent(new Date());
const celsiusFahrenheitSwitch = temperatureToggle.temperatureSwitching();
let currentDateMode: WeatherDateType = "today";
const weatherModel = new WeatherModel("Moscow", "forecast", 1);

async function startRenderWeather() {
  const renderApiToday = weatherModel.getWeather();
  const renderFooterToday = weatherModel.dataForFooterRender(
    await renderApiToday,
    currentDateMode
  );

  renderView.mainWeather.renderWeather(
    await renderApiToday,
    dateCurrent,
    celsiusFahrenheitSwitch,
    "&deg;C"
  );

  renderView.mainWeather.renderFooter(await renderFooterToday, "time", "℃");
}

startRenderWeather();

renderView.todayButton?.addEventListener("click", async () => {
  startRenderWeather();

  currentDateMode = "today";
  renderView.updateControlButtons(currentDateMode);
});

renderView.tommorowButton?.addEventListener("click", async () => {
  const weatherModelTomorrow = new WeatherModel("Moscow", "forecast", 2);
  const renderApiTomorrow = weatherModelTomorrow.getWeather();
  const renderFooterTomorrow = weatherModelTomorrow.dataForFooterRender(
    await renderApiTomorrow,
    (currentDateMode = "tommorow")
  );

  renderView.mainWeather.renderFooter(await renderFooterTomorrow, "time", "℃");

  renderView.updateControlButtons(currentDateMode);
});

renderView.threeDaysButton?.addEventListener("click", async () => {
  const weatherModelThreeDays = new WeatherModel("Moscow", "forecast", 3);
  const renderApiThreeDays = weatherModelThreeDays.getWeather();
  const renderFooterThreeDays = weatherModelThreeDays.dataWeekForFooterRender(
    await renderApiThreeDays
  );

  renderView.mainWeather.renderFooter(await renderFooterThreeDays, "date", "℃");

  currentDateMode = "threeDay";
  renderView.updateControlButtons(currentDateMode);
});

temperatureToggle.temperatureToggle?.addEventListener("click", () => {
  temperatureToggle.temperatureToggle?.classList.toggle("header__toggle--on");
  temperatureToggle.temperatureSwitching();
});
