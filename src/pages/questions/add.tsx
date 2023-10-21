import { auth, createCollection, getDocRef } from "@/firebase";
import {
    QueryDocumentSnapshot,
    addDoc,
    serverTimestamp,
} from "firebase/firestore";
import router, { useRouter } from "next/router";
import Page404 from "@/components/pages/404";
import QuestGetDataForm from "@/components/pages/questions/form";
import { CardTitle, MainCard } from "@/components/card";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import ErrorShower from "@/components/common/error";
import { useMemo, useState } from "react";
import Head from "next/head";
import { GoToButton } from "@/components/common/inputs/addButton";
import { useGetDoc } from "@/hooks/fireStore";
import { useAuthState } from "react-firebase-hooks/auth";
import { DataBase } from "@/data";
function SafeArea({
    lesson,
}: {
    lesson: QueryDocumentSnapshot<DataBase["Lessons"]>;
}) {
    const [count, setCount] = useState(0);
    const [teacher] = useAuthState(auth);
    return (
        <>
            <MainCard>
                <Head>
                    <title>Add questions</title>
                </Head>

                <>
                    <CardTitle>Adding Question</CardTitle>
                    <CardTitle>Lesson :{lesson.data().name}</CardTitle>
                    <MainCard>
                        <QuestGetDataForm
                            onData={async (data) => {
                                const col = createCollection("Questions");
                                await addDoc(col, {
                                    ...data,
                                    createdAt: serverTimestamp(),
                                    lessonId: lesson.id,
                                    creatorId: teacher!.uid,
                                    courseId: lesson.data().courseId,
                                });
                                setCount(count + 1);
                                alert("submit Question");
                            }}
                            buttonName="Submit"
                            ResetAfterSubmit
                        />
                    </MainCard>
                </>
            </MainCard>
            <div className="tw-mt-3">
                <GoToButton
                    label={"Go To Questions"}
                    href={`/lessons/questions?id=${lesson?.id}`}
                />
            </div>
        </>
    );
}
export default function AddCourses() {
    const router = useRouter();
    const { lessonId } = router.query;
    const {
        data: lesson,
        isLoading,
        isError,
        error,
    } = useGetDoc("Lessons", lessonId as string);
    if (typeof lessonId != "string") return <Page404 />;
    if (isLoading || isError)
        return (
            <ErrorShower
                loading={isLoading}
                error={error as any}
            />
        );
    if (!lesson.exists()) return <Page404 />;
    return <SafeArea lesson={lesson} />;
}
