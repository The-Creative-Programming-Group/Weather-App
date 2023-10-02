import { observable } from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { ICity } from "~/types";

// See Legend Documentation for more information about the state management
// If you want more information stored in the state, you can change the input into an object
export const activeCity$ = observable<ICity>({
  id: 1,
  name: "",
  coord: { lat: 0, lon: 0 },
  state: "",
  country: "",
});

persistObservable(activeCity$, {
  local: "activeCity",
  persistLocal: ObservablePersistLocalStorage,
});

export const addedCities$ = observable<ICity[]>([]);

persistObservable(addedCities$, {
  local: "addedCities",
  persistLocal: ObservablePersistLocalStorage,
});

export type TemperatureUnitType = "Celsius" | "Fahrenheit";

export const temperatureUnit$ = observable<TemperatureUnitType>("Celsius");

persistObservable(temperatureUnit$, {
  local: "temperatureUnit",
  persistLocal: ObservablePersistLocalStorage,
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

persistObservable(windSpeedUnit$, {
  local: "windSpeedUnit",
  persistLocal: ObservablePersistLocalStorage,
});
