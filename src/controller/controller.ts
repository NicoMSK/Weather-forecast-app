import * as date from "@/model/dateModel.ts";
import { WeatherModel } from "@/model/model";
import type { WeatherDateType } from "@/model/model";
import * as renderView from "@/view/view";
import * as temperatureToggle from "@/view/temperatureSwitching.view";

const dateCurrent = date.dateCurrent(new Date());
const celsiusFahrenheitSwitch = temperatureToggle.temperatureSwitching();
let currentDateMode: WeatherDateType = "today";
const weatherModel = new WeatherModel();

// async function startRenderWeather() {
//   weatherModel.setParametersLocation("Moscow", 1);
//   const weatherDataToday = await weatherModel.getWeather();
//   const renderFooterToday = await weatherModel.dataForFooterRender(
//     weatherDataToday,
//     currentDateMode
//   );

//   renderView.mainWeather.renderWeather(
//     weatherDataToday,
//     dateCurrent,
//     celsiusFahrenheitSwitch,
//     "&deg;C"
//   );

//   renderView.mainWeather.renderFooter({
//     footerItems: renderFooterToday,
//     period: "time",
//     unitMeasurement: "℃",
//   });
// }
async function startRenderWeather(
  location: string,
  days: number,
  period: "time" | "date"
) {
  weatherModel.setParametersLocation(location, days);
  const weatherDataToday = await weatherModel.getWeather();
  const renderFooterToday = await weatherModel.dataForFooterRender(
    weatherDataToday,
    currentDateMode
  );

  renderView.mainWeather.renderWeather(
    weatherDataToday,
    dateCurrent,
    celsiusFahrenheitSwitch,
    "&deg;C"
  );

  renderView.mainWeather.renderFooter({
    footerItems: renderFooterToday,
    period: period,
    unitMeasurement: "℃",
  });
}

startRenderWeather("Moscow", 1, "time");

renderView.todayButton?.addEventListener("click", async () => {
  startRenderWeather("Moscow", 1, "time");

  currentDateMode = "today";
  renderView.updateControlButtons(currentDateMode);
});

renderView.tommorowButton?.addEventListener("click", async () => {
  currentDateMode = "tommorow";
  // weatherModel.setParametersLocation("Moscow", 2);
  // const weatherDataTomorrow = await weatherModel.getWeather();
  // const renderFooterTomorrow = await weatherModel.dataForFooterRender(
  //   weatherDataTomorrow,
  //   currentDateMode
  // );

  // renderView.mainWeather.renderFooter({
  //   footerItems: renderFooterTomorrow,
  //   period: "time",
  //   unitMeasurement: "℃",
  // });
  startRenderWeather("Moscow", 2, "time");
  renderView.updateControlButtons(currentDateMode);
});

renderView.threeDaysButton?.addEventListener("click", async () => {
  currentDateMode = "threeDay";
  // weatherModel.setParametersLocation("Moscow", 3);
  // const weatherDataThreeDays = await weatherModel.getWeather();
  // const renderFooterThreeDays = await weatherModel.dataWeekForFooterRender(
  //   weatherDataThreeDays
  // );

  // renderView.mainWeather.renderFooter({
  //   footerItems: renderFooterThreeDays,
  //   period: "date",
  //   unitMeasurement: "℃",
  // });

  ////  НЕ работает ТУТ
  startRenderWeather("Moscow", 3, "date");
  renderView.updateControlButtons(currentDateMode);
});

temperatureToggle.temperatureToggle?.addEventListener("click", () => {
  temperatureToggle.temperatureToggle?.classList.toggle("header__toggle--on");
  temperatureToggle.temperatureSwitching();
});
