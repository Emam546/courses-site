import { BigCard, CardTitle, MainCard } from "@/components/card";
import ErrorShower from "@/components/common/error";
import { GoToButton } from "@/components/common/inputs/addButton";
import Page404 from "@/components/pages/404";
import QuestionInfoForm from "@/components/pages/questions/form";
import { auth, getDocRef } from "@/firebase";
import { updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import Head from "next/head";
import { useDocument } from "@/hooks/fireStore";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
interface Props {
    doc: DataBase.WithIdType<DataBase["Questions"]>;
    lesson: DataBase.WithIdType<DataBase["Lessons"]>;
}

function Page({ doc: initData, lesson }: Props) {
    const [doc, setDoc] = useState(initData);
    const [teacher] = useAuthState(auth);
    const isCanEdit =
        teacher?.uid == lesson.teacherId ||
        (teacher && lesson.adderIds.includes(teacher?.uid) != undefined);
    return (
        <>
            <Head>
                <title>{lesson.name}:Question</title>
            </Head>
            <BigCard>
                <div className="tw-flex tw-justify-between">
                    <CardTitle>Lesson : {lesson.name}</CardTitle>
                </div>
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
                    href={
                        isCanEdit
                            ? `/lessons?id=${doc.lessonId}`
                            : `/assistant/lessons?id=${doc.lessonId}`
                    }
                />
            </div>
        </>
    );
}
export default function SafeArea() {
    const router = useRouter();
    const id = router.query.id;
    const [doc, loading, error] = useDocument("Questions", id as string);
    const [lesson, loading2, error2] = useDocument(
        "Lessons",
        doc?.data()?.lessonId
    );
    if (typeof id != "string")
        return <Page404 message="You must provide The page id with url" />;
    if (error || error2) return <ErrorShower error={error || error2} />;
    if (loading || loading2) return <ErrorShower loading />;
    if (!doc.exists())
        return <Page404 message="The Question id is not exist" />;
    if (!lesson.exists()) return <Page404 message="The lesson is not exist" />;
    return (
        <Page
            lesson={{ id: lesson.id, ...lesson.data() }}
            doc={{ id: doc.id, ...doc.data() }}
        />
    );
}
