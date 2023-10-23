import axios from "axios";
import { createRequestUrl } from "..";
export type QuestionType = {
    quest: string;
    choices: Array<
        DataBase.WithOrder<
            DataBase.WithIdType<{
                textContext: string;
            }>
        >
    >;
    lessonId: string;
    courseId: string;
    creatorId: string;
};
export function getQuestion(questionId: string) {
    return axios.get<
        ResponseData<{
            question: QuestionType;
        }>
    >(createRequestUrl("getData/api/question"), {
        params: { questionId },
    });
}
