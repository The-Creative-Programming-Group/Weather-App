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
