import Loader from "@/components/loader";
import { ResultsViewer } from "@/components/pages/exams";
import { ExamType, getExam } from "@/firebase/func/data/exam";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useGetLesson } from "../lessons";
import { useGetCourse } from "../courses";
import { LessonType } from "@/firebase/func/data/lessons";
import { CourseType } from "@/firebase/func/data/course";
import { ErrorMessage, wrapRequest } from "@/utils/wrapRequest";
import {
    ErrorMessageCom,
    PageNotExisted,
} from "@/components/handelErrorMessage";
import { NextPageWithLayout } from "../_app";

function Page({
    doc,
    lesson,
    course,
}: {
    doc: ExamType;
    lesson: LessonType;
    course: CourseType;
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
                        <Link href={`/lessons?id=${lesson.id}`}>
                            {lesson.name}
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
                                <span>Exams</span>
                            </h2>
                        </div>
                    </div>
                </div>
            </section>
            <section className="single-course spad tw-pb-20">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 offset-lg-1 course-list">
                            <div className="cl-item">
                                <h2 className="tw-font-medium tw-text-4xl tw-mb-6">
                                    Exam Description
                                </h2>
                                <p>{doc.desc}</p>
                            </div>
                        </div>
                        <div className="col-lg-10 offset-lg-1">
                            <ResultsViewer doc={doc} />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
export function useGetExam(examId?: string) {
    return useQuery({
        queryKey: ["Exams", examId],
        enabled: typeof examId == "string",
        queryFn: async () => {
            return await wrapRequest(getExam(examId!));
        },
        onError(err: ErrorMessage) {},
    });
}
const SafeArea: NextPageWithLayout = () => {
    const router = useRouter();
    const { id } = router.query;
    const queryExam = useGetExam(id as string);
    const queryLesson = useGetLesson(queryExam.data?.exam.lessonId);
    const queryCourse = useGetCourse(queryExam.data?.exam.courseId);
    if (typeof id != "string") return <PageNotExisted />;
    if (queryExam.error || queryLesson.error || queryCourse.error)
        return (
            <ErrorMessageCom
                error={
                    queryExam.error || queryLesson.error || queryCourse.error
                }
            />
        );
    if (queryExam.isLoading || queryLesson.isLoading || queryCourse.isLoading)
        return <Loader />;

    return (
        <Page
            lesson={queryLesson.data.lesson}
            doc={queryExam.data.exam}
            course={queryCourse.data.course}
        />
    );
};
SafeArea.providerUser = true;
export default SafeArea;
