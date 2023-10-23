/* eslint-disable jsx-a11y/alt-text */
import Loader from "@/components/loader";
import Page404 from "@/components/pages/404";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import draftToHtml from "draftjs-to-html";
import { useQuery } from "@tanstack/react-query";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LessonType, getLesson } from "@/firebase/func/data/lessons";
import { CourseType } from "@/firebase/func/data/course";
import { useGetCourse } from "./courses";
import { ExamsLessonType, getExamLesson } from "@/firebase/func/data/exam";
import { WrapElem } from "@/components/pages/account/common/inputs/styles";
import { ErrorMessage, wrapRequest } from "@/utils/wrapRequest";
import { ErrorMessageCom } from "@/components/handelErrorMessage";

function Page({
    doc,
    course,
    exams,
}: {
    doc: LessonType;
    course: CourseType;
    exams: ExamsLessonType[];
}) {
    return (
        <>
            <Head>
                <title>{doc.name}</title>
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
                        <Link href={`/courses?id=${course.id}`}>
                            {course.name}
                        </Link>
                        <span>{doc.name}</span>
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
            <section className="single-course spad tw-pb-20">
                <div className="container">
                    <img
                        src="img/courses/single.jpg"
                        className="course-preview"
                    />
                    <div className="row">
                        <div className="col-lg-10 offset-lg-1 course-list">
                            <div className="cl-item">
                                <h2 className="tw-font-medium tw-text-4xl tw-mb-6">
                                    Course Description
                                </h2>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: draftToHtml(
                                            JSON.parse(doc.desc)
                                        ),
                                    }}
                                ></div>
                            </div>
                        </div>
                        <div className="col-lg-10 offset-lg-1">
                            <h1 className="tw-text-5xl tw-mb-6">Exams</h1>
                            <div className="tw-space-y-5">
                                {exams.map((doc) => {
                                    return (
                                        <Link
                                            key={doc.id}
                                            href={`/exams?id=${doc.id}`}
                                            className="site-btn tw-text-start tw-px-10 tw-py-3 tw-flex tw-items-center"
                                        >
                                            <p className="tw-flex-1 tw-text-white tw-text-lg tw-font-semibold">
                                                {doc.name}
                                            </p>
                                            <div>
                                                <FontAwesomeIcon
                                                    className="tw-text-lg"
                                                    icon={faArrowRight}
                                                />
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
export function useGetExams(lessonId: string) {
    return useQuery({
        queryKey: ["Exams", "lessonId", lessonId],
        enabled: typeof lessonId == "string",
        queryFn: async () => {
            return await wrapRequest(getExamLesson(lessonId));
        },
        onError(err: ErrorMessage) {},
    });
}
export function useGetLesson(lessonId?: string) {
    return useQuery({
        queryKey: ["Lessons", lessonId],
        queryFn: async () => {
            return await wrapRequest(getLesson(lessonId!));
        },
        enabled: typeof lessonId == "string",
        onError(err: ErrorMessage) {},
    });
}
export default function SafeArea() {
    const router = useRouter();
    const { id } = router.query;

    const queryLesson = useGetLesson(id as string);
    const queryExams = useGetExams(id as string);
    const queryCourse = useGetCourse(queryLesson.data?.lesson.courseId);
    if (typeof id != "string")
        return <Page404 message="The Lesson id is not exist" />;
    if (queryLesson.isLoading || queryCourse.isLoading || queryExams.isLoading)
        return <Loader />;
    if (queryLesson.error || queryCourse.error || queryExams.error)
        return (
            <ErrorMessageCom
                error={
                    queryLesson.error || queryCourse.error || queryExams.error
                }
            />
        );

    return (
        <Page
            exams={queryExams.data.exams}
            course={queryCourse.data.course}
            doc={queryLesson.data.lesson}
        />
    );
}
