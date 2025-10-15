import * as date from "@/model/formatDate";
import { WeatherModel, DAY_OPT_BY_DATE_MODE } from "@/model/model";
import * as renderView from "@/view/view";
import * as temperatureSwitch from "@/view/temperatureSwitching.view";
import * as showDownload from "@/view/downloadWindow";
import { searchCity } from "@/view/searchCity";
import debounce from "lodash.debounce";

const DEBOUNCE_INTERVAL_MS = 300;
const weatherModel = new WeatherModel();

function searchCityName() {
  const inputCityName = searchCity.value.trim();
  weatherModel.tttttt(inputCityName);
  console.log(inputCityName);
}

searchCity.addEventListener(
  "input",
  debounce(searchCityName, DEBOUNCE_INTERVAL_MS)
);

async function startRenderWeather() {
  const currentOption = DAY_OPT_BY_DATE_MODE[weatherModel.currentDateMode];

  const cityName = await weatherModel.getCity();

  if (!cityName) {
    throw new Error("Города не существует");
  }
  // weatherModel.setParametersLocation(cityName[1].local_names.en);

  const weatherData = await showDownload.showsDownloadWindow(
    weatherModel.getWeather()
  );
  const currentDate = date.formatDate(currentOption.dateDays);
  const footerWeatherData = weatherModel.getDataRenderFooter();

  if (!weatherData) {
    throw new Error("weatherData не существует");
  }

  renderView.mainWeather.renderWeatherHero(
    weatherData,
    cityName[1].local_names.ru,
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
