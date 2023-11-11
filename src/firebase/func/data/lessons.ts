import { instance } from "..";

export type LessonCourseType = {
    id: string;
    name: string;
    briefDesc: string;
    publishedAt: string;
};
export type LessonType = DataBase.DataBase.WithIdType<
    Exclude<DataBase["Lessons"], "addersId">
>;
export function getCourseLessons(courseId: string) {
    return instance.get<
        ResponseData<{
            lessons: Array<LessonCourseType>;
        }>
    >("getData/api/course/lessons", {
        params: { courseId },
    });
}
export function getLesson(lessonId: string) {
    return instance.get<
        ResponseData<{
            lesson: LessonType;
        }>
    >("getData/api/lesson", {
        params: { lessonId },
    });
}
