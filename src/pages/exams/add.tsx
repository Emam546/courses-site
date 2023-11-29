import { auth, createCollection } from "@/firebase";
import {
    QueryDocumentSnapshot,
    addDoc,
    serverTimestamp,
} from "firebase/firestore";
import router, { useRouter } from "next/router";
import Page404 from "@/components/pages/404";
import ExamInfoForm from "@/components/pages/exams/form";
import { BigCard, CardTitle, MainCard } from "@/components/card";
import ErrorShower from "@/components/common/error";
import { useDocument, useGetDoc } from "@/hooks/fireStore";
import Head from "next/head";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoToButton } from "@/components/common/inputs/addButton";
export interface Props {
    lesson: DataBase.WithIdType<DataBase["Lessons"]>;
}
function Page({ lesson }: Props) {
    const [teacher] = useAuthState(auth);
    return (
        <>
            <Head>
                <title>Add Exam</title>
            </Head>
            <BigCard>
                <>
                    <CardTitle>Adding Exam</CardTitle>
                    <CardTitle>Lesson:{lesson.name}</CardTitle>
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
                                    courseId: lesson.courseId,
                                });
                                router.push(`/lessons?id=${lesson.id}`);
                            }}
                            buttonName="Submit"
                            lessonId={lesson.id}
                        />
                    </MainCard>
                </>
            </BigCard>
            <div className="py-3">
                <GoToButton
                    label="Go To Lesson"
                    href={`/lessons?id=${lesson.id}`}
                />
            </div>
        </>
    );
}
export default function SafeArea() {
    const router = useRouter();
    const { lessonId } = router.query;
    const [lesson, isLoading, error] = useDocument(
        "Lessons",
        lessonId as string
    );
    if (typeof lessonId != "string")
        return <Page404 message="You must provide The page id with url" />;
    if (isLoading || error)
        return (
            <ErrorShower
                loading={isLoading}
                error={error}
            />
        );
    if (!lesson.exists()) return <Page404 message="The lesson is not exist" />;
    return <Page lesson={{ id: lesson.id, ...lesson.data() }} />;
}
