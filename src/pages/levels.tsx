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
import JoinCommunity from "@/components/common/JoinCommunity";
import classNames from "classnames";
import MinShower from "@/components/common/itemsShower/min";

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
    const user = useAppSelector((state) => state.auth.user);
    return (
        <>
            <Head>
                <title>{level.name}</title>
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
                        <span>{level.name}</span>
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
                                <span>Courses</span>
                            </h2>
                        </div>
                    </div>
                </div>
            </section>

            {/* categories section */}
            <section
                className={classNames("course-section spad", { "pb-0": !user })}
            >
                <div className="course-warp">
                    <MinShower
                        items={courses
                            .filter((data) => !data.featured)
                            .map((val) => ({
                                ...val,
                                name: val.name,
                                desc: val.desc,
                                link: `/courses?id=${val.id}`,
                            }))}
                    />
                    <div className="featured-courses">
                        {courses.map((data, i) => {
                            if (!data.featured) return null;
                            return (
                                <div
                                    key={data.id}
                                    className="featured-course course-item"
                                >
                                    <div
                                        className="course-thumb"
                                        style={{
                                            backgroundImage: `url('img/courses/f-${
                                                (i % 2) + 1
                                            }.jpg')`,
                                        }}
                                    >
                                        <div className="price">
                                            Price:{" "}
                                            {data.price.num > 0
                                                ? `${
                                                      data.price.num
                                                  }${data.price.currency.toLocaleUpperCase()}`
                                                : "Free"}
                                        </div>
                                    </div>
                                    <Link href={`/courses?id=${data.id}`}>
                                        <div className="row">
                                            <div
                                                className={ClassNames({
                                                    "col-lg-6 offset-lg-6 pl-0":
                                                        i % 2 == 0,
                                                    "col-lg-6 pr-0": i % 2 == 1,
                                                })}
                                            >
                                                <div className="course-info">
                                                    <div className="course-text">
                                                        <div className="fet-note">
                                                            Featured Course
                                                        </div>

                                                        <h5>{data.name}</h5>
                                                        <p className="tw-min-h-[7rem]">
                                                            {data.desc}
                                                        </p>

                                                        <div className="students">
                                                            {data.studentNum}{" "}
                                                            Students
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <JoinCommunity />
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
