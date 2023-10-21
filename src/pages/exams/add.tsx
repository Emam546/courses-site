import { auth, createCollection } from "@/firebase";
import {
    QueryDocumentSnapshot,
    addDoc,
    serverTimestamp,
} from "firebase/firestore";
import router, { useRouter } from "next/router";
import Page404 from "@/components/pages/404";
import ExamInfoForm from "@/components/pages/exams/form";
import { CardTitle, MainCard } from "@/components/card";
import ErrorShower from "@/components/common/error";
import { useGetDoc } from "@/hooks/fireStore";
import Head from "next/head";
import { useAuthState } from "react-firebase-hooks/auth";
import { DataBase } from "@/data";
function SafeArea({
    lesson,
}: {
    lesson: QueryDocumentSnapshot<DataBase["Lessons"]>;
}) {
    const [teacher] = useAuthState(auth);
    return (
        <MainCard>
            <Head>
                <title>Add Exam</title>
            </Head>
            {lesson && (
                <>
                    <CardTitle>Adding Exam</CardTitle>
                    <CardTitle>Lesson:{lesson.data()?.name}</CardTitle>
                    <MainCard>
                        <ExamInfoForm
                            onData={async (data) => {
                                const col = createCollection("Exams");

                                await addDoc(col, {
                                    ...data,
                                    createdAt: serverTimestamp(),
                                    lessonId: lesson.id,
                                    teacherId: teacher!.uid,
                                    order: Date.now(),
                                    courseId: lesson.data()?.courseId,
                                });
                                router.push(`/lessons?id=${lesson.id}`);
                            }}
                            buttonName="Submit"
                            lessonId={lesson.id}
                        />
                    </MainCard>
                </>
            )}
        </MainCard>
    );
}
export default function AddExams() {
    const router = useRouter();
    const { lessonId } = router.query;
    const {
        data: lesson,
        isLoading,
        isError,
        error,
    } = useGetDoc("Lessons", lessonId as string);
    if (typeof lessonId != "string")
        return <Page404 message="You must provide The page id with url" />;
    if (isLoading || isError)
        return (
            <ErrorShower
                loading={isLoading}
                error={error as any}
            />
        );
    if (!lesson.exists()) return <Page404 message="The lesson is not exist" />;
    return <SafeArea lesson={lesson} />;
}
