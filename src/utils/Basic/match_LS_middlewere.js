const PERSIST_ACTIONS = new Set([
   "match/setTeams",
   "match/setOvers",
   "match/updateScore",
]);

export const persistMatchMiddleware =
   store => next => action => {

      next(action);

      const state = store.getState();

      if (action.type === "match/resetMatch") {
         localStorage.removeItem("match");
         return;
      }

      if (!state.match.flags.shouldPersistmatch) return;

      localStorage.setItem(
         "match",
         JSON.stringify(state.match)
      );
   };