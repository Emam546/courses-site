import { AxiosError, AxiosResponse } from "axios";
import { objectValues } from ".";
export enum ErrorStates {
    UnPaidCourse = "unpaid Course",
    UnProvidedId = "UnProvided Id",
    UnAuthorized = "UnAuthorized",
    UnExistedDoc = "unExisted Document",
    HidedDoc = "UnAuthorized",
    InValidData = "InValidData",
    UnknownRequest = "unknownRequest",
}
export function CheckMessage(message: string): ErrorStates {
    const state = objectValues(ErrorStates).find((state) => state == message);
    if (state) return state;
    return ErrorStates.UnknownRequest;
}
export type ErrorMessage = { message: string; state: ErrorStates };

export function wrapRequest<T>(prom: Promise<AxiosResponse<ResponseData<T>>>) {
    return new Promise<T>((res, rej) => {
        prom.then((val) => {
            if (val.data.success) return res(val.data.data);
            const message = val?.data.msg;
            const errors = val?.data.err;
            if (message)
                rej({
                    message: message,
                    state: CheckMessage(message),
                    errors,
                });
            rej({
                message: "Unknown Error",
                state: ErrorStates.UnknownRequest,
                errors,
            });
        }).catch((err: AxiosError<FailType>) => {
            const message = err.response?.data.msg;
            const errors = err.response?.data.err;
            if (message)
                rej({
                    message: message,
                    state: CheckMessage(message),
                    errors,
                });
            rej({
                message: err.message,
                state: ErrorStates.UnknownRequest,
                errors,
            });
        });
    });
}
export function wrapRequestError<T>(
    prom: Promise<AxiosResponse<ResponseData<T>>>
) {
    return new Promise<T>((res, rej) => {
        prom.then((val) => {
            if (val.data.success) res(val.data.data);
        }).catch((err: AxiosError<ResponseData<T>>) => {
            const message = err.response?.data.msg;
            if (message)
                rej({
                    message: message,
                    state: CheckMessage(message),
                });
            rej({
                message: err.message,
                state: ErrorStates.UnknownRequest,
            });
        });
    });
}
