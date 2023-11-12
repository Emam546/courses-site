import { instance } from "..";

export type ResultsExamsType = DataBase.KeyToString<
    DataBase.WithIdType<
        Omit<DataBase["Results"], "examId" | "userId" | "teacherId">
    >,
    "startAt" | "endAt"
>;
export type ResultType = DataBase.KeyToString<
    DataBase.WithIdType<DataBase["Results"]>,
    "startAt" | "endAt"
>;
export function getResultsExam(examId: string) {
    return instance.get<
        ResponseData<{
            results: Array<ResultsExamsType>;
        }>
    >("getData/api/exam/results", {
        params: { examId },
    });
}
export function getResult(resultId: string) {
    return instance.get<
        ResponseData<{
            result: ResultType;
        }>
    >("getData/api/result", {
        params: { resultId },
    });
}
export function sendAnswers(resultId: string, body: unknown) {
    return instance.post<
        ResponseData<{
            result: ResultType;
        }>
    >("getData/api/result", body, {
        params: { resultId },
    });
}
export function endExam(resultId: string) {
    return instance.post<ResponseData<unknown>>(
        "getData/api/result/end",
        {},
        {
            params: { resultId },
        }
    );
}
export function createResult(examId: string) {
    return instance.post<
        ResponseData<{
            result: ResultType;
        }>
    >("getData/api/exam/create", null, { params: { examId } });
}
