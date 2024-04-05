import { getQuestion } from "@/firebase/func/data/question";
import {
    ResultType,
    getResult,
    endExam,
    ResultsExamsType,
} from "@/firebase/func/data/results";
import queryClient from "@/queryClient";
import { wrapRequest, ErrorMessage } from "@/utils/wrapRequest";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export function useGetQuestion(questionId: string) {
    return useQuery({
        queryKey: ["Questions", questionId],
        queryFn: async () => {
            return await wrapRequest(getQuestion(questionId));
        },
    });
}
export function useGetResult(
    resultId?: string,
    options?: UseQueryOptions<{ result: ResultType }, ErrorMessage>
) {
    async function getData(): Promise<{ result: ResultType }> {
        const data = await wrapRequest(getResult(resultId!));
        const result = data.result;
        if (result.endAt) return data;
        const startAt = new Date(result.startAt);
        if (Date.now() - startAt.getTime() > result.time) {
            await endExam(resultId!);
            return await getData();
        }
        return data;
    }
    return useQuery({
        queryKey: ["Results", resultId],
        queryFn: getData,
        enabled: typeof resultId == "string",
        onError(err: ErrorMessage) {},
        ...options,
    });
}
export function setQuestionsResults(
    resultId: string,
    questions: ResultType["questions"]
) {
    const data = queryClient.getQueryData<ResultType>(["Results", resultId]);
    if (!data) return;
    console.log("updating", resultId);
    console.log(questions);
    queryClient.removeQueries(["Results", resultId]);
    queryClient.setQueryData<ResultType>(["Results", resultId], {
        ...data,
        questions,
    });
}
