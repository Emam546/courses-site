import { createCollection } from "@/firebase";
import { addDoc, serverTimestamp } from "firebase/firestore";
import router, { useRouter } from "next/router";
import Page404 from "@/components/pages/404";
import ExamInfoForm from "@/components/pages/exams/form";
import { CardTitle, MainCard } from "@/components/card";
import ErrorShower from "@/components/common/error";
import { useGetDoc } from "@/hooks/fireStore";
import Head from "next/head";
function SafeArea({ lessonId }: { lessonId: string }) {
    const {
        data: lessonData,
        isLoading,
        error,
    } = useGetDoc("Lessons", lessonId);

    return (
        <MainCard>
            <ErrorShower
                loading={isLoading}
                error={error as any}
            />
            <Head>
                <title>Add Exam</title>
            </Head>
            {lessonData && (
                <>
                    <CardTitle>Adding Exam</CardTitle>
                    <CardTitle>Lesson:{lessonData.data()?.name}</CardTitle>
                    <MainCard>
                        <ExamInfoForm
                            onData={async (data) => {
                                const col = createCollection("Exams");

                                await addDoc(col, {
                                    ...data,
                                    createdAt: serverTimestamp(),
                                    lessonId: lessonId,
                                    order: Date.now(),
                                });
                                router.push(`/lessons?id=${lessonId}`);
                            }}
                            buttonName="Submit"
                            lessonId={lessonId}
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
    if (typeof lessonId != "string")
        return <Page404 message="You must provide The page id with url" />;
    return <SafeArea lessonId={lessonId} />;
}
