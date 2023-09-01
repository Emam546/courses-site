import { useState } from "react";
import InfoGetter, { CreateElem } from "@/components/InsertCommonData";
import { Elem as OrgElem } from "@/components/InsertCommonData/Elem";
import { DataBase, WithIdType } from "@/data";
import Link from "next/link";
import { useCollection } from "react-firebase-hooks/firestore";
import { createCollection, getDocRef } from "@/firebase";
import {
    deleteDoc,
    orderBy,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import DeleteDialog from "@/components/common/AlertDialog";
import ErrorShower from "@/components/common/error";
export type T = WithIdType<DataBase["Questions"]>;

export const Elem = CreateElem<T>(({ index, props: { data }, ...props }, ref) => {
    return (
        <OrgElem
            {...props}
            ref={ref}
        >
            <div className="tw-flex tw-justify-between tw-items-center">
                <Link href={`/questions?id=${data.id}`}></Link>
            </div>
        </OrgElem>
    );
});
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
                    <InfoGetter
                        Elem={Elem}
                        data={questions.docs.map((doc) => ({
                            id: doc.id,
                            ...doc.data(),
                        }))}
                        onDeleteElem={(elem) => setCurDel(elem)}
                        onResort={async (indexes) => {
                            await Promise.all(
                                indexes.map(async (newi, ci) =>
                                    updateDoc(questions.docs[ci].ref, {
                                        order: newi,
                                    })
                                )
                            );
                        }}
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
