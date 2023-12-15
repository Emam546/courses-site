import { auth, createCollection } from "@/firebase";
import {
    QueryDocumentSnapshot,
    addDoc,
    serverTimestamp,
} from "firebase/firestore";
import { useRouter } from "next/router";
import Page404 from "@/components/pages/404";
import QuestGetDataForm from "@/components/pages/questions/form";
import { BigCard, CardTitle, MainCard } from "@/components/card";
import ErrorShower from "@/components/common/error";
import { useState } from "react";
import Head from "next/head";
import { GoToButton } from "@/components/common/inputs/addButton";
import { useGetDoc } from "@/hooks/fireStore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Timestamp } from "@firebase/firestore";
export interface Props {
    lesson: DataBase.WithIdType<DataBase["Lessons"]>;
}
function Page({ lesson }: Props) {
    const [count, setCount] = useState(0);
    const [teacher] = useAuthState(auth);
    return (
        <>
            <Head>
                <title>{lesson.name}:Add questions</title>
            </Head>
            <BigCard>
                <CardTitle>Adding Question</CardTitle>
                <CardTitle>Lesson :{lesson.name}</CardTitle>
                <MainCard>
                    <QuestGetDataForm
                        onData={async (data) => {
                            const col = createCollection("Questions");
                            const newData = {
                                ...data,
                                createdAt: serverTimestamp(),
                                lessonId: lesson.id,
                                creatorId: teacher!.uid,
                                courseId: lesson.courseId,
                            };
                            await addDoc(col, newData);
                            setCount(count + 1);
                            alert("Question submitted");
                        }}
                        buttonName="Submit"
                        ResetAfterSubmit
                    />
                </MainCard>
            </BigCard>
            <div className="tw-mt-3">
                <GoToButton
                    label={"Go To Questions"}
                    href={`/lessons/questions?id=${lesson?.id}`}
                />
            </div>
        </>
    );
}
export default function SafeArea() {
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
                error={error}
            />
        );
    if (!lesson.exists()) return <Page404 />;
    return <Page lesson={{ ...lesson.data(), id: lesson.id }} />;
}
