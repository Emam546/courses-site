import { createCollection, getDocRef } from "@/firebase";
import { addDoc, serverTimestamp } from "firebase/firestore";
import router, { useRouter } from "next/router";
import Page404 from "@/components/pages/404";
import CourseInfoForm from "@/components/pages/courses/form";
import { CardTitle, MainCard } from "@/components/card";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import ErrorShower from "@/components/common/error";

export function SaveArea({ levelId }: { levelId: string }) {
    const [levelData, loading, error] = useDocumentOnce(
        getDocRef("Levels", levelId as string)
    );
    return (
        <>
            <ErrorShower
                loading={loading}
                error={error}
            />
            {levelData && (
                <MainCard>
                    <CardTitle>Adding Course</CardTitle>
                    <CardTitle>Level:{levelData.data()?.name}</CardTitle>
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
