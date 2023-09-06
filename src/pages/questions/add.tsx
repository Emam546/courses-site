import { createCollection, getDocRef } from "@/firebase";
import { addDoc, serverTimestamp } from "firebase/firestore";
import router, { useRouter } from "next/router";
import Page404 from "@/components/pages/404";
import QuestGetDataForm from "@/components/pages/questions/form";
import { CardTitle, MainCard } from "@/components/card";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import ErrorShower from "@/components/common/error";
import { useMemo, useState } from "react";
function SafeArea({ lessonId }: { lessonId: string }) {
    const [lessonData, loading, error] = useDocumentOnce(
        getDocRef("Lessons", lessonId as string)
    );
    const [count, setCount] = useState(0);
 
    return (
        <MainCard>
            <ErrorShower
                loading={loading}
                error={error}
            />
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
    );
}
export default function AddCourses() {
    const router = useRouter();
    const { lessonId } = router.query;
    if (typeof lessonId != "string") return <Page404 />;
    return <SafeArea lessonId={lessonId} />;
}
