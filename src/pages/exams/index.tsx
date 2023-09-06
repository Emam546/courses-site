import { CardTitle, MainCard } from "@/components/card";
import ErrorShower from "@/components/common/error";
import { GoToButton } from "@/components/common/inputs/addButton";
import Page404 from "@/components/pages/404";
import ExamInfoForm from "@/components/pages/exams/form";
import ExamResultGenerator from "@/components/pages/exams/results";
import { DataBase } from "@/data";
import { getDocRef } from "@/firebase";
import { QueryDocumentSnapshot, updateDoc } from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useDocument } from "react-firebase-hooks/firestore";
interface UpdateForm {
    doc: QueryDocumentSnapshot<DataBase["Exams"]>;
}
function UpdateForm({ doc }: UpdateForm) {
    return (
        <>
            <CardTitle>Update Exam Data</CardTitle>
            <ExamInfoForm
                defaultData={
                    {
                        ...doc.data(),
                        publishedAt: (doc.data()?.createdAt as any).toDate(),
                    } as any
                }
                onData={async (data) => {
                    await updateDoc(doc.ref, {
                        ...data,
                    });
                    alert("the document updated successfully");
                }}
                buttonName={"Update"}
                lessonId={doc.data()!.lessonId}
            />
        </>
    );
}
function SafeArea({ id }: { id: string }) {
    const [doc, loading, error] = useDocument(getDocRef("Exams", id));
    if (doc && !doc.exists())
        return <Page404 message="The Exam id is not exist" />;
    return (
        <div className="tw-flex-1 tw-flex tw-flex-col tw-items-stretch">
            <div className="tw-flex-1">
                <ErrorShower
                    loading={loading}
                    error={error}
                />
                <Head>
                    <title>{doc?.data().name}</title>
                </Head>
                {doc && (
                    <MainCard>
                        <UpdateForm doc={doc} />
                        <CardTitle>Results</CardTitle>
                        <ExamResultGenerator examId={doc.id} />
                    </MainCard>
                )}
            </div>
            <div className="py-3">
                <GoToButton
                    label="Go To Lesson"
                    href={`/lessons?id=${doc?.data()?.lessonId}`}
                />
            </div>
        </div>
    );
}
export default function Page() {
    const router = useRouter();
    const id = router.query.id;
    if (typeof id != "string")
        return <Page404 message="You must provide The page id with url" />;
    return <SafeArea id={id} />;
}
