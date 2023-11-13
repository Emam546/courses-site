import Loader from "@/components/loader";
import { useAppSelector } from "@/store";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { CourseLevelType, getLevelCourses } from "@/firebase/func/data/course";
import { wrapRequest, ErrorMessage } from "@/utils/wrapRequest";
import { ErrorMessageCom } from "@/components/handelErrorMessage";
import { LevelType } from "@/firebase/func/data/level";

// export function Page() {
//     return (
//         <>
//             <Head>
//                 <title>Home</title>
//             </Head>
//             <section
//                 className="hero-section"
//                 style={{
//                     backgroundImage: "url(img/bg.jpg)",
//                 }}
//             >
//                 <div className="container">
//                     <div className="hero-text text-white">
//                         <h2>{level.name}</h2>
//                         <p>{level.desc}</p>
//                     </div>
//                 </div>
//             </section>
//             {/* categories section */}
//             <section className="course-section spad tw-pb-20">
//                 <div className="course-warp">
//                     <div className="featured-courses">
//                         {courses.map((data, i) => {
//                             return (
//                                 <Course
//                                     data={data}
//                                     index={i}
//                                     key={data.id}
//                                 />
//                             );
//                         })}
//                     </div>
//                 </div>
//             </section>

//             {/* categories section end */}
//         </>
//     );
// }
export default function SafeArea() {
    return <h1>Hi There</h1>;
}
