import { safetyQuerySelector } from "@/util";

export const searchCityInput =
  safetyQuerySelector<HTMLInputElement>(".hero__input");
export const inputError =
  safetyQuerySelector<HTMLDivElement>(".hero__input-error");

export function getInputValue() {
  return searchCityInput.value.trim();
}

export function showError() {
  inputError.classList.remove("hero__input-error--hidden");
}

export function validateStringEmpty(inputCityName: string) {
  if (inputCityName === "" || inputCityName.length >= 3) {
    inputError.classList.add("hero__input-error--hidden");
  }
}
