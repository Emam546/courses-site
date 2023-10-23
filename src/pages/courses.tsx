import Loader from "@/components/loader";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Page404 from "@/components/pages/404";
import Head from "next/head";
import { useRouter } from "next/router";
import {
    getCourseLessons,
    LessonCourseType,
} from "@/firebase/func/data/lessons";
import { CourseType, getCourse } from "@/firebase/func/data/course";
import { ErrorMessage, wrapRequest } from "@/utils/wrapRequest";
import { ErrorMessageCom } from "@/components/handelErrorMessage";

function Lesson({ data, index }: { index: number; data: LessonCourseType }) {
    return (
        <div className="mix col-lg-3 col-md-4 col-sm-6 finance">
            <Link href={`/lessons?id=${data.id}`}>
                <div className="course-item">
                    <div
                        className="course-thumb"
                        style={{
                            backgroundImage: `url('img/courses/${
                                (index % 8) + 1
                            }.jpg')`,
                        }}
                    />
                    <div className="course-info">
                        <div className="course-text ">
                            <h5>{data.name}</h5>
                            <p>{data.briefDesc}</p>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export interface PageParams {
    doc: CourseType;
    lessons: LessonCourseType;
}
export function Page({
    course,
    lessons,
}: {
    course: CourseType;
    lessons: LessonCourseType[];
}) {
    return (
        <>
            <Head>
                <title>{course.name}</title>
            </Head>
            <div
                className="page-info-section"
                style={{
                    backgroundImage: "url('img/page-bg/1.jpg')",
                }}
            >
                <div className="container">
                    <div className="site-breadcrumb">
                        <Link href="/">Home</Link>
                        <span>{course.name}</span>
                    </div>
                </div>
            </div>
            <section className="search-section ss-other-page">
                <div className="container">
                    <div
                        className="search-warp tw-p-0"
                        style={{
                            padding: 0,
                        }}
                    >
                        <div className="section-title text-white">
                            <h2>
                                <span>Lessons</span>
                            </h2>
                        </div>
                    </div>
                </div>
            </section>

            {/* categories section */}
            <section className="course-section spad tw-pb-20">
                <div className="course-warp">
                    <div className="row course-items-area">
                        {lessons.map((data, i) => {
                            return (
                                <Lesson
                                    data={data}
                                    index={i}
                                    key={data.id}
                                />
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
}

export function useGetLessons(courseId: string) {
    return useQuery({
        queryKey: ["Lessons", "courseId", courseId],
        queryFn: async () => {
            return await wrapRequest(getCourseLessons(courseId));
        },
        onError(err: ErrorMessage) {},
    });
}
export function useGetCourse(courseId?: string) {
    return useQuery({
        queryKey: ["Courses", courseId],
        enabled: typeof courseId == "string",
        queryFn: async () => {
            return await wrapRequest(getCourse(courseId as string));
        },
        onError(err: ErrorMessage) {},
    });
}
export default function SafeArea() {
    const router = useRouter();
    const { id } = router.query;
    const queryCourse = useGetCourse(id as string);
    const queryLessons = useGetLessons(id as string);
    if (typeof id != "string")
        return <Page404 message="The Course id is not exist" />;
    if (queryCourse.isLoading || queryLessons.isLoading) return <Loader />;
    if (queryCourse.error || queryLessons.error)
        return (
            <ErrorMessageCom error={queryCourse.error || queryLessons.error} />
        );

    return (
        <Page
            course={queryCourse.data.course}
            lessons={queryLessons.data.lessons}
        />
    );
}
