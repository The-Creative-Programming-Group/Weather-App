export interface IHourlyForecast {
  // Hour of current day
  time: number;
  // In Kelvin
  temperature: number | undefined;
  // In millimeters
  rain: number | undefined;
  // In millimeters
  showers: number | undefined;
  // In centimeters
  snowfall: number | undefined;
  // In percentages
  cloudcover: number | undefined;
}

export interface IDailyForecast {
  // Day of current week (starts with 0 (current day))
  date: Date;
  // In Kelvin day and night
  temperature: number | undefined;
  // In millimeters
  rain: number | undefined;
  // In millimeters
  showers: number | undefined;
  // In centimeters
  snowfall: number | undefined;
  // In percent
  cloudcover: number | undefined;
}
