import isSameDay from 'date-fns/isSameDay';
import { startOfDayUTC } from '../../utils/date.utils';
import { Forecast } from '../schemas/forecast.schema';
import { ForecastData } from '../interfaces/forecast-data.interface';

export const normalizeForecastData = (data: ForecastData) => {
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
