import * as date from "@/model/formatDate";
import { WeatherModel, DAY_OPT_BY_DATE_MODE } from "@/model/model";
import * as renderView from "@/view/view";
import * as temperatureSwitch from "@/view/temperatureSwitching.view";
import * as showDownload from "@/view/downloadWindow";
import * as searchCityView from "@/view/searchCity";
import { CityModel } from "@/model/cityModel";

const weatherModel = new WeatherModel();
const cityModel = new CityModel();

async function startRenderWeather() {
  const currentOption = DAY_OPT_BY_DATE_MODE[weatherModel.currentDateMode];

  const cityName = await showDownload.showsDownloadWindow(cityModel.getCity());

  if (!cityName) {
    searchCityView.showError();
    throw new Error("Города не существует");
  }

  const weatherData = await showDownload.showsDownloadWindow(
    weatherModel.getWeather(cityName[0].name)
  );
  const currentDate = date.formatDate(currentOption.dateDays);
  const footerWeatherData = weatherModel.getDataRenderFooter();

  if (!weatherData) {
    throw new Error("weatherData не существует");
  }

  renderView.mainWeather.renderWeatherHero(
    weatherData,
    cityName[0].local_names.ru,
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

const startSearchCity = () => {
  const cityName = searchCityView.searchCityName()!;

  cityModel.location = cityName;
  startRenderWeather();
};

searchCityView.searchCity.addEventListener("keydown", (event) => {
  if (event.key === "Enter") startSearchCity();
});

searchCityView.searchCity.addEventListener(
  "input",
  searchCityView.validateStringNotEmpty
);

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
