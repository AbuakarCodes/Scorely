
const PERSIST_ACTIONS = new Set([
   "match/setTeams",
   "match/setOvers",
   "match/updateScore",
]);

export const persistMatchMiddleware =
   store => next => action => {

      const state = store.getState();

      if (!state.match.flags.shouldPersistmatch) {
         next(action)
      }

      if (action.type === "match/resetMatch") {
         next(action)
      }
      
      localStorage.setItem(
         "match",
         JSON.stringify(state.match)
      );


      next(action)
   };