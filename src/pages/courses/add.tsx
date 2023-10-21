import { auth, createCollection } from "@/firebase";
import {
    QueryDocumentSnapshot,
    addDoc,
    serverTimestamp,
} from "firebase/firestore";
import router, { useRouter } from "next/router";
import Page404 from "@/components/pages/404";
import CourseInfoForm from "@/components/pages/courses/form";
import { CardTitle, MainCard } from "@/components/card";
import ErrorShower from "@/components/common/error";
import Head from "next/head";
import { useGetDoc } from "@/hooks/fireStore";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoToButton } from "@/components/common/inputs/addButton";
import { DataBase } from "@/data";

export function SaveArea({
    level,
}: {
    level: QueryDocumentSnapshot<DataBase["Levels"]>;
}) {
    const [teacher] = useAuthState(auth);
    return (
        <>
            <Head>
                <title>Add Course</title>
            </Head>

            <MainCard>
                <CardTitle>Adding Course</CardTitle>
                <CardTitle>Level:{level.data().name}</CardTitle>
                <MainCard>
                    <CourseInfoForm
                        onData={async (data) => {
                            const col = createCollection("Courses");
                            await addDoc(col, {
                                ...data,
                                createdAt: serverTimestamp(),
                                levelId: level.id,
                                teacherId: teacher?.uid,
                                order: Date.now(),
                            });

                            router.push(`/levels/info?id=${level.id}`);
                        }}
                        buttonName="Submit"
                    />
                </MainCard>
            </MainCard>

            <div className="tw-mt-3">
                <GoToButton
                    label="Go To The Level"
                    href={`/levels/info?id=${level.id}`}
                />
            </div>
        </>
    );
}
export default function AddCourses() {
    const router = useRouter();
    const { levelId } = router.query;
    const {
        data: level,
        isLoading,
        error,
        isError,
    } = useGetDoc("Levels", levelId as string);

    if (typeof levelId != "string") return <Page404 />;
    if (isLoading || isError)
        return (
            <ErrorShower
                loading={isLoading}
                error={error as any}
            />
        );
    if (!level.exists()) return <Page404 message="The level is not exist" />;
    return <SaveArea level={level} />;
}
