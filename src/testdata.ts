export interface ICity {
  name: string;
  population: number;
  coordinates: {
    lat: number;
    lon: number;
  };
}

// Only for testing, later it will be fetched from an API.
export const cities: ICity[] = [
  {
    name: "Berlin",
    population: 3755251,
    coordinates: { lat: 52.52, lon: 13.405 },
  },
  {
    name: "Dresden",
    population: 563311,
    coordinates: { lat: 51.0504, lon: 13.7373 },
  },
  {
    name: "Dortmund",
    population: 593317,
    coordinates: { lat: 51.507, lon: 7.4667 },
  },
  {
    name: "Dessau",
    population: 79655,
    coordinates: { lat: 51.8408, lon: 12.2299 },
  },
  {
    name: "Döbeln",
    population: 24000,
    coordinates: { lat: 51.121, lon: 13.1146 },
  },
  {
    name: "Prag",
    population: 1300000,
    coordinates: { lat: 50.0755, lon: 14.4378 },
  },
  {
    name: "Hamburg",
    population: 1841179,
    coordinates: { lat: 53.5511, lon: 9.9937 },
  },
  {
    name: "New York",
    population: 8537673,
    coordinates: {
      lat: 40.7128,
      lon: -74.006,
    },
  },
  {
    name: "Los Angeles",
    population: 3977683,
    coordinates: {
      lat: 34.0522,
      lon: -118.2437,
    },
  },
  {
    name: "Chicago",
    population: 2695598,
    coordinates: {
      lat: 41.8781,
      lon: -87.6298,
    },
  },
  {
    name: "San Francisco",
    population: 883305,
    coordinates: {
      lat: 37.7749,
      lon: -122.4194,
    },
  },
  {
    name: "London",
    population: 8908081,
    coordinates: {
      lat: 51.5074,
      lon: -0.1278,
    },
  },
  {
    name: "Tokyo",
    population: 13929286,
    coordinates: {
      lat: 35.6895,
      lon: 139.6917,
    },
  },
  {
    name: "Sydney",
    population: 5312163,
    coordinates: {
      lat: -33.8688,
      lon: 151.2093,
    },
  },
  {
    name: "Mumbai",
    population: 12442373,
    coordinates: {
      lat: 19.076,
      lon: 72.8777,
    },
  },
];
