import ErrorShower from "@/components/error";
import Loader from "@/components/loader";
import Page404 from "@/components/pages/404";
import { ResultsViewer } from "@/components/pages/exams";
import { PaymentProtector } from "@/components/payment";
import { DataBase } from "@/data";
import { getDocRef } from "@/firebase";
import { useGetDoc } from "@/hooks/firebase";
import { useQuery } from "@tanstack/react-query";
import { QueryDocumentSnapshot, getDoc } from "firebase/firestore";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

function SafeArea({
    doc,
    lessons,
    course,
}: {
    doc: QueryDocumentSnapshot<DataBase["Exams"]>;
    lessons: QueryDocumentSnapshot<DataBase["Lessons"]>;
    course: QueryDocumentSnapshot<DataBase["Courses"]>;
}) {
    return (
        <>
            <Head>
                <title>{doc.data().name}</title>
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
                            {course.data().name}
                        </Link>
                        <Link href={`/lessons?id=${lessons.id}`}>
                            {lessons.data().name}
                        </Link>
                        <span>{doc.data().name}</span>
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
                                <p>{doc.data().desc}</p>
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
export function useGetExamCourse(examId?: string) {
    return useQuery({
        enabled: typeof examId == "string",
        queryKey: ["Courses", "lessonId", "examId", examId],
        queryFn: async () => {
            const exam = await getDoc(getDocRef("Exams", examId!));
            const lesson = await getDoc(
                getDocRef("Lessons", exam.data()!.lessonId)
            );
            return await getDoc(getDocRef("Courses", lesson.data()!.courseId));
        },
    });
}
function Main() {
    const router = useRouter();
    const { id } = router.query;
    const queryExam = useGetDoc("Exams", id as string);
    const queryLesson = useGetDoc("Lessons", queryExam.data?.data()?.lessonId);
    const queryCourse = useGetDoc(
        "Courses",
        queryLesson.data?.data()?.courseId
    );
    if (typeof id != "string")
        return <Page404 message="The Exam id is not exist in the url" />;
    if (queryExam.isLoading) return <Loader />;
    if (queryExam.isError) return <ErrorShower err={queryExam.error} />;
    if (!queryExam.data.exists())
        return <Page404 message="The Exam is not exist" />;
    if (queryLesson.isLoading) return <Loader />;
    if (queryLesson.isError) return <ErrorShower err={queryExam.error} />;
    if (!queryLesson.data.exists())
        return <Page404 message="The Lesson is not exist" />;
    if (queryCourse.isLoading) return <Loader />;
    if (queryCourse.isError) return <ErrorShower err={queryCourse.error} />;
    if (!queryCourse.data.exists())
        return <Page404 message="The Course is not exist" />;

    return (
        <PaymentProtector course={queryCourse.data}>
            <SafeArea
                lessons={queryLesson.data}
                doc={queryExam.data}
                course={queryCourse.data}
            />
        </PaymentProtector>
    );
}
export default function Page() {
    return <Main />;
}
