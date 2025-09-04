const heroTemplate = document.querySelector("hero__template").content;
const heroWeatherWrapper = heroTemplate.querySelector("hero__weather-wrapper");

// function htmlElementGuard(element: DocumentFragment | HTMLElement): element is HTMLElement {
//     if (element instanceof HTMLElement) return true

//     return false
// }

type MainWeatherRenderData = {
  temperature: number;
  imageOfSkyUrl: string;
  humidity: number;
};

class MainWeather {
  private parent: HTMLElement;
  heroTemplate: HTMLElement;

  constructor(parent: HTMLElement) {
    this.parent = parent;
    //   const content =
    //     document.querySelector<HTMLTemplateElement>("hero__template")!.content;

    //   if (!(content instanceof HTMLElement)) {
    //     throw new Error();
    //   }

    //   this.heroTemplate = content as HTMLElement;
  }

  render(weatherData: MainWeatherRenderData) {
    const content = `
    <div class="hero__weather-wrapper">
      <div class="hero__box">
        <div class="hero__location-box">
          <p class="hero__location"></p>
          <p class="hero__date"></p>
        </div>
        <div class="hero__temperature-box">
          <p class="hero__temperature">${weatherData.temperature}</p>
          <img src="${weatherData.imageOfSkyUrl}" alt="">
        </div>
      </div>
      <ul class="hero__list">
        <li class="hero__item">
          <p class="hero__weather-data"></p>
          <p class="hero__weather-parameter">
            <span class="hero__humidity">${weatherData.humidity}</span>
            %
          </p>
        </li>
        <li class="hero__item">
          <p class="hero__weather-data"></p>
          <p class="hero__weather-parameter">
            <span class="hero__mileage"></span>
            км
          </p>
        </li>
        <li class="hero__item">
          <p class="hero__weather-data"></p>
          <p class="hero__weather-parameter">
            <span class="hero__pressure"></span>
            мм рт. ст.
          </p>
        </li>
        <li class="hero__item">
          <p class="hero__weather-data"></p>
          <p class="hero__weather-parameter">
            <span class="hero__speed"></span>
            м/с
          </p>
        </li>
      </ul>
    </div>`;

    this.parent.innerHTML = content;
  }
}

const mainWeather = new MainWeather(document.body);

function mapFromDTOtoMainWeather(data: WeatherDTO): MainWeatherRenderData {
  return {
    humidity: data.current.humidity,
    imageOfSkyUrl: data.current.condition.icon,
    temperature: data.current.temp_c,
  };
}

mainWeather.render(mapFromDTOtoMainWeather(data));

type WeatherDTO = {
  location: {
    name: "London";
    region: "City of London, Greater London";
    country: "United Kingdom";
    lat: 51.5171;
    lon: -0.1062;
    tz_id: "Europe/London";
    localtime_epoch: 1756892561;
    localtime: "2025-09-03 10:42";
  };
  current: {
    last_updated_epoch: 1756891800;
    last_updated: "2025-09-03 10:30";
    temp_c: 20.3;
    temp_f: 68.5;
    is_day: 1;
    condition: {
      text: "Partly cloudy";
      icon: "//cdn.weatherapi.com/weather/64x64/day/116.png";
      code: 1003;
    };
    wind_mph: 21.7;
    wind_kph: 34.9;
    wind_degree: 210;
    wind_dir: "SSW";
    pressure_mb: 995.0;
    pressure_in: 29.38;
    precip_mm: 0.36;
    precip_in: 0.01;
    humidity: 78;
    cloud: 50;
    feelslike_c: 20.3;
    feelslike_f: 68.5;
    windchill_c: 17.5;
    windchill_f: 63.5;
    heatindex_c: 17.5;
    heatindex_f: 63.5;
    dewpoint_c: 14.9;
    dewpoint_f: 58.9;
    vis_km: 10.0;
    vis_miles: 6.0;
    uv: 1.1;
    gust_mph: 31.5;
    gust_kph: 50.7;
    short_rad: 98.04;
    diff_rad: 55.4;
    dni: 104.04;
    gti: 50.03;
  };
};
