import Loader from "@/components/loader";
import { useAppSelector } from "@/store";
import { useQuery } from "@tanstack/react-query";
import ClassNames from "classnames";
import Link from "next/link";
import Head from "next/head";
import { CourseLevelType, getLevelCourses } from "@/firebase/func/data/course";
import { wrapRequest, ErrorMessage } from "@/utils/wrapRequest";
import {
    ErrorMessageCom,
    PageNotExisted,
} from "@/components/handelErrorMessage";
import { LevelType, getLevel } from "@/firebase/func/data/level";
import { useRouter } from "next/router";

export function Course({
    data,
    index,
}: {
    index: number;
    data: CourseLevelType;
}) {
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
            <Link href={`/courses?id=${data.id}`}>
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

                                <div className="students">
                                    {data.studentNum} Students
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
export function useGetLevel(levelId?: string) {
    return useQuery({
        enabled: typeof levelId == "string",
        queryKey: ["Levels", levelId],
        queryFn: async () => {
            return await wrapRequest(getLevel(levelId as string));
        },
        onError(err: ErrorMessage) {},
    });
}
export function useGetCourses(levelId?: string) {
    return useQuery({
        enabled: typeof levelId == "string",
        queryKey: ["Courses", "levelId", levelId],
        queryFn: async () => {
            return await wrapRequest(getLevelCourses(levelId as string));
        },
        onError(err: ErrorMessage) {},
    });
}
interface PageParams {
    level: LevelType;
    courses: CourseLevelType[];
}
export function Page({ courses, level }: PageParams) {
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
                        <h2>{level.name}</h2>
                        <p>{level.desc}</p>
                    </div>
                </div>
            </section>
            {/* categories section */}
            <section className="course-section spad tw-pb-20">
                <div className="course-warp">
                    <div className="featured-courses">
                        {courses.map((data, i) => {
                            return (
                                <Course
                                    data={data}
                                    index={i}
                                    key={data.id}
                                />
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
}
export default function SafeArea() {
    const router = useRouter();
    const { id } = router.query;
    const { data, isLoading, error } = useGetCourses(id as string);
    const {
        data: level,
        isLoading: isLevelLoading,
        isError: isLevelError,
        error: levelError,
    } = useGetLevel(id as string);
    if (typeof id != "string") return <PageNotExisted />;
    if (error || levelError) return <ErrorMessageCom error={error} />;
    if (isLoading || isLevelLoading) return <Loader />;
    return (
        <Page
            courses={data.courses}
            level={level.level}
        />
    );
}