import { BigCard, CardTitle, MainCard } from "@/components/card";
import ErrorShower from "@/components/common/error";
import AddButton, { GoToButton } from "@/components/common/inputs/addButton";
import Page404 from "@/components/pages/404";
import ExamsInfoGetter from "@/components/pages/exams/info";
import LessonGetDataForm from "@/components/pages/lessons/form";
import { getDocRef } from "@/firebase";
import { useDocument } from "@/hooks/fireStore";
import { updateDoc } from "firebase/firestore";
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
                <CardTitle>Update Lesson Data</CardTitle>
                <MainCard>
                    <LessonGetDataForm
                        courseId={doc.courseId}
                        defaultData={doc}
                        onData={async (data) => {
                            await updateDoc(getDocRef("Lessons", doc.id), {
                                ...data,
                            });
                            setDoc({ ...doc, ...data });
                            alert("the Document updated successfully");
                        }}
                        buttonName={"Update"}
                    />
                </MainCard>
                <CardTitle>Exams</CardTitle>
                <MainCard>
                    <ExamsInfoGetter lessonId={doc.id} />
                </MainCard>
            </BigCard>
            <div className="py-3">
                <AddButton
                    label="Add Exams"
                    href={`/exams/add?lessonId=${doc.id}`}
                />
                <AddButton
                    label="Add questions"
                    href={`/questions/add?lessonId=${doc.id}`}
                />
                <GoToButton
                    label="Go To questions"
                    href={`/lessons/questions?id=${doc.id}`}
                />
                <GoToButton
                    label="Go To The Course"
                    href={`/courses?id=${doc.courseId}`}
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
    if (doc && !doc.exists())
        return <Page404 message="The Course id is not exist" />;

    return <Page doc={{ id, ...doc.data() }} />;
}
