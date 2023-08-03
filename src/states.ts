import { observable } from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";

// See Legend Documentation for more information about the state management
// If you want more information stored in the state, you can change the input into an object
export const activeCity$ = observable("");

persistObservable(activeCity$, {
  local: "activeCity",
  persistLocal: ObservablePersistLocalStorage,
});

export const addedCities$ = observable<string[]>([]);

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
  | "Miles per hour"
  | "Kilometers per hour"
  | "Knots"
  | "Meters per second"
  | "Beaufort";

export const windSpeedUnit$ = observable<WindSpeedUnitType>("Miles per hour");

persistObservable(windSpeedUnit$, {
  local: "windSpeedUnit",
  persistLocal: ObservablePersistLocalStorage,
});
