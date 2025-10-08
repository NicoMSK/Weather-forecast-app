import * as date from "@/model/formatDate";
import { WeatherModel, DAY_OPT_BY_DATE_MODE } from "@/model/model";
import { type WeatherDateMode } from "@/model/model";
import * as renderView from "@/view/view";
import * as temperatureSwitch from "@/view/temperatureSwitching.view";

const weatherModel = new WeatherModel();
let currentDateMode: WeatherDateMode = "today";

async function startRenderWeather(location: string) {
  const currentOption = DAY_OPT_BY_DATE_MODE[currentDateMode];

  weatherModel.setParametersLocation(location, currentOption.days);

  const todayWeatherData = await weatherModel.getWeather();

  if (!todayWeatherData) {
    throw new Error("weatherDataToday не существует");
  }

  const footerWeatherData = weatherModel.getDataRenderFooter(
    todayWeatherData,
    currentDateMode
  );

  const currentDate = date.formatDate(currentOption.dateDays);

  const weatherData = weatherModel.getDataForWeatherRender(
    todayWeatherData,
    currentDateMode
  );

  if (!weatherData) {
    throw new Error("dataWeather не существует");
  }

  renderView.mainWeather.renderWeatherHero(
    weatherData,
    currentDate,
    weatherModel.unitSymbolTemperature
  );

  renderView.mainWeather.renderFooter({
    footerItems: footerWeatherData,
    period: currentOption.currentPeriod as "time" | "date",
    unitMeasurement: weatherModel.unitSymbolTemperature,
  });
}

startRenderWeather("Moscow");

temperatureSwitch.temperatureToggle?.addEventListener("click", () => {
  const currentUnit = weatherModel.toggleUnitTemperature();
  temperatureSwitch.buttonSwitchTemperature(currentUnit);
  startRenderWeather("Moscow");
});

renderView.todayButton?.addEventListener("click", () => {
  currentDateMode = "today";
  renderView.updateControlButtons(currentDateMode);
  startRenderWeather("Moscow");
});

renderView.tommorowButton?.addEventListener("click", () => {
  currentDateMode = "tommorow";
  renderView.updateControlButtons(currentDateMode);
  startRenderWeather("Moscow");
});

renderView.threeDaysButton?.addEventListener("click", () => {
  currentDateMode = "threeDay";
  renderView.updateControlButtons(currentDateMode);
  startRenderWeather("Moscow");
});
