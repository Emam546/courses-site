import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { slice } from "./auth";
// Define your state interface
export type RootState = ReturnType<typeof store.getState>; // Define your initial state here

const store = configureStore({
    reducer: {
        [slice.name]: slice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ["auth/setUser"],
                // Ignore these field paths in all actions
                ignoredActionPaths: ["auth"],
                // Ignore these paths in the state
                ignoredPaths: ["auth.user"],
            },
        }),
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch<AppDispatch>;
export const useAppSelector: TypedUseSelectorHook<RootState> =
    useSelector<RootState>;

export default store;
