import axios from "axios";
import { createRequestUrl } from "..";

export type ResultsExamsType = DataBase.WithIdType<{
    questions: Array<{
        questionId: string;
        state: "visited" | "unvisited" | "marked";
        answer?: string;
        correctAnswer?: string;
        correctState?: boolean;
    }>;
    startAt: string;
    endAt?: string;
}>;
export type ResultType = DataBase.WithIdType<
    ResultsExamsType & {
        examId: string;
        userId: string;
        courseId: string;
        endAt: string | null;
        startAt: string;
    }
>;
export function getResultsExam(examId: string) {
    return axios.get<
        ResponseData<{
            results: Array<ResultsExamsType>;
        }>
    >(createRequestUrl("getData/api/exam/results"), {
        params: { examId },
    });
}
export function getResult(resultId: string) {
    return axios.get<
        ResponseData<{
            result: ResultType;
        }>
    >(createRequestUrl("getData/api/result"), {
        params: { resultId },
    });
}
export function sendAnswers(resultId: string, body: unknown) {
    return axios.post<
        ResponseData<{
            result: ResultType;
        }>
    >(createRequestUrl("getData/api/result"), body, {
        params: { resultId },
    });
}
export function endExam(resultId: string) {
    return axios.post<ResponseData<unknown>>(
        createRequestUrl("getData/api/result/end"),
        {},
        {
            params: { resultId },
        }
    );
}
export function createResult() {
    return axios.post<
        ResponseData<{
            result: ResultType;
        }>
    >(createRequestUrl("getData/api/exam/create"));
}
