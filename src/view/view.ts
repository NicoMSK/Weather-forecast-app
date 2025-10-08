import * as weatherTypeMode from "@/model/model";
import { getTextSlice, safetyQuerySelector } from "@/util";

const heroContainer = safetyQuerySelector<HTMLElement>(
  ".hero__weather-wrapper"
);
export const headerListItems = document.querySelectorAll(".header__item");
export const headerList = safetyQuerySelector<HTMLElement>(".header");
export const todayButton = safetyQuerySelector<HTMLElement>(
  ".header__button--today"
);
export const tommorowButton = safetyQuerySelector(".header__button--tommorow");
export const threeDaysButton = safetyQuerySelector(
  ".header__button--three-days"
);

export function updateControlButtons(
  curDateMode: weatherTypeMode.WeatherDateMode
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
  headerTime = safetyQuerySelector<HTMLElement>(".header__time");
  weatherClockList = safetyQuerySelector<HTMLHtmlElement>(".footer__list");
  footerTemplate =
    safetyQuerySelector<HTMLTemplateElement>(".footer__template").content;
  itemTemplate = safetyQuerySelector<HTMLElement>(
    ".footer__item",
    this.footerTemplate
  );

  constructor(parent: HTMLElement) {
    this.parent = parent;
  }

  renderWeatherHero(
    weatherData: WeatherDataDay,
    dateCurrent: string,
    unitMeasurement: "℃" | "℉"
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
    this.headerTime.innerHTML = getTextSlice(weatherData.localtime);
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
      const timeFooter = safetyQuerySelector<HTMLElement>(
        ".footer__time",
        footerClockItem
      );
      const imgUrlFooter = safetyQuerySelector<HTMLImageElement>(
        ".footer__img",
        footerClockItem
      );
      const temperatureFooter = safetyQuerySelector<HTMLElement>(
        ".footer__temperature",
        footerClockItem
      );

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
