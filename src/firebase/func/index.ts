import { functions } from "@/firebase";
import axios from "axios";

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
