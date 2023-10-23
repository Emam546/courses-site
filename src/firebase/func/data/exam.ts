import axios from "axios";
import { createRequestUrl } from "..";

export type ExamsLessonType = {
    id: string;
    name: string;
    desc: string;
    time: number;
    num: number;
    repeatable: boolean;
};
export type ExamType = DataBase.WithIdType<
    Exclude<DataBase["Exams"], "random" | "questionIds"> & {
        num: number;
    }
>;
export function getExamLesson(lessonId: string) {
    return axios.get<
        ResponseData<{
            exams: Array<ExamsLessonType>;
        }>
    >(createRequestUrl("getData/api/lesson/exams"), {
        params: { lessonId },
    });
}
export function getExam(examId: string) {
    return axios.get<
        ResponseData<{
            exam: ExamType;
        }>
    >(createRequestUrl("getData/api/exam"), {
        params: { examId },
    });
}
