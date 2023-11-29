import { BigCard, CardTitle, MainCard } from "@/components/card";
import ErrorShower from "@/components/common/error";
import { GoToButton } from "@/components/common/inputs/addButton";
import Page404 from "@/components/pages/404";
import ExamInfoForm from "@/components/pages/exams/form";
import ExamResultGenerator from "@/components/pages/exams/info/results";
import { getDocRef } from "@/firebase";
import { useDocument } from "@/hooks/fireStore";
import { updateDoc } from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
interface UpdateForm {
    doc: DataBase.WithIdType<DataBase["Exams"]>;
}

export interface Props {
    doc: DataBase.WithIdType<DataBase["Exams"]>;
}
function Page({ doc: initData }: Props) {
    const [doc, setDoc] = useState(initData);
    return (
        <>
            <Head>
                <title>{doc.name}</title>
            </Head>
            <BigCard className="tw-flex-1">
                <>
                    <CardTitle>Update Exam Data</CardTitle>
                    <MainCard>
                        <ExamInfoForm
                            defaultData={doc}
                            onData={async (data) => {
                                await updateDoc(getDocRef("Exams", doc.id), {
                                    ...data,
                                });
                                setDoc({ ...doc, ...data });
                                alert("the document updated successfully");
                            }}
                            buttonName={"Update"}
                            lessonId={doc.lessonId}
                        />
                    </MainCard>
                    <CardTitle>Results</CardTitle>
                    <MainCard>
                        <ExamResultGenerator examId={doc.id} />
                    </MainCard>
                </>
            </BigCard>
            <div className="py-3">
                <GoToButton
                    label="Go To Lesson"
                    href={`/lessons?id=${doc.lessonId}`}
                />
            </div>
        </>
    );
}
export default function SafeArea() {
    const router = useRouter();
    const id = router.query.id;
    const [exam, loading, error] = useDocument("Exams", id as string);
    if (typeof id != "string")
        return <Page404 message="You must provide The page id with url" />;
    if (loading || error)
        return (
            <ErrorShower
                loading={loading}
                error={error}
            />
        );
    if (!exam.exists()) return <Page404 message="The Exam id is not exist" />;

    return <Page doc={{ id: exam.id, ...exam.data() }} />;
}
