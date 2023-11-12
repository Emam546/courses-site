import { httpsCallable } from "@firebase/functions";
import { functions } from "@/firebase";
import axios, { HttpStatusCode } from "axios";
import { wrapRequest } from "@/utils/wrapRequest";

export function createRequestUrl(): string {
    if (functions.customDomain) return `https://${functions.customDomain}`;
    if (process.env.NODE_ENV == "development")
        return `http://localhost:5001/${functions.app.options.projectId}/${functions.region}`;
    return `https://${functions.region}-${functions.app.options.projectId}.cloudfunctions.net`;
}
export const instance = axios.create({
    baseURL: createRequestUrl(),
    withCredentials: true,
});

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
httpsCallable<{}, ResponseData<{ token: string }>>(
    functions,
    "registerStudent"
);
export const SingInStudentCall = async (data: {
    email: string;
    password: string;
    teacherId: string;
}) => {
    return await wrapRequest(
        instance.post<
            ResponseData<{
                user: DataBase.WithIdType<DataBase["Students"]>;
                firebaseToken: string;
            }>
        >("getData/api/auth/login", data)
    );
};
