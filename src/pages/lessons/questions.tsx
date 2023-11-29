import { BigCard, CardTitle, MainCard } from "@/components/card";
import ErrorShower from "@/components/common/error";
import AddButton, { GoToButton } from "@/components/common/inputs/addButton";
import { ErrorInputShower } from "@/components/common/inputs/main";
import Page404 from "@/components/pages/404";
import QuestionInfoGetter from "@/components/pages/questions/info";
import { useDocument } from "@/hooks/fireStore";
import Head from "next/head";
import { useRouter } from "next/router";
export interface Props {
    lesson: DataBase.WithIdType<DataBase["Lessons"]>;
}
function Page({ lesson }: Props) {
    return (
        <>
            <Head>
                <title>Questions</title>
            </Head>
            <BigCard>
                <CardTitle>Lesson:{lesson.name}</CardTitle>
                <CardTitle>Questions</CardTitle>
                <MainCard>
                    <QuestionInfoGetter lesson={lesson} />
                </MainCard>
            </BigCard>
            <div className="py-3">
                <AddButton
                    label="Add Questions"
                    href={`/questions/add?lessonId=${lesson.id}`}
                />
                <GoToButton
                    label="Go To Lesson"
                    href={`/lessons?id=${lesson.id}`}
                />
            </div>
        </>
    );
}
export default function SafeArea() {
    const router = useRouter();
    const id = router.query.id;
    const [lesson, loading, error] = useDocument("Lessons", id as string);
    if (typeof id != "string") return <Page404 />;
    if (loading || error)
        return (
            <ErrorShower
                loading={loading}
                error={error}
            />
        );
    if (!lesson.exists()) return <Page404 />;
    return <Page lesson={{ id: lesson.id, ...lesson.data() }} />;
}
