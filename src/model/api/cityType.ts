export type CityNames = City[];

export type City = {
  name: string;
  local_names: {
    en: string;
    ru: string;
  };
  lat: number;
  lon: number;
  country: string;
  state: string;
};
