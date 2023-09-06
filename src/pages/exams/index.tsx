import Page404 from "@/components/pages/404";
import { ResultsViewer } from "@/components/pages/exam";
import LoadingArea from "@/components/pages/loading";
import { PaymentProtector } from "@/components/pages/payment";
import { DataBase } from "@/data";
import { getDocRef } from "@/firebase";
import { useGetDoc } from "@/hooks/firebase";
import { useQuery } from "@tanstack/react-query";
import { QueryDocumentSnapshot, getDoc } from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";

function SafeArea({ doc }: { doc: QueryDocumentSnapshot<DataBase["Exams"]> }) {
    return (
        <>
            <Head>
                <title>{doc.data().name}</title>
            </Head>
            <div>
                <div className="home">
                    <div className="home_background_container prlx_parent">
                        <div
                            className="home_background prlx"
                            style={{
                                backgroundImage:
                                    "url(images/backgrounds/1.jpg)",
                            }}
                        />
                    </div>
                    <div className="home_content">
                        <h1>Exam</h1>
                    </div>
                </div>
                <main className="tw-pt-8 tw-pb-16 lg:tw-pt-16 lg:tw-pb-24 tw-bg-white dark:tw-bg-gray-900 tw-antialiased">
                    <div className="tw-flex tw-justify-between tw-px-4 tw-mx-auto tw-max-w-screen-xl ">
                        <article className="tw-mx-auto tw-w-full tw-max-w-2xl tw-format tw-format-sm sm:format-base lg:tw-format-lg tw-format-blue dark:tw-format-invert">
                            <header className="tw-mb-4 lg:tw-mb-6 tw-not-format">
                                <h1 className="tw-mb-4 tw-text-3xl tw-font-extrabold tw-leading-tight tw-text-gray-900 lg:tw-mb-6 lg:tw-text-4xl dark:tw-text-white">
                                    {doc.data().name}
                                </h1>
                            </header>
                            <p className="lead">{doc.data().desc}</p>
                            <div>
                                <ResultsViewer doc={doc} />
                            </div>
                        </article>
                    </div>
                </main>
            </div>
        </>
    );
}
function useGetExamCourse(examId: string) {
    return useQuery({
        enabled: typeof examId == "string",
        queryKey: ["Courses", "lessonId", "examId", examId],
        queryFn: async () => {
            const exam = await getDoc(getDocRef("Exams", examId));
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
    const queryCourse = useGetExamCourse(id as string);
    if (typeof id != "string")
        return <Page404 message="The Lesson id is not exist" />;
    if (queryExam.isLoading) return <LoadingArea />;
    if (queryExam.isError) return null;
    if (!queryExam.data.exists())
        return <Page404 message="The Lesson is not exist" />;
    if (queryCourse.isLoading) return <LoadingArea />;
    if (queryCourse.isError) return null;
    if (!queryCourse.data.exists())
        return <Page404 message="The Course is not exist" />;

    return (
        <PaymentProtector course={queryCourse.data}>
            <SafeArea doc={queryExam.data} />
        </PaymentProtector>
    );
}
export default function Page() {
    return (
        <>
            <Head>
                
                <link
                    rel="stylesheet"
                    type="text/css"
                    href="styles/elements_styles.css"
                />
                <link
                    rel="stylesheet"
                    type="text/css"
                    href="styles/elements_responsive.css"
                />
            </Head>
            <Main />
        </>
    );
}
