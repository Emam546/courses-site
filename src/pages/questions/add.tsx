import { createCollection, getDocRef } from "@/firebase";
import { addDoc, serverTimestamp } from "firebase/firestore";
import router, { useRouter } from "next/router";
import Page404 from "@/components/pages/404";
import QuestGetDataForm from "@/components/pages/questions/form";
import { CardTitle, MainCard } from "@/components/card";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import ErrorShower from "@/components/common/error";
import { useMemo, useState } from "react";
import Head from "next/head";
import { GoToButton } from "@/components/common/inputs/addButton";
import { useGetDoc } from "@/utils/hooks/fireStore";
function SafeArea({ lessonId }: { lessonId: string }) {
    const {data:lessonData,isLoading,error}= useGetDoc("Lessons",lessonId);
    const [count, setCount] = useState(0);

    return (
        <>
            <MainCard>
                <ErrorShower
                    loading={isLoading}
                    error={error as any}
                />
                <Head>
                    <title>Add questions</title>
                </Head>
                {lessonData && (
                    <>
                        <CardTitle>Adding Question</CardTitle>
                        <CardTitle>Lesson :{lessonData.data()?.name}</CardTitle>
                        <QuestGetDataForm
                            onData={async (data) => {
                                const col = createCollection("Questions");
                                await addDoc(col, {
                                    ...data,
                                    createdAt: serverTimestamp(),
                                    lessonId: lessonId,
                                });
                                setCount(count + 1);
                                alert("submit Question");
                            }}
                            buttonName="Submit"
                            ResetAfterSubmit
                        />
                    </>
                )}
            </MainCard>
            <div className="tw-mt-3">
                <GoToButton
                    label={"Go To Questions"}
                    href={`/lessons/questions?id=${lessonData?.id}`}
                />
            </div>
        </>
    );
}
export default function AddCourses() {
    const router = useRouter();
    const { lessonId } = router.query;
    if (typeof lessonId != "string") return <Page404 />;
    return <SafeArea lessonId={lessonId} />;
}
