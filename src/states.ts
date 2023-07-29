import { observable } from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";

export const activeCity$ = observable({ name: "" });

persistObservable(activeCity$, {
  local: "activeCity",
  persistLocal: ObservablePersistLocalStorage,
});
