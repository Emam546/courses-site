import { createCollection, getDocRef } from "@/firebase";
import { addDoc } from "firebase/firestore";
import router, { useRouter } from "next/router";
import Page404 from "@/components/pages/404";
import QuestGetDataForm from "@/components/pages/questions/form";
import { CardTitle, MainCard } from "@/components/card";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import ErrorShower from "@/components/common/error";
function SafeArea({ lessonId }: { lessonId: string }) {
    const [lessonData, loading, error] = useDocumentOnce(
        getDocRef("Lessons", lessonId as string)
    );
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
                            console.log(data);
                            await addDoc(col, {
                                ...data,
                                createdAt: new Date(),
                                lessonId: lessonId,
                            });
                            alert("question Added successfully");
                        }}
                        buttonName="Submit"
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
