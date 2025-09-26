import * as weatherType from "@/model/api/type";
import * as weatherTypeMode from "@/model/model";

const START_STRING = 16;
const END_STRING = 10;

const heroContainer = document.querySelector(".hero__weather-wrapper");
export const headerListItems = document.querySelectorAll(".header__item");
export const headerList = document.querySelector(".header");
export const todayButton = document.querySelector(".header__button--today");
export const tommorowButton = document.querySelector(
  ".header__button--tommorow"
);
export const threeDaysButton = document.querySelector(
  ".header__button--three-days"
);

export function updateControlButtons(
  curDateMode: weatherTypeMode.WeatherDateType
) {
  const headerListItemsArray = [...headerListItems];

  headerListItemsArray.forEach((item) =>
    item.classList.remove("header__item--current")
  );

  const targetButton = headerListItemsArray.find(
    (item) => (item as HTMLElement).dataset.mode === curDateMode
  );

  if (!targetButton) {
    console.warn(`Кнопка с data-mode="${curDateMode}" не найдена`);
    return;
  } else {
    targetButton.classList.add("header__item--current");
  }
}

if (!(heroContainer instanceof HTMLElement)) {
  throw new Error("hero-Container не найден");
}

type WeatherDataDay = {
  location: string;
  localtime: string;
  temperature: number;
  img: string;
  imgText: string;
  humidity: number;
  vis: number;
  precip: number;
  wind: number;
};

type WeatherIndicatorsByTime = {
  time?: string;
  date?: string;
  imgUrl: string;
  imgText: string;
  temperature: number;
};

export class MainWeather {
  private parent: HTMLElement;
  headerTime = document.querySelector(".header__time");
  weatherClockList = document.querySelector(".footer__list");
  footerTemplate =
    document.querySelector<HTMLTemplateElement>(".footer__template")!.content;
  itemTemplate = this.footerTemplate.querySelector(".footer__item");

  constructor(parent: HTMLElement) {
    this.parent = parent;
  }

  getDataForWeatherRender(
    weatherData: weatherType.ForecastDayWeather,
    period: string
  ) {
    switch (period) {
      case "today":
        return {
          location: weatherData.location.name,
          localtime: weatherData.location.localtime,
          temperature: weatherData.current.temp_c,
          img: weatherData.current.condition.icon,
          imgText: weatherData.current.condition.text,
          humidity: weatherData.current.humidity,
          vis: weatherData.current.vis_km,
          precip: weatherData.current.precip_mm,
          wind: weatherData.current.wind_kph,
        };
      case "tommorow":
        return {
          location: weatherData.location.name,
          localtime: weatherData.location.localtime,
          temperature: weatherData.forecast.forecastday[0].day.avgtemp_c,
          img: weatherData.forecast.forecastday[0].day.condition.icon,
          imgText: weatherData.forecast.forecastday[0].day.condition.text,
          humidity: weatherData.forecast.forecastday[0].day.avghumidity,
          vis: weatherData.forecast.forecastday[0].day.avgvis_km,
          precip: weatherData.forecast.forecastday[0].day.totalprecip_mm,
          wind: weatherData.forecast.forecastday[0].day.maxwind_kph,
        };
      case "threeDay":
        return {
          location: weatherData.location.name,
          localtime: weatherData.location.localtime,
          temperature: weatherData.forecast.forecastday[2].day.avgtemp_c,
          img: weatherData.forecast.forecastday[2].day.condition.icon,
          imgText: weatherData.forecast.forecastday[2].day.condition.text,
          humidity: weatherData.forecast.forecastday[2].day.avghumidity,
          vis: weatherData.forecast.forecastday[2].day.avgvis_km,
          precip: weatherData.forecast.forecastday[2].day.totalprecip_mm,
          wind: weatherData.forecast.forecastday[2].day.maxwind_kph,
        };
    }
  }

  renderWeather(
    weatherData: WeatherDataDay,
    dateCurrent: string,
    unitMeasurement: string
  ) {
    const heroContent = `
      <div class="hero__box">
        <div class="hero__location-box">
          <p class="hero__location">${weatherData.location}</p>
          <p class="hero__date">${dateCurrent}</p>
        </div>
        <div class="hero__temperature-box">
          <p class="hero__temperature">${Math.round(
            weatherData.temperature
          )}${unitMeasurement}</p>
          <img src="${weatherData.img}" alt="${weatherData.imgText}">
        </div>
      </div>
      <ul class="hero__list">
        <li class="hero__item">
          <p class="hero__weather-data">Влажность</p>
          <p class="hero__weather-parameter">
            <span class="hero__humidity">${weatherData.humidity}</span>
            %
          </p>
        </li>
        <li class="hero__item">
          <p class="hero__weather-data">Видимость</p>
          <p class="hero__weather-parameter">
            <span class="hero__mileage">${weatherData.vis}</span>
            км
          </p>
        </li>
        <li class="hero__item">
          <p class="hero__weather-data">Осадки</p>
          <p class="hero__weather-parameter">
            <span class="hero__pressure">${Math.ceil(weatherData.precip)}</span>
            мм.
          </p>
        </li>
        <li class="hero__item">
          <p class="hero__weather-data">Ветер</p>
          <p class="hero__weather-parameter">
            <span class="hero__speed">${Math.round(weatherData.wind)}</span>
            м/с
          </p>
        </li>
      </ul>`;

    if (!this.headerTime) {
      throw new Error("headerTime не найден");
    }

    this.parent.innerHTML = heroContent;
    this.headerTime.innerHTML = weatherData.localtime.substring(
      START_STRING,
      END_STRING
    );

    this.renderFooter({ footerItems: [], period: "", unitMeasurement: "" });
  }

  renderFooter(params: {
    footerItems: WeatherIndicatorsByTime[];
    period: "time" | "date";
    unitMeasurement: "℃" | "℉";
  }) {
    if (!(this.weatherClockList instanceof HTMLElement)) {
      throw new Error("weatherClockList не найден");
    }

    this.weatherClockList.innerHTML = "";

    for (let i = 0; i < params.footerItems.length; i++) {
      const footerClockItem = this.itemTemplate?.cloneNode(true) as HTMLElement;
      const timeFooter = footerClockItem.querySelector(".footer__time")!;
      const imgUrlFooter =
        footerClockItem.querySelector<HTMLImageElement>(".footer__img")!;
      const temperatureFooter = footerClockItem.querySelector(
        ".footer__temperature"
      )!;

      timeFooter.textContent = String(params.footerItems[i][params.period]);
      imgUrlFooter.src = params.footerItems[i].imgUrl;
      imgUrlFooter.alt = params.footerItems[i].imgText;
      temperatureFooter.textContent =
        String(params.footerItems[i].temperature) + params.unitMeasurement;

      this.weatherClockList.appendChild(footerClockItem);
    }
  }
}

export const mainWeather = new MainWeather(heroContainer);
