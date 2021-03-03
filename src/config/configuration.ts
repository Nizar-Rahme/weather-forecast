export const configuration = () => ({
  forecastAPI: {
    url: process.env.API_URL,
    key: process.env.API_KEY,
  },
  database: {
    uri: `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASS}@${process.env.MONGODB_URI}`,
  },
  config: {
    cities: process.env.CITIES.split('|').map((city) => city.split(',')),
    interval: Number(process.env.INTERVAL),
    lowTempLimit: Number(process.env.MIN_TEMP),
  },
});
