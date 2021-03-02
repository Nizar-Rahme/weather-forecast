import startOfToday from 'date-fns/startOfToday';
import startOfDay from 'date-fns/startOfDay';
import addMinutes from 'date-fns/addMinutes';

export const startOfTodayUTC = () => {
  const today = new Date();
  const timezoneOffset = -today.getTimezoneOffset();

  return addMinutes(startOfToday(), timezoneOffset);
};

export const startOfDayUTC = (date: Date) => {
  const today = new Date();
  const timezoneOffset = -today.getTimezoneOffset();

  return addMinutes(startOfDay(date), timezoneOffset);
};
