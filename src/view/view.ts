import * as weatherType from "@/model/api/type.api";

const heroContainer = document.querySelector(".hero__weather-wrapper");

if (!(heroContainer instanceof HTMLElement)) {
  throw new Error("hero-Container не найден");
}

type WeatherIndicatorsByTime = {
  time: string;
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

  renderWeather(
    weatherData: weatherType.ForecastDayWeather,
    dateCurrent: string,
    temperature: number,
    unitMeasurement: string
  ) {
    const heroContent = `
      <div class="hero__box">
        <div class="hero__location-box">
          <p class="hero__location">${weatherData.location.name}</p>
          <p class="hero__date">${dateCurrent}</p>
        </div>
        <div class="hero__temperature-box">
          <p class="hero__temperature">${Math.round(
            temperature
          )}${unitMeasurement}</p>
          <img src="${weatherData.current.condition.icon}" alt="${
      weatherData.current.condition.text
    }">
        </div>
      </div>
      <ul class="hero__list">
        <li class="hero__item">
          <p class="hero__weather-data">Влажность</p>
          <p class="hero__weather-parameter">
            <span class="hero__humidity">${weatherData.current.humidity}</span>
            %
          </p>
        </li>
        <li class="hero__item">
          <p class="hero__weather-data">Видимость</p>
          <p class="hero__weather-parameter">
            <span class="hero__mileage">${weatherData.current.vis_km}</span>
            км
          </p>
        </li>
        <li class="hero__item">
          <p class="hero__weather-data">Осадки</p>
          <p class="hero__weather-parameter">
            <span class="hero__pressure">${weatherData.current.precip_mm}</span>
            мм.
          </p>
        </li>
        <li class="hero__item">
          <p class="hero__weather-data">Ветер</p>
          <p class="hero__weather-parameter">
            <span class="hero__speed">${Math.round(
              weatherData.current.wind_kph
            )}</span>
            м/с
          </p>
        </li>
      </ul>`;

    if (!(this.headerTime instanceof HTMLElement)) {
      throw new Error("headerTime не найден");
    }

    this.parent.innerHTML = heroContent;
    this.headerTime.innerHTML = weatherData.location.localtime.substring(
      16,
      10
    );

    this.renderFooter([]);
  }

  renderFooter(footerItems: WeatherIndicatorsByTime[]) {
    for (let i = 0; i < footerItems.length; i++) {
      const footerClockItem = this.itemTemplate?.cloneNode(true) as HTMLElement;
      const timeFooter = footerClockItem.querySelector(".footer__time")!;
      const imgUrlFooter =
        footerClockItem.querySelector<HTMLImageElement>(".footer__img")!;
      const temperatureFooter = footerClockItem.querySelector(
        ".footer__temperature"
      )!;

      timeFooter.textContent = String(footerItems[i].time);
      imgUrlFooter.src = footerItems[i].imgUrl;
      imgUrlFooter.alt = footerItems[i].imgText;
      temperatureFooter.textContent = String(footerItems[i].temperature);

      if (!(this.weatherClockList instanceof HTMLElement)) {
        throw new Error("weatherClockList не найден");
      }
      this.weatherClockList.appendChild(footerClockItem);
    }
  }
}

export const mainWeather = new MainWeather(heroContainer);
