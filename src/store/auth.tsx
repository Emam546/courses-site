import { DataBase } from "@/data";
import { createSlice } from "@reduxjs/toolkit";
import { QueryDocumentSnapshot } from "firebase/firestore";
export interface StateType {
    user?: QueryDocumentSnapshot<DataBase["Users"]>;
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
