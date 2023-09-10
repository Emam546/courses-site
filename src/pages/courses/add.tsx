import { createCollection } from "@/firebase";
import { addDoc, serverTimestamp } from "firebase/firestore";
import router, { useRouter } from "next/router";
import Page404 from "@/components/pages/404";
import CourseInfoForm from "@/components/pages/courses/form";
import { CardTitle, MainCard } from "@/components/card";
import ErrorShower from "@/components/common/error";
import Head from "next/head";
import { useGetDoc } from "@/hooks/fireStore";

export function SaveArea({ levelId }: { levelId: string }) {
    const { data: levelData, isLoading, error } = useGetDoc("Levels", levelId);

    return (
        <>
            <Head>
                <title>Add Course</title>
            </Head>
            <ErrorShower
                loading={isLoading}
                error={error as any}
            />
            {levelData && (
                <MainCard>
                    <CardTitle>Adding Course</CardTitle>
                    <CardTitle>Level:{levelData.data()?.name}</CardTitle>
                    <MainCard>
                        <CourseInfoForm
                            onData={async (data) => {
                                const col = createCollection("Courses");

                                await addDoc(col, {
                                    ...data,
                                    createdAt: serverTimestamp(),
                                    levelId: levelId,
                                    order: Date.now(),
                                });
                                router.push(`/levels/info?id=${levelId}`);
                            }}
                            buttonName="Submit"
                        />
                    </MainCard>
                </MainCard>
            )}
        </>
    );
}
export default function AddCourses() {
    const router = useRouter();
    const { levelId } = router.query;
    if (typeof levelId != "string") return <Page404 />;

    return <SaveArea levelId={levelId} />;
}
