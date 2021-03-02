import isSameDay from 'date-fns/isSameDay';
import { startOfDayUTC } from '../../utils/date.utils';
import { Forecast } from '../schemas/forecast.schema';

interface IForecast {
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

export const normalizeForecastData = (data: IForecast) => {
  return data.list.reduce<Pick<Forecast, 'date' | 'minTemp'>[]>(
    (prev, item) => {
      const dateUTC = startOfDayUTC(new Date(item.dt_txt));
      const weatherIndex = prev.findIndex(({ date }) =>
        isSameDay(date, dateUTC),
      );

      if (weatherIndex === -1)
        return [
          ...prev,
          {
            date: dateUTC,
            minTemp: item.main.temp_min,
          },
        ];

      return [
        ...prev.slice(0, weatherIndex),
        {
          date: dateUTC,
          minTemp:
            item.main.temp_min < prev[weatherIndex].minTemp
              ? item.main.temp_min
              : prev[weatherIndex].minTemp,
        },
        ...prev.slice(weatherIndex + 1),
      ];
    },
    [],
  );
};
