import * as typeApi from "@/model/api/type.api.ts";

const HOST_URL = "https://api.weatherapi.com/v1";
const API_KEY = "4a900778688045d887d103458252808";

export async function getWeatherFromAPI(
  location: string
): Promise<typeApi.WeatherDTO | null> {
  return fetch(`${HOST_URL}/current.json?key=${API_KEY}&q=${location}&aqi=no`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Запрос вернулся с ошибкой ${response.status}`);
      }
      return response.json();
    })
    .then((data: typeApi.WeatherDTO) => data)
    .catch((error) => {
      console.error(error);
      return null;
    });
}
