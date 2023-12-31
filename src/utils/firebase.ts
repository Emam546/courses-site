import { FirebaseError } from "firebase/app";
import {
    Auth,
    AuthErrorCodes,
    browserLocalPersistence,
    browserSessionPersistence,
    setPersistence,
} from "firebase/auth";
import { hasOwnProperty } from ".";
export function getErrorMessage(code: unknown) {
    switch (code) {
        case AuthErrorCodes.UNVERIFIED_EMAIL:
            return {
                type: "email",
                message: "Unverified Email",
            };
        case AuthErrorCodes.EMAIL_EXISTS:
            return {
                type: "email",
                message: "The email is exist",
            };
        case AuthErrorCodes.INVALID_PASSWORD:
            return {
                type: "password",
                message: "Wrong password",
            };
        case AuthErrorCodes.USER_DELETED:
            return {
                type: "email",
                message: "the email is not exist",
            };
        default:
            return null;
    }
}
export function isFireBaseError(err: unknown): err is FirebaseError {
    return hasOwnProperty(err, "code") || hasOwnProperty(err, "message");
}
export async function setRememberMeState(auth: Auth, state: boolean) {
    if (state) await setPersistence(auth, browserLocalPersistence);
    else await setPersistence(auth, browserSessionPersistence);
}
