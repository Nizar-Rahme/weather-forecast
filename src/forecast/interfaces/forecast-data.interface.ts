export interface ForecastData {
  city: {
    name: string;
    country: string;
  };
  list: [
    {
      main: {
        temp_min: number;
      };
      dt_txt: string;
    },
  ];
}
