import { BigCard, CardTitle, MainCard } from "@/components/card";
import ErrorShower from "@/components/common/error";
import AddButton, { GoToButton } from "@/components/common/inputs/addButton";
import Page404 from "@/components/pages/404";
import LessonGetDataForm from "@/components/pages/assistant/lessons/form";
import { useDocument } from "@/hooks/fireStore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

export interface Props {
    doc: DataBase.WithIdType<DataBase["Lessons"]>;
}
function Page({ doc: initData }: Props) {
    const [doc, setDoc] = useState(initData);
    return (
        <>
            <Head>
                <title>{doc.name}</title>
            </Head>
            <BigCard>
                <CardTitle>Lesson Data</CardTitle>
                <MainCard>
                    <LessonGetDataForm defaultData={doc} />
                </MainCard>
            </BigCard>
            <div className="py-3">
                <AddButton
                    label="Add questions"
                    href={`/questions/add?lessonId=${doc.id}`}
                />
                <GoToButton
                    label="Go To questions"
                    href={`/lessons/questions?id=${doc.id}`}
                />
                <GoToButton
                    label="Go To The Assistant Page"
                    href={`/assistant`}
                />
            </div>
        </>
    );
}
export default function SafeArea() {
    const router = useRouter();
    const id = router.query.id;
    const [doc, loading, error] = useDocument("Lessons", id as string);
    if (typeof id != "string")
        return <Page404 message="You must provide The page id with url" />;
    if (loading || error)
        return (
            <ErrorShower
                loading={loading}
                error={error}
            />
        );
    if (!doc.exists()) return <Page404 message="The Course id is not exist" />;

    return <Page doc={{ id, ...doc.data() }} />;
}
