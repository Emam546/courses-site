import { UserType } from "@/firebase/func/data/student";
import { createSlice } from "@reduxjs/toolkit";

export interface StateType {
    user?: UserType;
}
export const slice = createSlice({
    initialState: {} as StateType,
    name: "auth",
    reducers: {
        setUser(state, action: { payload: StateType["user"] }) {
            state.user = action.payload;
        },
    },
});
export const AuthActions = slice.actions;
