/* eslint-disable jsx-a11y/alt-text */
import Loader from "@/components/loader";
import Page404 from "@/components/pages/404";
import { PaymentProtector } from "@/components/payment";
import { DataBase } from "@/data";
import { useGetDoc } from "@/hooks/firebase";
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
import React from "react";
import draftToHtml from "draftjs-to-html";
import { useQuery } from "@tanstack/react-query";
import { createCollection } from "@/firebase";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Protector from "@/components/protector";
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
function SafeArea({
    doc,
    course,
}: {
    doc: QueryDocumentSnapshot<DataBase["Lessons"]>;
    course: QueryDocumentSnapshot<DataBase["Courses"]>;
}) {
    const { data: exams } = useGetExams(doc.id);
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
                                            JSON.parse(doc.data().desc)
                                        ),
                                    }}
                                ></div>
                            </div>
                        </div>
                        <div className="col-lg-10 offset-lg-1">
                            <h1 className="tw-text-5xl tw-mb-6">Exams</h1>
                            <div className="tw-space-y-5">
                                {exams?.docs.map((doc) => {
                                    return (
                                        <Link
                                            key={doc.id}
                                            href={`/exams?id=${doc.id}`}
                                            className="site-btn tw-text-start tw-px-10 tw-py-3 tw-flex tw-items-center"
                                        >
                                            <p className="tw-flex-1 tw-text-white tw-text-lg tw-font-semibold">
                                                {doc.data().name}
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
    if (queryLesson.isLoading) return <Loader />;
    if (queryLesson.isError) return null;
    if (!queryLesson.data.exists())
        return <Page404 message="The Lesson is not exist" />;
    if (queryCourse.isLoading) return <Loader />;
    if (queryCourse.isError) return null;
    if (!queryCourse.data.exists())
        return <Page404 message="The Course is not exist" />;

    return (
        <PaymentProtector course={queryCourse.data}>
            <SafeArea
                course={queryCourse.data}
                doc={queryLesson.data}
            />
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
