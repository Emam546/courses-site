import Page404 from "@/components/pages/404";
import LoadingArea from "@/components/pages/loading";
import { PaymentProtector } from "@/components/pages/payment";
import { DataBase } from "@/data";
import { createCollection } from "@/firebase";
import { useGetDoc } from "@/hooks/firebase";
import { useQuery } from "@tanstack/react-query";
import {
    QueryDocumentSnapshot,
    getDocs,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import draftToHtml from "draftjs-to-html";
import Link from "next/link";
export function useGetExams(lessonId: string) {
    return useQuery({
        queryKey: ["Exams", "lessonId", lessonId],
        queryFn: async () => {
            return await getDocs(
                query(
                    createCollection("Exams"),
                    where("lessonId", "==", lessonId),
                    where("hide", "==", false),
                    orderBy("order")
                )
            );
        },
    });
}
function ExamsViewer({ lessonId }: { lessonId: string }) {
    const { data: exams } = useGetExams(lessonId);
    return (
        <div className="tw-mt-9">
            <div className="elements_title">Exams</div>
            {exams && !exams.empty && (
                <>
                    <div className="elements_accordions tw-mt-3">
                        {exams?.docs.map((doc) => {
                            return (
                                <Link
                                    href={`/exams?id=${doc.id}`}
                                    key={doc.id}
                                    className="hover:tw-no-underline tw-text-inherit hover:tw-text-inherit"
                                >
                                    <div className="accordion_container">
                                        <div className="accordion d-flex flex-row align-items-center">
                                            {doc.data().name}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
function SafeArea({
    doc,
}: {
    doc: QueryDocumentSnapshot<DataBase["Lessons"]>;
}) {
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
                        <h1>Lesson</h1>
                    </div>
                </div>

                <main className="tw-pt-8 tw-pb-16 lg:tw-pt-16 lg:tw-pb-24 tw-bg-white dark:tw-bg-gray-900 tw-antialiased">
                    <div className="tw-flex tw-justify-between tw-px-4 tw-mx-auto tw-max-w-screen-xl ">
                        <article className="tw-mx-auto tw-w-full tw-max-w-2xl tw-format tw-format-sm sm:format-base lg:tw-format-lg tw-format-blue dark:tw-format-invert">
                            <video
                                className="tw-w-full"
                                src="videos/demo.mp4"
                            ></video>
                            <header className="tw-mb-4 lg:tw-mb-6 tw-not-format">
                                <h1 className="tw-mb-4 tw-text-3xl tw-font-extrabold tw-leading-tight tw-text-gray-900 lg:tw-mb-6 lg:tw-text-4xl dark:tw-text-white">
                                    {doc.data().name}
                                </h1>
                            </header>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: draftToHtml(
                                        JSON.parse(doc.data().desc)
                                    ),
                                }}
                            ></div>
                            <ExamsViewer lessonId={doc.id} />
                        </article>
                    </div>
                </main>
            </div>
        </>
    );
}
function Main() {
    const router = useRouter();
    const { id } = router.query;
    const queryLesson = useGetDoc("Lessons", id as string);
    const queryCourse = useGetDoc(
        "Courses",
        queryLesson.data?.data()?.courseId as string
    );
    if (typeof id != "string")
        return <Page404 message="The Lesson id is not exist" />;
    if (queryLesson.isLoading) return <LoadingArea />;
    if (queryLesson.isError) return null;
    if (!queryLesson.data.exists())
        return <Page404 message="The Lesson is not exist" />;
    if (queryCourse.isLoading) return <LoadingArea />;
    if (queryCourse.isError) return null;
    if (!queryCourse.data.exists())
        return <Page404 message="The Course is not exist" />;

    return (
        <PaymentProtector course={queryCourse.data}>
            <SafeArea doc={queryLesson.data} />
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
