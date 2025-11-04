import type { CityNames } from "./cityType";

const API_KEY = "2c400ae7e35c5ee43924eddd40328031";
const HOST_URL = "https://api.openweathermap.org/geo/1.0";

export async function getCityFromApi(city: string) {
  try {
    const response = await fetch(
      `${HOST_URL}/direct?q=${city}&limit=1&appid=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error(`Запрос вернулся с ошибкой ${response.status}`);
    }

    return (await response.json()) as CityNames;
  } catch (error) {
    console.error(error);
    return null;
  }
}
