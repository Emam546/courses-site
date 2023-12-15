import { instance } from "..";
import { VideoDetails as OrgVideoDetails, videoInfo } from "ytdl-core";

export type LessonCourseType = {
    id: string;
    name: string;
    briefDesc: string;
    publishedAt: string;
};
export type VideoDetails = videoInfo | null;
export type LessonType = DataBase.WithIdType<
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
export function getLessonVideo(lessonId: string) {
    return instance.get<
        ResponseData<{
            video: VideoDetails;
        }>
    >("getData/api/lesson/video", {
        params: { lessonId },
    });
}
