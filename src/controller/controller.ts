import * as date from "@/model/formatDate";
import { WeatherModel, DAY_OPT_BY_DATE_MODE } from "@/model/model";
import * as renderView from "@/view/view";
import * as temperatureSwitch from "@/view/temperatureSwitching.view";
import * as showDownload from "@/view/downloadWindow";
import * as searchCityView from "@/view/searchCityView";
import { CityModel } from "@/model/cityModel";

const weatherModel = new WeatherModel();
const cityModel = new CityModel();

async function initApp() {
  const cityName = await showDownload.showsDownloadWindow(cityModel.getCity());

  if (!cityName) {
    searchCityView.showError();
    throw new Error("Города не существует");
  }

  const currentWeatherData = await showDownload.showsDownloadWindow(
    weatherModel.getWeather(cityName[0].name)
  );

  if (!currentWeatherData) {
    searchCityView.showError();
    throw new Error("weatherData не существует");
  }

  startRenderWeather(currentWeatherData);
}

async function startRenderWeather(weatherData: renderView.WeatherDataDay) {
  const currentOption = DAY_OPT_BY_DATE_MODE[weatherModel.currentDateMode];
  const currentDate = date.formatDate(currentOption.dateDays);
  const footerWeatherData = weatherModel.getDataRenderFooter();
  const cityList = cityModel.cityName![0].local_names.ru;

  renderView.mainWeather.renderWeatherHero(
    weatherData,
    cityList,
    currentDate,
    weatherModel.unitSymbolTemperature
  );

  renderView.mainWeather.renderFooter({
    footerItems: footerWeatherData,
    period: currentOption.currentPeriod,
    unitMeasurement: weatherModel.unitSymbolTemperature,
  });
}

initApp();

const startSearchCity = () => {
  const cityNameInput = searchCityView.getCityNameInput()!;

  if (cityModel.location === cityNameInput) return;

  cityModel.location = cityNameInput;

  initApp();
};

searchCityView.searchCity.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    startSearchCity();
  }
});

searchCityView.searchCity.addEventListener("input", () => {
  const cityNameInput = searchCityView.getCityNameInput();

  searchCityView.validateStringEmpty(cityNameInput);
});

temperatureSwitch.temperatureToggle?.addEventListener("click", () => {
  const currentUnit = weatherModel.toggleUnitTemperature();
  temperatureSwitch.buttonSwitchTemperature(currentUnit);
  initApp();
});

renderView.todayButton?.addEventListener("click", () => {
  weatherModel.currentDateMode = "today";
  renderView.updateControlButtons(weatherModel.currentDateMode);
  initApp();
});

renderView.tommorowButton?.addEventListener("click", () => {
  weatherModel.currentDateMode = "tommorow";
  renderView.updateControlButtons(weatherModel.currentDateMode);
  initApp();
});

renderView.threeDaysButton?.addEventListener("click", () => {
  weatherModel.currentDateMode = "threeDay";
  renderView.updateControlButtons(weatherModel.currentDateMode);
  initApp();
});
