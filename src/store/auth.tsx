import { createSlice } from "@reduxjs/toolkit";
import { QueryDocumentSnapshot, Timestamp } from "firebase/firestore";

export interface StateType {
    user?: DataBase.DataBase.WithIdType<
        Omit<DataBase["Students"], "createdAt">
    >;
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
