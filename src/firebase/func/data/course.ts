import axios from "axios";
import { createRequestUrl } from "..";

export type CourseLevelType = {
    id: string;
    studentNum: number;
    name: string;
    desc: string;
    publishedAt: string;
    featured: boolean;
    price: DataBase["Courses"]["price"];
};
export type CourseType = {
    id: string;
    name: string;
    desc: string;
    publishedAt: string;
    featured: boolean;
    price: DataBase["Courses"]["price"];
};
export function getLevelCourses(levelId: string) {
    return axios.get<
        ResponseData<{
            courses: Array<CourseLevelType>;
        }>
    >(createRequestUrl("getData/api/level/courses"), {
        params: { levelId },
    });
}
export function getCourse(courseId: string) {
    return axios.get<
        ResponseData<{
            course: CourseType;
        }>
    >(createRequestUrl("getData/api/course"), {
        params: { courseId },
    });
}
