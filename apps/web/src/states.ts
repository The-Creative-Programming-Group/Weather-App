import { observable } from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";

import type { ICity } from "@weatherio/types";

// See Legend Documentation for more information about the state management
// If you want more information stored in the state, you can change the input into an object
export const activeCity$ = observable<ICity>({
  id: 1,
  name: "",
  coord: { lat: 0, lon: 0 },
  region: "",
  country: "",
});

persistObservable<ICity>(activeCity$, {
  local: "activeCity",
  pluginLocal: ObservablePersistLocalStorage,
});

export const addedCities$ = observable<ICity[]>([]);

persistObservable<ICity[]>(addedCities$, {
  local: "addedCities",
  pluginLocal: ObservablePersistLocalStorage,
});

export type TemperatureUnitType = "Celsius" | "Fahrenheit";

export const temperatureUnit$ = observable<TemperatureUnitType>("Celsius");

persistObservable<TemperatureUnitType>(temperatureUnit$, {
  local: "temperatureUnit",
  pluginLocal: ObservablePersistLocalStorage,
});

export type WindSpeedUnitType =
  | "miles per hour"
  | "kilometers per hour"
  | "knots"
  | "meters per second"
  | "beaufort";

export const windSpeedUnit$ = observable<WindSpeedUnitType>(
  "kilometers per hour",
);

persistObservable<WindSpeedUnitType>(windSpeedUnit$, {
  local: "windSpeedUnit",
  pluginLocal: ObservablePersistLocalStorage,
});
