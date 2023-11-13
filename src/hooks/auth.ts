import { logout } from "@/firebase/func/auth";
import { AuthActions, StateType } from "@/store/auth";
import { useDispatch } from "react-redux";

export function useLogOut() {
    const dispatch = useDispatch();

    return async () => {
        await logout();
        dispatch(AuthActions.setUser(undefined));
    };
}
export function useLogIn() {
    const dispatch = useDispatch();

    return (user: NonNullable<StateType["user"]>) => {
        dispatch(AuthActions.setUser(user));
    };
}
