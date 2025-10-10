import * as date from "@/model/formatDate";
import { WeatherModel, DAY_OPT_BY_DATE_MODE } from "@/model/model";
import { type WeatherDateMode } from "@/model/model";
import * as renderView from "@/view/view";
import * as temperatureSwitch from "@/view/temperatureSwitching.view";

const weatherModel = new WeatherModel();
// потом пригодится
// weatherModel.setParametersLocation(location, currentOption.days);

async function startRenderWeather() {
  const currentOption = DAY_OPT_BY_DATE_MODE[weatherModel.currentDateMode];

  await weatherModel.getWeather();

  const weatherData = weatherModel.getFormattedDataFromApi();
  const currentDate = date.formatDate(currentOption.dateDays);
  const footerWeatherData = weatherModel.getDataRenderFooter();

  renderView.mainWeather.renderWeatherHero(
    weatherData,
    currentDate,
    weatherModel.unitSymbolTemperature
  );

  renderView.mainWeather.renderFooter({
    footerItems: footerWeatherData,
    period: currentOption.currentPeriod,
    unitMeasurement: weatherModel.unitSymbolTemperature,
  });
}

startRenderWeather();

temperatureSwitch.temperatureToggle?.addEventListener("click", () => {
  const currentUnit = weatherModel.toggleUnitTemperature();
  temperatureSwitch.buttonSwitchTemperature(currentUnit);
  startRenderWeather();
});

renderView.todayButton?.addEventListener("click", () => {
  weatherModel.currentDateMode = "today";
  renderView.updateControlButtons(weatherModel.currentDateMode);
  startRenderWeather();
});

renderView.tommorowButton?.addEventListener("click", () => {
  weatherModel.currentDateMode = "tommorow";
  renderView.updateControlButtons(weatherModel.currentDateMode);
  startRenderWeather();
});

renderView.threeDaysButton?.addEventListener("click", () => {
  weatherModel.currentDateMode = "threeDay";
  renderView.updateControlButtons(weatherModel.currentDateMode);
  startRenderWeather();
});
