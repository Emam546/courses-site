import { createSlice } from "@reduxjs/toolkit";
import { QueryDocumentSnapshot } from "firebase/firestore";
export interface StateType {
    user?: DataBase["UsersTeachers"];
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
