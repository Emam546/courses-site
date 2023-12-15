import { BigCard, CardTitle, MainCard } from "@/components/card";
import ErrorShower from "@/components/common/error";
import AddButton, { GoToButton } from "@/components/common/inputs/addButton";
import Page404 from "@/components/pages/404";
import QuestionInfoGetter from "@/components/pages/questions/info";
import { auth } from "@/firebase";
import { useDocument } from "@/hooks/fireStore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useGetTeachers } from ".";
export interface Props {
    lesson: DataBase.WithIdType<DataBase["Lessons"]>;
    assistantTeachers: DataBase.WithIdType<DataBase["Teacher"]>[];
}
function Page({ lesson, assistantTeachers }: Props) {
    const [teacher] = useAuthState(auth);
    const isCreator = teacher?.uid == lesson.teacherId;
    return (
        <>
            <Head>
                <title>Questions</title>
            </Head>
            <BigCard>
                <CardTitle>Lesson:{lesson.name}</CardTitle>
                <CardTitle>Questions</CardTitle>
                <MainCard>
                    <QuestionInfoGetter
                        teachers={assistantTeachers}
                        lesson={lesson}
                    />
                </MainCard>
            </BigCard>
            <div className="py-3">
                <AddButton
                    label="Add Questions"
                    href={`/questions/add?lessonId=${lesson.id}`}
                />
                <GoToButton
                    label="Go To Lesson"
                    href={
                        isCreator
                            ? `/lessons?id=${lesson.id}`
                            : `assistant/lessons?id=${lesson.id}`
                    }
                />
            </div>
        </>
    );
}
export default function SafeArea() {
    const router = useRouter();
    const id = router.query.id;
    const [lesson, loading, error] = useDocument("Lessons", id as string);
    const addersIds = lesson?.data()?.adderIds;
    const [teachers, loading2, error2] = useGetTeachers(
        addersIds ? [...addersIds, lesson.data()!.teacherId] : undefined
    );
    if (typeof id != "string") return <Page404 />;
    if (error || error2) return <ErrorShower error={error || error2} />;
    if (loading || loading2) return <ErrorShower loading />;

    if (!lesson.exists()) return <Page404 message="The lesson is not exist" />;
    return (
        <Page
            assistantTeachers={teachers}
            lesson={{ id: lesson.id, ...lesson.data() }}
        />
    );
}
