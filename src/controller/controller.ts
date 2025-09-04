import * as dateCurrent from "@/model/dateModel.ts";
import { WeatherModel } from "@/model/model";

const weatherModel = new WeatherModel("Moscow");
weatherModel.getWeather();
dateCurrent.dateCurrent(new Date());
