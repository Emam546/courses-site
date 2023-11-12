import { instance } from "..";

export type ExamsLessonType = {
    id: string;
    name: string;
    desc: string;
    time: number;
    num: number;
    repeatable: boolean;
};

export type ExamType = DataBase.WithIdType<
    Omit<DataBase["Exams"], "random" | "questionIds"> & {
        num: number;
    }
>;
export function getExamLesson(lessonId: string) {
    return instance.get<
        ResponseData<{
            exams: Array<ExamsLessonType>;
        }>
    >("getData/api/lesson/exams", {
        params: { lessonId },
    });
}
export function getExam(examId: string) {
    return instance.get<
        ResponseData<{
            exam: ExamType;
        }>
    >("getData/api/exam", {
        params: { examId },
    });
}
