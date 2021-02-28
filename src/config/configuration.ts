export const configuration = () => ({
  API_KEY: process.env.API_KEY,
  API_URL: process.env.API_URL,
  CITIES: process.env.CITIES,
  INTERVAL: process.env.INTERVAL,
  MIN_TEMP: process.env.MIN_TEMP,
  MONGODB_URI: process.env.MONGODB_URI,
});