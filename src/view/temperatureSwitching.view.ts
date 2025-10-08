export const temperatureToggle = document.querySelector(".header__toggle");

export function buttonSwitchTemperature(currentTemp: string) {
  if (currentTemp === "farenheight") {
    temperatureToggle?.classList.add("header__toggle--on");
  } else {
    temperatureToggle?.classList.remove("header__toggle--on");
  }
}
