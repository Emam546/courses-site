import { createCollection } from "@/firebase";
import { useAppSelector } from "@/store";
import { getCardImage } from "@/utils/data";
import { orderBy, query, where } from "firebase/firestore";
import Head from "next/head";
import Link from "next/link";
import { useCollectionOnce } from "react-firebase-hooks/firestore";
function Main() {
    const user = useAppSelector((state) => state.auth.user!);
    const [courses, loading, error] = useCollectionOnce(
        query(
            createCollection("Courses"),
            where("levelId", "==", user.data().levelId),
            where("hide", "==", false),
            orderBy("order")
        )
    );
    return (
        <div className="home-page">
            <div className="home">
                {/* Hero Slider */}
                <div className="hero_slider_container">
                    {/* Hero Slide */}
                    <div className="hero_slide">
                        <div
                            className="hero_slide_background"
                            style={{
                                backgroundImage:
                                    'url("images/slider_background.jpg")',
                            }}
                        />
                        <div className="hero_slide_container d-flex flex-column align-items-center justify-content-center">
                            <div className="hero_slide_content text-center">
                                <h1
                                    data-animation-in="fadeInUp"
                                    data-animation-out="animate-out fadeOut"
                                >
                                    Get your <span>Education</span> today!
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Popular */}
            <div className="popular page_section">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <div className="section_title text-center">
                                <h1>Courses</h1>
                            </div>
                        </div>
                    </div>
                    <div className="row course_boxes">
                        {courses?.docs.map((doc, i) => {
                            return (
                                <div
                                    key={doc.id}
                                    className="col-lg-4 course_box tw-pt-9"
                                >
                                    <Link
                                        href={`/courses?id=${doc.id}`}
                                        className="hover:tw-no-underline hover:tw-text-inherit tw-text-inherit"
                                    >
                                        <div className="card tw-min-h-[30rem] tw-h-full">
                                            <img
                                                className="card-img-top"
                                                src={getCardImage(i + 3)}
                                                alt="course-image"
                                            />
                                            <div className="card-body text-center">
                                                <h3 className="tw-font-semibold tw-mb-5">
                                                    {doc.data().name}
                                                </h3>
                                                <div className="card-text">
                                                    {doc.data().desc}
                                                </div>
                                            </div>
                                            <div className="price_box d-flex flex-row align-items-center tw-mt-5">
                                                <div className="tw-flex-1"></div>
                                                <div className="course_price d-flex align-items-center justify-content-center">
                                                    <span>
                                                        ${doc.data().price.num}
                                                    </span>
                                                </div>
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
    );
}
export default function Page() {
    return (
        <>
            <Head>
                <title>Home</title>
                <link
                    rel="stylesheet"
                    type="text/css"
                    href="styles/main_styles.css"
                />
                <link
                    rel="stylesheet"
                    type="text/css"
                    href="styles/responsive.css"
                />
            </Head>
            <Main />
        </>
    );
}
