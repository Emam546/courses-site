import { auth, createCollection, getDocRef } from "@/firebase";
import {
    QueryDocumentSnapshot,
    addDoc,
    serverTimestamp,
} from "firebase/firestore";
import router, { useRouter } from "next/router";
import Page404 from "@/components/pages/404";
import LessonGetDataForm from "@/components/pages/lessons/form";
import { CardTitle, MainCard } from "@/components/card";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import ErrorShower from "@/components/common/error";
import Head from "next/head";
import { useGetDoc } from "@/hooks/fireStore";
import { useAuthState } from "react-firebase-hooks/auth";
import { DataBase } from "@/data";
function SafeArea({
    course,
}: {
    course: QueryDocumentSnapshot<DataBase["Courses"]>;
}) {
    const [teacher] = useAuthState(auth);
    return (
        <MainCard>
            <Head>
                <title>Add lesson</title>
            </Head>

            <>
                <CardTitle>Adding Lesson</CardTitle>
                <CardTitle>Course:{course.data()?.name}</CardTitle>
                <MainCard>
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
                </MainCard>
            </>
        </MainCard>
    );
}
export default function AddCourses() {
    const router = useRouter();
    const { courseId } = router.query;
    const {
        data: course,
        isLoading,
        isError,
        error,
    } = useGetDoc("Courses", courseId as string);
    if (typeof courseId != "string")
        return <Page404 message="You must provide The page id with url" />;
    if (isLoading || isError)
        return (
            <ErrorShower
                loading={isLoading}
                error={error as any}
            />
        );
    if (!course.exists()) return <Page404 message="The course is not exist" />;
    return <SafeArea course={course} />;
}
