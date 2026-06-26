export const persistMatchMiddleware =
   store => next => action => {
      next(action);
      const state = store.getState();

      if (action.type === "match/resetMatch") {
         localStorage.removeItem("match");
         return;
      }

      if (!state?.match?.flags?.isIningsStarted) return;

      if (action.type.endsWith("/pending") || action.type.endsWith("/rejected")) return;

      localStorage.setItem("match", JSON.stringify(state.match));
   };