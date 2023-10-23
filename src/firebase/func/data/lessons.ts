import axios from "axios";
import { createRequestUrl } from "..";

export type LessonCourseType = {
    id: string;
    name: string;
    briefDesc: string;
    publishedAt: string;
};
export type LessonType = DataBase.WithIdType<
    Exclude<DataBase["Lessons"], "addersId">
>;
export function getCourseLessons(courseId: string) {
    return axios.get<
        ResponseData<{
            lessons: Array<LessonCourseType>;
        }>
    >(createRequestUrl("getData/api/course/lessons"), {
        params: { courseId },
    });
}
export function getLesson(lessonId: string) {
    return axios.get<
        ResponseData<{
            lesson: LessonType;
        }>
    >(createRequestUrl("getData/api/lesson"), {
        params: { lessonId },
    });
}
