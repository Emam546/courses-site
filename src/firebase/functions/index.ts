import { httpsCallable } from "@firebase/functions";
import { functions } from "..";
import type { RegisterRequestData, RegisterResponseData } from "@func/teacher";
import type {
    RegisterRequestData as StudentRegisterRequestData,
    RegisterResponseData as StudentRegisterResponseData,
} from "@func/student";
export const createTeacherCall = httpsCallable<
    RegisterRequestData,
    RegisterResponseData
>(functions, "registerTeacher");
export const createStudentCall = httpsCallable<
    StudentRegisterRequestData,
    StudentRegisterResponseData
>(functions, "createStudent");
