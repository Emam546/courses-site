import { BigCard, CardTitle, MainCard } from "@/components/card";
import ErrorShower from "@/components/common/error";
import { GoToButton } from "@/components/common/inputs/addButton";
import Page404 from "@/components/pages/404";
import QuestionInfoForm from "@/components/pages/questions/form";
import { getDocRef } from "@/firebase";
import { QueryDocumentSnapshot, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import Head from "next/head";
import { updateInfinityQuestions } from "@/components/pages/questions/info";
import { useDocument } from "@/hooks/fireStore";
import { useState } from "react";
interface Props {
    doc: DataBase.WithIdType<DataBase["Questions"]>;
}

function Page({ doc: initData }: Props) {
    const [doc, setDoc] = useState(initData);
    return (
        <>
            <Head>
                <title>Question</title>
            </Head>
            <BigCard>
                <div className="tw-flex tw-justify-between">
                    <CardTitle>Update Question Data</CardTitle>
                    <p className="tw-text-sm tw-text-gray-400 tw-pr-3">
                        {doc.createdAt.toDate().getTime()}
                    </p>
                </div>
                <MainCard>
                    <QuestionInfoForm
                        defaultData={doc}
                        onData={async (data) => {
                            await updateDoc(getDocRef("Questions", doc.id), {
                                ...data,
                            });
                            updateInfinityQuestions(
                                {
                                    ...doc,
                                    ...data,
                                },
                                doc.lessonId
                            );
                            setDoc({ ...doc, ...data });
                            alert("The document updated successfully");
                        }}
                        buttonName="Update"
                    />
                </MainCard>
            </BigCard>
            <div className="py-3">
                <GoToButton
                    label={"Go To Lesson"}
                    href={`/lessons?id=${doc.lessonId}`}
                />
            </div>
        </>
    );
}
export default function SafeArea() {
    const router = useRouter();
    const id = router.query.id;
    const [doc, loading, error] = useDocument("Questions", id as string);
    if (typeof id != "string")
        return <Page404 message="You must provide The page id with url" />;
    if (loading || error)
        return (
            <ErrorShower
                loading={loading}
                error={error}
            />
        );
    if (!doc.exists())
        return <Page404 message="The Question id is not exist" />;
    return <Page doc={{ id: doc.id, ...doc.data() }} />;
}
