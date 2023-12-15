import { createSlice } from "@reduxjs/toolkit";

export interface StateType {
    user?:
        | (Omit<
              DataBase.TimeStampToString<
                  DataBase.WithIdType<DataBase["Teacher"]>
              >,
              "blocked"
          > & {
              blocked: {
                  at: string;
                  teacherId: string;
              } | null;
          })
        | null;
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
