
export const persistMatchMiddleware =
store => next => action => {

   const result = next(action);

   const state = store.getState();

   console.log({state: state.match})

   if (!state.match.flags.shouldPersistmatch) {
      return result;
   }

   localStorage.setItem(
      "match",
      JSON.stringify(state.match)
   );

   return result;
};