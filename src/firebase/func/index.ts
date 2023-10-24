import { httpsCallable } from "@firebase/functions";
import { functions } from "@/firebase";
import axios from "axios";
export function createRequestUrl(name: string): string {
    // console.log(functions.customDomain, functions.region,functions.app.options;
    if (functions.customDomain)
        return `https://${functions.customDomain}/${name}`;
    if (process.env.NODE_ENV == "development")
        return `http://localhost:5001/${functions.app.options.projectId}/${functions.region}/${name}`;
    return `https://${functions.region}-${functions.app.options.projectId}.cloudfunctions.net/${name}`;
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
