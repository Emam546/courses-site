import { httpsCallable } from "@firebase/functions";
import { functions } from "@/firebase";
import axios from "axios";
export function createRequestUrl(name: string): string {
    return `https://${functions.customDomain}/${name}`;
}

export const createStudentCall = httpsCallable<
    {
        displayName: string;
        email: string;
        password: string;
        teacherId: string;
        phone: string;
        levelId: string;
    },
    ResponseData<{ token: string }>
>(functions, "registerStudent");

export const singUpStudentCall = httpsCallable<
    {
        email: string;
        password: string;
        teacherId: string;
    },
    ResponseData<{
        token: string;
        user: DataBase.WithIdType<DataBase["UsersTeachers"]>;
    }>
>(functions, "singUpStudent");
