import Loader from "@/components/loader";
import Head from "next/head";
import { ErrorMessageCom } from "@/components/handelErrorMessage";
import { LevelsType, LevelsTypeProm } from "@/firebase/func/data/level";
import { useGetLevels } from "@/hooks/firebase";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ErrorMessage, wrapRequest } from "@/utils/wrapRequest";
import {
    CourseLevelType,
    getFeaturedCourses,
} from "@/firebase/func/data/course";
import MinShower, { ItemType } from "@/components/common/itemsShower/min";

export interface PageParams {
    levels: LevelsType;
}

export function Page({
    levels,
    courses,
}: {
    levels: LevelsTypeProm[];
    courses: CourseLevelType[];
}) {
    return (
        <>
            <Head>
                <title>Home</title>
            </Head>
            <section
                style={{
                    backgroundImage: "url(/img/bg.jpg)",
                }}
                className="hero-section set-bg "
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
            <section className="categories-section spad">
                <div className="container">
                    <div className="section-title">
                        <h2>Our Levels Categories</h2>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Donec malesuada lorem maximus mauris
                            scelerisque, at rutrum nulla dictum. Ut ac ligula
                            sapien. Suspendisse cursus faucibus finibus.
                        </p>
                    </div>
                    <div className="row">
                        {levels.map((val, i) => {
                            return (
                                <div
                                    key={val.id}
                                    className="col-lg-4 col-md-6"
                                >
                                    <Link href={`/levels?id=${val.id}`}>
                                        <div className="categorie-item">
                                            <div
                                                className="ci-thumb set-bg"
                                                style={{
                                                    backgroundImage: `url(/img/categories/${
                                                        (i % 6) + 1
                                                    }.jpg)`,
                                                }}
                                            />
                                            <div className="ci-text">
                                                <h5>{val.name}</h5>
                                                <p>{val.desc}</p>
                                                <span>
                                                    {val.courseCount} Courses
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="course-section spad">
                <div className="container tw-mb-10">
                    <div className="section-title mb-0">
                        <h2>Featured Courses</h2>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Donec malesuada lorem maximus mauris
                            scelerisque, at rutrum nulla dictum. Ut ac ligula
                            sapien. Suspendisse cursus faucibus finibus.
                        </p>
                    </div>
                </div>
                <div className="course-warp">
                    <MinShower
                        items={courses.map((val) => ({
                            ...val,
                            id: val.id,
                            link: `/courses?id=${val.id}`,
                            name: val.name,
                            desc: val.desc,
                        }))}
                    />
                </div>
            </section>
        </>
    );
}
function useGetFeaturedCourses(teacherId: string) {
    return useQuery({
        queryKey: ["FeaturedCourses", teacherId],
        queryFn: async () => {
            return wrapRequest(getFeaturedCourses(teacherId));
        },
        enabled: teacherId != undefined,
        onError(err: ErrorMessage) {},
    });
}

export default function SafeArea() {
    const queryLevels = useGetLevels(
        process.env.NEXT_PUBLIC_TEACHER_ID as string,
        true
    );
    const queryCourses = useGetFeaturedCourses(
        process.env.NEXT_PUBLIC_TEACHER_ID as string
    );

    if (queryLevels.error || queryCourses.error)
        return (
            <ErrorMessageCom error={queryLevels.error || queryCourses.error} />
        );
    if (queryLevels.isLoading || queryCourses.isLoading) return <Loader />;

    return (
        <Page
            courses={queryCourses.data.courses}
            levels={queryLevels.data}
        />
    );
}
