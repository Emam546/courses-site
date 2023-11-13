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
import {
    ErrorMessageCom,
    PageNotExisted,
} from "@/components/handelErrorMessage";
import MinShower, { ItemType } from "@/components/common/itemsShower/min";

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
            <section className="course-section spad tw-pb-20 tw-min-h-[20rem]">
                <div className="course-wrap">
                    {lessons.length > 0 ? (
                        <MinShower
                            items={lessons.map((val) => ({
                                desc: val.briefDesc,
                                ...val,
                                link: `/lessons?id=${val.id}`,
                            }))}
                        />
                    ) : (
                        <p className="tw-text-lg tw-text-center tw-px-2">
                            There is no lessons so far
                        </p>
                    )}
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
    if (typeof id != "string") return <PageNotExisted />;
    if (queryCourse.error || queryLessons.error)
        return (
            <ErrorMessageCom error={queryCourse.error || queryLessons.error} />
        );
    if (queryCourse.isLoading || queryLessons.isLoading) return <Loader />;

    return (
        <Page
            course={queryCourse.data.course}
            lessons={queryLessons.data.lessons}
        />
    );
}
