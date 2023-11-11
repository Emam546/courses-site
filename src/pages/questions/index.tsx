import { CardTitle, MainCard } from "@/components/card";
import ErrorShower from "@/components/common/error";
import { GoToButton } from "@/components/common/inputs/addButton";
import Page404 from "@/components/pages/404";
import QuestionInfoForm from "@/components/pages/questions/form";
import { getDocRef } from "@/firebase";
import { QueryDocumentSnapshot, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useDocument } from "react-firebase-hooks/firestore";
import Head from "next/head";
import { updateInfinityQuestions } from "@/components/pages/questions/info";
interface UpdateForm {
    doc: QueryDocumentSnapshot<DataBase["Questions"]>;
}
function UpdateForm({ doc }: UpdateForm) {
    return (
        <>
            <div className="tw-flex tw-justify-between">
                <CardTitle>Update Question Data</CardTitle>
                <p className="tw-text-sm tw-text-gray-400 tw-pr-3">
                    {doc.data().createdAt.toDate().getTime()}
                </p>
            </div>
            <MainCard>
                <QuestionInfoForm
                    defaultData={doc.data()}
                    onData={async (data) => {
                        await updateDoc(doc.ref, {
                            ...data,
                        });
                        updateInfinityQuestions(
                            {
                                id: doc.id,
                                ...doc.data(),
                                ...data,
                            },
                            doc.data().lessonId
                        );
                        alert("The document updated successfully");
                    }}
                    buttonName="Update"
                />
            </MainCard>
        </>
    );
}
function SafeArea({ id }: { id: string }) {
    const [doc, loading, error] = useDocument(
        getDocRef("Questions", id as string)
    );
    if (doc && !doc.exists())
        return <Page404 message="The Question id is not exist" />;
    return (
        <div className="tw-flex-1 tw-flex tw-flex-col tw-items-stretch">
            <Head>
                <title>Question</title>
            </Head>
            <div className="tw-flex-1">
                <ErrorShower
                    loading={loading}
                    error={error}
                />
                <MainCard>{doc && <UpdateForm doc={doc} />}</MainCard>
            </div>
            <div className="py-3">
                <GoToButton
                    label={"Go To Lesson"}
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
