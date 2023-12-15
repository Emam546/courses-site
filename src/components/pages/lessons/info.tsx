import { useState } from "react";
import InfoGetter, { CreateElem } from "../../InsertCommonData";
import { Elem as OrgElem } from "../../InsertCommonData/Elem";

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
import DeleteDialog from "../../common/AlertDialog";
import ErrorShower from "../../common/error";
import classNames from "classnames";
import CheckedInput from "../../common/inputs/checked";
import { useAuthState } from "react-firebase-hooks/auth";
export type T = DataBase.WithIdType<DataBase["Lessons"]>;

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
                    href={`/lessons?id=${data.id}`}
                >
                    {data.name}
                </Link>
                <div>
                    <CheckedInput
                        title="Hide"
                        checked={data.hide}
                        onChange={async () => {
                            await updateDoc(getDocRef("Lessons", data.id), {
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
    courseId: string;
    isNotCreator?: boolean;
}
export default function LessonsInfoGetter({ courseId, isNotCreator }: Props) {
    const collectionLesson = createCollection("Lessons");
    const [curDel, setCurDel] = useState<T>();
    const [teacher] = useAuthState(auth);
    const [courses, loading, error] = useCollection(
        query(
            collectionLesson,
            where("courseId", "==", courseId),
            where("teacherId", "==", teacher!.uid),
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
                        onDeleteElem={
                            isNotCreator ? undefined : (elem) => setCurDel(elem)
                        }
                        onResort={
                            isNotCreator
                                ? undefined
                                : async (indexes) => {
                                      await Promise.all(
                                          indexes.map(async (newi, ci) =>
                                              updateDoc(courses.docs[ci].ref, {
                                                  order: newi,
                                              })
                                          )
                                      );
                                  }
                        }
                    />
                </>
            )}
            {courses && courses.size == 0 && (
                <p>There is no Exams so far please add some Exams</p>
            )}
            <DeleteDialog
                onAccept={async () => {
                    if (curDel)
                        await deleteDoc(getDocRef("Lessons", curDel.id));
                    setCurDel(undefined);
                }}
                onClose={function () {
                    setCurDel(undefined);
                }}
                open={curDel != undefined}
                data={{
                    title: `Delete Lesson`,
                    desc: `Once you click delete, The Lesson and associated data will be permanently deleted and cannot be restored.`,
                    accept: `Delete ${curDel?.name} lesson`,
                    deny: "Keep",
                }}
            />
        </>
    );
}
