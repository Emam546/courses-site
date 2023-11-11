import { instance } from "..";

export type CourseLevelType = DataBase.KeyToString<
    DataBase.DataBase.WithIdType<
        Omit<DataBase["Courses"], "teacherId" | "levelId" | "createdAt">
    >,
    "publishedAt"
> & { studentNum: number };

export type CourseType = CourseLevelType;
export function getLevelCourses(levelId: string) {
    return instance.get<
        ResponseData<{
            courses: Array<CourseLevelType>;
        }>
    >("getData/api/level/courses", {
        params: { levelId },
    });
}
export function getCourse(courseId: string) {
    return instance.get<
        ResponseData<{
            course: CourseType;
        }>
    >("getData/api/course", {
        params: { courseId },
    });
}
