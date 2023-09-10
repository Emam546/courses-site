import { createCollection, getDocRef } from "@/firebase";
import { addDoc, serverTimestamp } from "firebase/firestore";
import router, { useRouter } from "next/router";
import Page404 from "@/components/pages/404";
import LessonGetDataForm from "@/components/pages/lessons/form";
import { CardTitle, MainCard } from "@/components/card";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import ErrorShower from "@/components/common/error";
import Head from "next/head";
import { useGetDoc } from "@/hooks/fireStore";
function SafeArea({ courseId }: { courseId: string }) {
    const {
        data: courseData,
        isLoading,
        error,
    } = useGetDoc("Courses", courseId);

    return (
        <MainCard>
            <ErrorShower
                loading={isLoading}
                error={error as any}
            />
            <Head>
                <title>Add lesson</title>
            </Head>
            {courseData && (
                <>
                    <CardTitle>Adding Lesson</CardTitle>
                    <CardTitle>Course:{courseData.data()?.name}</CardTitle>
                    <MainCard>
                        <LessonGetDataForm
                            onData={async (data) => {
                                const col = createCollection("Lessons");
                                console.log(data);
                                await addDoc(col, {
                                    ...data,
                                    createdAt: serverTimestamp(),
                                    courseId: courseId,
                                    order: Date.now(),
                                });
                                router.push(`/courses?id=${courseId}`);
                            }}
                            courseId={courseId}
                            buttonName="Submit"
                        />
                    </MainCard>
                </>
            )}
        </MainCard>
    );
}
export default function AddCourses() {
    const router = useRouter();
    const { courseId } = router.query;
    if (typeof courseId != "string")
        return <Page404 message="You must provide The page id with url" />;
    return <SafeArea courseId={courseId} />;
}
