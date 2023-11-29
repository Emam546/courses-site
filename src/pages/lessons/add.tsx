import { auth, createCollection } from "@/firebase";
import {
    QueryDocumentSnapshot,
    addDoc,
    serverTimestamp,
} from "firebase/firestore";
import router, { useRouter } from "next/router";
import Page404 from "@/components/pages/404";
import LessonGetDataForm from "@/components/pages/lessons/form";
import { BigCard, CardTitle, MainCard } from "@/components/card";
import ErrorShower from "@/components/common/error";
import Head from "next/head";
import { useDocument } from "@/hooks/fireStore";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoToButton } from "@/components/common/inputs/addButton";
export interface Props {
    course: DataBase.WithIdType<DataBase["Courses"]>;
}
function Page({ course }: Props) {
    const [teacher] = useAuthState(auth);
    return (
        <>
            <Head>
                <title>Add lesson</title>
            </Head>
            <BigCard>
                <CardTitle className="tw-mb-2">Adding Lesson</CardTitle>
                <CardTitle>Course:{course.name}</CardTitle>
                <MainCard>
                    <div className="tw-mt-5">
                        <LessonGetDataForm
                            onData={async (data) => {
                                const col = createCollection("Lessons");
                                await addDoc(col, {
                                    ...data,
                                    createdAt: serverTimestamp(),
                                    courseId: course.id,
                                    teacherId: teacher!.uid,
                                    order: Date.now(),
                                    adderIds: {},
                                });
                                router.push(`/courses?id=${course.id}`);
                            }}
                            courseId={course.id}
                            buttonName="Submit"
                        />
                    </div>
                </MainCard>
            </BigCard>
            <div className="tw-mt-3">
                <GoToButton
                    label="Go To The Course"
                    href={`/courses?id=${course.id}`}
                />
            </div>
        </>
    );
}
export default function SafeArea() {
    const router = useRouter();
    const { courseId } = router.query;
    const [course, isLoading, error] = useDocument(
        "Courses",
        courseId as string
    );
    if (typeof courseId != "string")
        return <Page404 message="You must provide The page id with url" />;
    if (isLoading || error)
        return (
            <ErrorShower
                loading={isLoading}
                error={error}
            />
        );
    if (!course.exists()) return <Page404 message="The course is not exist" />;
    return <Page course={{ id: course.id, ...course.data() }} />;
}
