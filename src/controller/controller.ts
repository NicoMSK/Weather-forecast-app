import * as date from "@/model/dateModel.ts";
import { WeatherModel } from "@/model/model";
import * as renderView from "@/view/view";
import * as temperatureToggle from "@/view/temperatureSwitching.view";

const weatherModel = new WeatherModel("Moscow", "current", 0);
const weatherModelOneDay = new WeatherModel("Moscow", "forecast", 3);
const dateCurrent = date.dateCurrent(new Date());
const renderApi = weatherModel.getWeather();
const renderApiOneDay = weatherModelOneDay.getWeather();
const celsiusFahrenheitSwitch = temperatureToggle.temperatureSwitching();
const renderFooterOneDay = weatherModelOneDay.dataForFooterRender(
  await renderApiOneDay,
  "today"
);

const renderApiWeek = weatherModelOneDay.dataWeekForFooterRender(
  await renderApiOneDay
);

renderView.mainWeather.renderWeather(
  await renderApi,
  dateCurrent,
  celsiusFahrenheitSwitch,
  "&deg;C"
);

renderView.mainWeather.renderFooter(await renderFooterOneDay);

renderView.mainWeather.renderFooter(await renderApiWeek); /// вызов на 3 дня

temperatureToggle.temperatureToggle?.addEventListener("click", () => {
  temperatureToggle.temperatureToggle?.classList.toggle("header__toggle--on");
  temperatureToggle.temperatureSwitching();
});
