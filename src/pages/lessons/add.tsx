import { createCollection, getDocRef } from "@/firebase";
import { addDoc } from "firebase/firestore";
import router, { useRouter } from "next/router";
import Page404 from "@/components/pages/404";
import LessonGetDataForm from "@/components/pages/lessons/form";
import { CardTitle, MainCard } from "@/components/card";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
function SafeArea({ courseId }: { courseId: string }) {
    const [courseData, loading, error] = useDocumentOnce(
        getDocRef("Courses", courseId as string)
    );
    return (
        <MainCard>
            {courseData && (
                <>
                    <CardTitle>Adding Lesson</CardTitle>
                    <CardTitle>Course:{courseData.data()?.name}</CardTitle>
                    <LessonGetDataForm
                        onData={async (data) => {
                            const col = createCollection("Lessons");
                            console.log(data);
                            await addDoc(col, {
                                ...data,
                                createdAt: new Date(),
                                courseId: courseId,
                                order: Date.now(),
                            });
                            router.push(`/courses?id=${courseId}`);
                        }}
                        courseId={courseId}
                        buttonName="Submit"
                    />
                </>
            )}
        </MainCard>
    );
}
export default function AddCourses() {
    const router = useRouter();
    const { courseId } = router.query;
    if (typeof courseId != "string") return <Page404 />;
    return <SafeArea courseId={courseId} />;
}
