import { auth, createCollection } from "@/firebase";
import {
    QueryDocumentSnapshot,
    addDoc,
    serverTimestamp,
} from "firebase/firestore";
import router, { useRouter } from "next/router";
import Page404 from "@/components/pages/404";
import CourseInfoForm from "@/components/pages/courses/form";
import { BigCard, CardTitle, MainCard } from "@/components/card";
import ErrorShower from "@/components/common/error";
import Head from "next/head";
import { useDocument } from "@/hooks/fireStore";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoToButton } from "@/components/common/inputs/addButton";
export interface Props {
    level: DataBase.WithIdType<DataBase["Levels"]>;
}
export function Page({ level }: Props) {
    const [teacher] = useAuthState(auth);
    return (
        <>
            <Head>
                <title>{level.name}:Add Course</title>
            </Head>

            <BigCard>
                <CardTitle className="tw-mb-2">Adding Course</CardTitle>
                <CardTitle>Level:{level.name}</CardTitle>
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
                        creatorId={teacher!.uid}
                        assistants={[]}
                        buttonName="Submit"
                    />
                </MainCard>
            </BigCard>

            <div className="tw-mt-3">
                <GoToButton
                    label="Go To The Level"
                    href={`/levels/info?id=${level.id}`}
                />
            </div>
        </>
    );
}
export default function SafeArea() {
    const router = useRouter();
    const { levelId } = router.query;
    const [level, isLoading, error] = useDocument("Levels", levelId as string);

    if (typeof levelId != "string") return <Page404 />;
    if (isLoading || error)
        return (
            <ErrorShower
                loading={isLoading}
                error={error}
            />
        );
    if (!level.exists()) return <Page404 message="The level is not exist" />;
    return <Page level={{ id: levelId, ...level.data() }} />;
}
