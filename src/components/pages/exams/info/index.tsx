import { useState } from "react";
import InfoGetter, { CreateElem } from "../../../InsertCommonData";
import { Elem as OrgElem } from "../../../InsertCommonData/Elem";

import Link from "next/link";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, createCollection, getDocRef } from "@/firebase";
import {
    deleteDoc,
    orderBy,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import DeleteDialog from "../../../common/AlertDialog";
import ErrorShower from "../../../common/error";
import classNames from "classnames";
import CheckedInput from "../../../common/inputs/checked";
import { useAuthState } from "react-firebase-hooks/auth";
export type T = DataBase.WithIdType<DataBase["Exams"]>;

const Elem = CreateElem<T>(({ index, props: { data }, ...props }, ref) => {
    return (
        <OrgElem
            {...props}
            ref={ref}
        >
            <div className="tw-flex tw-justify-between tw-items-center">
                <Link
                    className={classNames({
                        "tw-text-gray-600": data.hide,
                        "tw-text-blue-600": !data.hide,
                    })}
                    href={`/exams?id=${data.id}`}
                >
                    {data.name}
                </Link>
                <div>
                    <CheckedInput
                        title="Hide"
                        checked={data.hide}
                        onChange={async () => {
                            await updateDoc(getDocRef("Exams", data.id), {
                                hide: !data.hide,
                            });
                        }}
                        id={"hide-input"}
                    />
                </div>
            </div>
        </OrgElem>
    );
});
export interface Props {
    lessonId: string;
}
export default function ExamsInfoGetter({ lessonId }: Props) {
    const collectionExams = createCollection("Exams");
    const [teacher] = useAuthState(auth);
    const [curDel, setCurDel] = useState<T>();
    const [courses, loading, error] = useCollection(
        query(
            collectionExams,
            where("lessonId", "==", lessonId),
            orderBy("order")
        )
    );

    return (
        <>
            <ErrorShower
                error={error}
                loading={loading}
            />
            {courses && courses.size > 0 && (
                <>
                    <InfoGetter
                        Elem={Elem}
                        data={courses.docs.map((doc) => ({
                            id: doc.id,
                            ...doc.data(),
                        }))}
                        onDeleteElem={(elem) => setCurDel(elem)}
                        onResort={async (indexes) => {
                            await Promise.all(
                                indexes.map(async (newi, ci) =>
                                    updateDoc(courses.docs[ci].ref, {
                                        order: newi,
                                    })
                                )
                            );
                        }}
                    />
                </>
            )}
            {courses && courses.size == 0 && (
                <p>There is no Exams so far please add some Exams</p>
            )}
            <DeleteDialog
                onAccept={async () => {
                    if (curDel) await deleteDoc(getDocRef("Exams", curDel.id));
                    setCurDel(undefined);
                }}
                onClose={function () {
                    setCurDel(undefined);
                }}
                open={curDel != undefined}
                data={{
                    title: `Delete Exam`,
                    desc: `Once you click delete, The Exam and associated data will be permanently deleted and cannot be restored.`,
                    accept: `Delete ${curDel?.name} Exam`,
                    deny: "Keep",
                }}
            />
        </>
    );
}
