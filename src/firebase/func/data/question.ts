import { instance } from "..";
export type QuestionType = DataBase.DataBase.WithIdType<
    Omit<DataBase["Questions"], "answer" | "shuffle"> & {
        searchId: string;
    }
>;

export function getQuestion(questionId: string) {
    return instance.get<
        ResponseData<{
            question: QuestionType;
        }>
    >("getData/api/question", {
        params: { questionId },
    });
}
