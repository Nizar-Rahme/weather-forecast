## Description

**Weather forecast service**

The service exposes two API endpoints:

- `/v1/cities` returns a list of cities, predefined by the admin in a configuration file
- `/v1/cities/:id` returns the corresponding city

Both accept a query param `limit` for limiting the forecasted days in the response, e.g: `/v1/cities/:id`**`?limit=5`**

Example of the response:

```json
{
  "id": "603e45c0cf2c7cfe404cb0d9",
  "name": "Paris",
  "country": "FR",
  "lowTempLimit": 1,
  "forecast": [
    {
      "date": "2021-03-03T00:00:00.000Z",
      "minTemp": 7.94,
      "isLowExceeded": false
    },
    {
      "date": "2021-03-04T00:00:00.000Z",
      "minTemp": 7.51,
      "isLowExceeded": false
    },
    {
      "date": "2021-03-05T00:00:00.000Z",
      "minTemp": 3.04,
      "isLowExceeded": false
    },
    {
      "date": "2021-03-06T00:00:00.000Z",
      "minTemp": 0.92,
      "isLowExceeded": true
    },
    {
      "date": "2021-03-07T00:00:00.000Z",
      "minTemp": 0.91,
      "isLowExceeded": true
    }
  ]
}
```

- `lowTempLimit`: is the lower temperature limit specified by the admin in a configuration file
- `date`: the date when the weather is forecasted
- `minTemp`: the minimum temperature on the date in question
- `isLowExceeded`: a true or false value, indicating whether the temperature on that day exceeds `lowTempLimit`

Also the service supports `Healthchecks` by exposing `/health` endpoint to determine the status of the application.

## Configuration

1. Check that Docker and Docker CLI are installed

2. Copy the content of of `.env.example` to `.env` by running the following command:

```bash
cp .env.example .env
```

3. Obtain an API key from [OpenWeather](https://openweathermap.org/price)

4. Fill in the missing variables in `.env` file

**Note:** the application will not run if the values provided in `.env` don't match the described patterns in the `.env.example` file

## Installation

```bash
$ yarn
```

## Running the app

1. Make sure that the port `3000` is not already allocated

2. Run the following command after configuring the application properly

```bash
# watch mode
$ docker-compose up
```

3. From your browser go to http://localhost:3000/v1/cities to see the forecast of the specified cities in the next five days

   - Alternatively you can use [Postman](https://www.postman.com/downloads/) for testing the API

4. The service fetches from [Open Weather](https://openweathermap.org/forecast5) the forecast automatically when the interval specified in `.env` passes

## Test

```bash
# run tests
$ yarn test
```
