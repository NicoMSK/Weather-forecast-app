import { safetyQuerySelector } from "@/util";

export const searchCity = safetyQuerySelector<HTMLInputElement>(".hero__input");
export const inputError =
  safetyQuerySelector<HTMLDivElement>(".hero__input-error");

export function searchCityName() {
  const inputCityName = searchCity.value.trim();

  if (inputCityName.length < 3) {
    inputError.classList.remove("hero__input-error--hidden");
  } else {
    inputError.classList.add("hero__input-error--hidden");
    return inputCityName;
  }
}

export function showError() {
  inputError.classList.remove("hero__input-error--hidden");
}

export function validateStringNotEmpty() {
  const inputCityName = searchCity.value.trim();

  if (inputCityName === "" || inputCityName.length >= 3) {
    inputError.classList.add("hero__input-error--hidden");
  }
}
