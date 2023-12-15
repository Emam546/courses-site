import { Timestamp } from "firebase/firestore";

export type QuestionPaper = {
    id: string;
    quest: string;
    choices: Array<
        DataBase.WithOrder<
            DataBase.WithIdType<{
                textContext: string;
            }>
        >
    >;
    answer: string;
    shuffle: boolean;
    createdAt: Timestamp;
};
export interface ExamPaper {
    id: string;
    questions: QuestionPaper[];
    student?: {
        id: string;
        displayName: string;
    };
}
