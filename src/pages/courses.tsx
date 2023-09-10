import Loader from "@/components/loader";
import ErrorShower from "@/components/error";
import { createCollection } from "@/firebase";
import {
    query,
    where,
    orderBy,
    QueryDocumentSnapshot,
    getDocs,
} from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { DataBase } from "@/data";
import Link from "next/link";
import Page404 from "@/components/pages/404";
import Head from "next/head";
import { useRouter } from "next/router";
import { useGetDoc } from "@/hooks/firebase";
import { PaymentProtector } from "@/components/payment";

function Lesson({
    doc,
    index,
}: {
    index: number;
    doc: QueryDocumentSnapshot<DataBase["Lessons"]>;
}) {
    const data = doc.data();
    return (
        <div className="mix col-lg-3 col-md-4 col-sm-6 finance">
            <Link href={`/lessons?id=${doc.id}`}>
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
export function useGetLessons(courseId: string) {
    return useQuery({
        queryKey: ["Lessons", "courseId", courseId],
        queryFn: async () => {
            return await getDocs(
                query(
                    createCollection("Lessons"),
                    where("courseId", "==", courseId),
                    where("hide", "==", false),
                    orderBy("order")
                )
            );
        },
    });
}
function SafeArea({
    doc,
}: {
    doc: QueryDocumentSnapshot<DataBase["Courses"]>;
}) {
    const { data: lessons, isLoading, isError, error } = useGetLessons(doc.id);
    if (isLoading) return <Loader />;
    if (isError) return <ErrorShower err={error} />;
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
                        {lessons?.docs.map((doc, i) => {
                            return (
                                <Lesson
                                    doc={doc}
                                    index={i}
                                    key={doc.id}
                                />
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
}
function Main() {
    const router = useRouter();
    const { id } = router.query;
    const queryCourse = useGetDoc("Courses", id as string);
    if (typeof id != "string")
        return <Page404 message="The Course id is not exist" />;
    if (queryCourse.isLoading) return <Loader />;
    if (queryCourse.isError) return null;
    if (!queryCourse.data.exists())
        return <Page404 message="The Course is not exist" />;

    return (
        <PaymentProtector course={queryCourse.data}>
            <SafeArea doc={queryCourse.data} />
        </PaymentProtector>
    );
}
export default function Page() {
    return (
        <>
            <Main />
        </>
    );
}
