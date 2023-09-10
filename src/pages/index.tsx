import Loader from "@/components/loader";
import ErrorShower from "@/components/error";
import { createCollection } from "@/firebase";
import { useAppSelector } from "@/store";
import {
    query,
    where,
    orderBy,
    getCountFromServer,
    QueryDocumentSnapshot,
    getDocs,
} from "firebase/firestore";
import { useCollectionOnce } from "react-firebase-hooks/firestore";
import { useQuery } from "@tanstack/react-query";
import { DataBase } from "@/data";
import ClassNames from "classnames";
import Link from "next/link";
import Head from "next/head";
function useGetStudentsNum(courseId: string) {
    return useQuery({
        queryKey: ["Payments", "count", "courseId"],
        queryFn: async () => {
            return (
                await getCountFromServer(
                    query(
                        createCollection("Payment"),
                        where("courseId", "==", courseId)
                    )
                )
            ).data().count;
        },
    });
}
export function Course({
    doc,
    index,
}: {
    index: number;
    doc: QueryDocumentSnapshot<DataBase["Courses"]>;
}) {
    const data = doc.data();
    const { data: count, isLoading, isError } = useGetStudentsNum(doc.id);
    return (
        <div className="featured-course course-item">
            <div
                className="course-thumb"
                style={{
                    backgroundImage: `url('img/courses/f-${
                        (index % 2) + 1
                    }.jpg')`,
                }}
            >
                <div className="price">
                    Price: {data.price.num}
                    {data.price.currency.toUpperCase()}
                </div>
            </div>
            <Link href={`/courses?id=${doc.id}`}>
                <div className="row">
                    <div
                        className={ClassNames({
                            "col-lg-6 offset-lg-6 pl-0": index % 2 == 0,
                            "col-lg-6 pr-0": index % 2 == 1,
                        })}
                    >
                        <div className="course-info">
                            <div className="course-text">
                                {data.featured && (
                                    <div className="fet-note">
                                        Featured Course
                                    </div>
                                )}
                                <h5>{data.name}</h5>
                                <p>{data.desc}</p>
                                {!isLoading && !isError && (
                                    <div className="students">
                                        {count} Students
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
export function useGetCourses(levelId?: string) {
    return useQuery({
        enabled: typeof levelId == "string",
        queryKey: ["Courses", "levelId"],
        queryFn: async () => {
            return await getDocs(
                query(
                    createCollection("Courses"),
                    where("levelId", "==", levelId),
                    where("hide", "==", false),
                    orderBy("order")
                )
            );
        },
    });
}
export default function Page() {
    const user = useAppSelector((state) => state.auth.user!);
    const {
        data: courses,
        isLoading,
        isError,
        error,
    } = useGetCourses(user.data().levelId);
    if (isLoading) return <Loader />;
    if (isError) return <ErrorShower err={error} />;
    return (
        <>
            <Head>
                <title>Home</title>
            </Head>
            <section
                className="hero-section"
                style={{
                    backgroundImage: "url(img/bg.jpg)",
                }}
            >
                <div className="container">
                    <div className="hero-text text-white">
                        <h2>Get The Best Free Online Courses</h2>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Donec malesuada lorem maximus mauris
                            scelerisque, at rutrum nulla <br /> dictum. Ut ac
                            ligula sapien. Suspendisse cursus faucibus finibus.
                        </p>
                    </div>
                </div>
            </section>
            {/* categories section */}
            <section className="course-section spad tw-pb-20">
                <div className="course-warp">
                    <div className="featured-courses">
                        {courses?.docs.map((doc, i) => {
                            return (
                                <Course
                                    doc={doc}
                                    index={i}
                                    key={doc.id}
                                />
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* categories section end */}
        </>
    );
}
