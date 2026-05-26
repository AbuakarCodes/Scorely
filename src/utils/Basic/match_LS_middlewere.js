export const persistMatchMiddleware = store => next => action => {
    const result = next(action);

    const state = store.getState();

    localStorage.setItem(
        "match",
        JSON.stringify(state?.match?.match)
    );

    return result;
};