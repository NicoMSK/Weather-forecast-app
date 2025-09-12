const HOST_URL = "https://api.weatherapi.com/v1";
const API_KEY = "4a900778688045d887d103458252808";

export async function getWeatherFromAPI(
  location: string,
  currentOrFuture: string,
  days: number
) {
  try {
    const response = await fetch(
      `${HOST_URL}/${currentOrFuture}.json?key=${API_KEY}&q=${location}&days=${days}&aqi=no&alerts=no`
    );
    if (!response.ok) {
      throw new Error(`Запрос вернулся с ошибкой ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}
