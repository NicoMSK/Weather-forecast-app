import * as date from "@/model/formatDate";
import { WeatherModel } from "@/model/model";
import type { WeatherDateType } from "@/model/model";
import * as renderView from "@/view/view";
import * as temperatureToggle from "@/view/temperatureSwitching.view";

let currentDateMode: WeatherDateType = "today";
const weatherModel = new WeatherModel();

async function startRenderWeather(
  location: string,
  days: number,
  period: "time" | "date",
  dateDay: number
) {
  weatherModel.setParametersLocation(location, days);
  const weatherDataToday = await weatherModel.getWeather();
  if (!weatherDataToday) {
    throw new Error("weatherDataToday не существует");
  }

  const renderFooterToday = await weatherModel.dataForFooterRender(
    weatherDataToday,
    currentDateMode
  );
  const dateCurrent = date.formatDate(dateDay);
  const dataWeather = renderView.mainWeather.getDataForWeatherRender(
    weatherDataToday,
    currentDateMode
  );

  if (!dataWeather) {
    throw new Error(`${dataWeather} не существует`);
  }

  renderView.mainWeather.renderWeather(dataWeather, dateCurrent, "&deg;C");

  renderView.mainWeather.renderFooter({
    footerItems: renderFooterToday,
    period: period,
    unitMeasurement: "℃",
  });
}

startRenderWeather("Moscow", 1, "time", 0);

renderView.todayButton?.addEventListener("click", async () => {
  startRenderWeather("Moscow", 1, "time", 0);

  currentDateMode = "today";
  renderView.updateControlButtons(currentDateMode);
});

renderView.tommorowButton?.addEventListener("click", async () => {
  currentDateMode = "tommorow";

  startRenderWeather("Moscow", 2, "time", 1);
  renderView.updateControlButtons(currentDateMode);
});

renderView.threeDaysButton?.addEventListener("click", async () => {
  currentDateMode = "threeDay";

  startRenderWeather("Moscow", 3, "date", 2);
  renderView.updateControlButtons(currentDateMode);
});

temperatureToggle.temperatureToggle?.addEventListener("click", () => {
  temperatureToggle.temperatureToggle?.classList.toggle("header__toggle--on");
});
