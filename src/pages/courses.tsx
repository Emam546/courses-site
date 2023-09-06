import Page404 from "@/components/pages/404";
import LoadingArea from "@/components/pages/loading";
import { PaymentProtector } from "@/components/pages/payment";
import { DataBase } from "@/data";
import { createCollection } from "@/firebase";
import { useGetDoc } from "@/hooks/firebase";
import { getCardImage } from "@/utils/data";
import { useQuery } from "@tanstack/react-query";
import {
    QueryDocumentSnapshot,
    getDocs,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
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
    const { data: lessons } = useGetLessons(doc.id);
    return (
        <>
            <Head>
                <title>{doc.data().name}</title>
            </Head>
            <div className="courses-page">
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
                        <h1>Lessons</h1>
                    </div>
                </div>
                {/* Popular */}
                <div className="popular page_section">
                    <div className="container">
                        <div className="row course_boxes">
                            {lessons?.docs.map((doc, i) => {
                                return (
                                    <div
                                        key={doc.id}
                                        className="col-lg-4 course_box"
                                    >
                                        <Link
                                            href={`/lessons?id=${doc.id}`}
                                            className="hover:tw-no-underline hover:tw-text-inherit tw-text-inherit"
                                        >
                                            <div className="card tw-min-h-[20rem]">
                                                <img
                                                    className="card-img-top"
                                                    src={getCardImage(i)}
                                                    alt="Lesson image"
                                                />
                                                <div className="card-body text-center">
                                                    <h3 className="tw-font-semibold tw-mb-5">
                                                        {doc.data().name}
                                                    </h3>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
function Main() {
    const router = useRouter();
    const { id } = router.query;
    const queryCourse = useGetDoc("Courses", id as string);
    if (typeof id != "string")
        return <Page404 message="The Course id is not exist" />;
    if (queryCourse.isLoading) return <LoadingArea />;
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
            <Head>
                <link
                    rel="stylesheet"
                    type="text/css"
                    href="styles/courses_styles.css"
                />
                <link
                    rel="stylesheet"
                    type="text/css"
                    href="styles/courses_responsive.css"
                />
            </Head>
            <Main />
        </>
    );
}
