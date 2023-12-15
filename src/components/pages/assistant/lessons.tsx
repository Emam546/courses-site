import { CardTitle, MainCard } from "@/components/card";
import { TeacherComp } from "../lessons/assistants/info";
import Link from "next/link";
export type T = DataBase.WithIdType<DataBase["Lessons"]>;

interface ItemData {
    course: DataBase.WithIdType<DataBase["Courses"]>;
    lessons: DataBase.WithIdType<DataBase["Lessons"]>[];
}

export interface Props {
    teachers: {
        teacher: DataBase.WithIdType<DataBase["Teacher"]>;
        data: ItemData[];
    }[];
}
export default function CoursesLessonsInfoGetter({ teachers }: Props) {
    return (
        <>
            {teachers.length > 0 &&
                teachers.map(({ teacher, data }) => {
                    return (
                        <div key={teacher.id}>
                            <TeacherComp user={teacher} />
                            {data.map(({ course, lessons }) => {
                                return (
                                    <div key={course.id}>
                                        <CardTitle className="fw-semibold mb-1">
                                            {course.name}
                                        </CardTitle>
                                        <div className="tw-pl-3 tw-space-y-3">
                                            {lessons.map((lesson) => {
                                                return (
                                                    <Link
                                                        href={`/assistant/lessons?id=${lesson.id}`}
                                                        key={lesson.id}
                                                        className="tw-text-base"
                                                    >
                                                        <>
                                                            {lesson.name}
                                                        </>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            {teachers.length == 0 && (
                <p className="tw-m-0">
                    There is no Lessons so far please you have been added to
                </p>
            )}
        </>
    );
}
