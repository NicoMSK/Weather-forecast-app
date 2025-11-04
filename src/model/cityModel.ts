import * as cityApi from "@/model/api/city.api";
import type { CityNames } from "./api/cityType";

export class CityModel {
  location: string = "Москва";
  cityName: CityNames | null = null;

  async getCity() {
    const resultCityApi = await cityApi.getCityFromApi(this.location);

    if (!resultCityApi || resultCityApi.length === 0) {
      console.log("Такого города не существует");
      return null;
    }

    this.cityName = resultCityApi;
    return this.cityName;
  }
}
