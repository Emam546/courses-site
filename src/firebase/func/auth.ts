import { wrapRequest } from "@/utils/wrapRequest";
import { instance } from ".";

export const createStudentCall = async (data: {
    displayName: string;
    email: string;
    password: string;
    teacherId: string;
    phone: DataBase["Students"]["phone"];
    levelId: string;
}) => {
    const loc = window.location;
    return await wrapRequest(
        instance.post<ResponseData<null>>("getData/api/auth/sing-up", {
            ...data,
            redirectUrl: `${loc.origin}/verify`,
        })
    );
};
export interface LoginResult {
    user: DataBase.WithIdType<DataBase["Students"]>;
    firebaseToken: string;
}
export const SingInStudentCall = async (data: {
    email: string;
    password: string;
    teacherId: string;
}) => {
    return await wrapRequest(
        instance.post<ResponseData<LoginResult>>("getData/api/auth/login", data)
    );
};
