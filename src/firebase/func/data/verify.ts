import { instance } from "..";
import { LoginResult } from "../auth";

export function resendEmail() {
    return instance.get<ResponseData<null>>("getData/api/auth/resendEmail");
}
export function verifyEmail(token: string) {
    return instance.get<ResponseData<LoginResult>>(
        `getData/api/auth/verify/${token}`
    );
}
