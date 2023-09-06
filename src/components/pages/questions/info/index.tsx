import { useState } from "react";
import { DataBase, WithIdType } from "@/data";
import { useCollection } from "react-firebase-hooks/firestore";
import { createCollection, getDocRef } from "@/firebase";
import { deleteDoc, orderBy, query, where } from "firebase/firestore";
import DeleteDialog from "@/components/common/AlertDialog";
import ErrorShower from "@/components/common/error";
import QuestionInfoViewer from "./questionInfoViewer";
export type T = WithIdType<DataBase["Questions"]>;

export interface Props {
    lessonId: string;
}
export default function QuestionsInfoGetter({ lessonId }: Props) {
    const collectionQuestions = createCollection("Questions");
    const [curDel, setCurDel] = useState<T>();
    const [questions, loading, error] = useCollection(
        query(
            collectionQuestions,
            where("lessonId", "==", lessonId),
            orderBy("createdAt", "desc")
        )
    );

    return (
        <>
            <ErrorShower
                error={error}
                loading={loading}
            />
            {questions && questions.size > 0 && (
                <>
                    <QuestionInfoViewer
                        data={questions.docs.map((v) => ({
                            id: v.id,
                            ...v.data(),
                            createdAt: (v.data().createdAt as any).toDate(),
                        }))}
                        onDeleteElem={async (v) => {
                            await deleteDoc(getDocRef("Questions", v.id));
                        }}
                        noDragging
                    />
                </>
            )}
            {questions && questions.size == 0 && (
                <p>There is no Questions so far please add some Questions</p>
            )}
            <DeleteDialog
                onAccept={async () => {
                    if (curDel)
                        await deleteDoc(getDocRef("Questions", curDel.id));
                    setCurDel(undefined);
                }}
                onClose={function () {
                    setCurDel(undefined);
                }}
                open={curDel != undefined}
                data={{
                    title: `Delete Question`,
                    desc: `Once you click delete, The Question and associated data will be permanently deleted and cannot be restored.`,
                    accept: `Delete Question`,
                    deny: "Keep",
                }}
            />
        </>
    );
}
