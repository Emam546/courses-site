import { useState } from "react";
import InfoGetter, { CreateElem } from "../../InsertCommonData";
import { Elem as OrgElem } from "../../InsertCommonData/Elem";
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
import DeleteDialog from "../../common/AlertDialog";
import ErrorShower from "../../common/error";
import classNames from "classnames";
import CheckedInput from "../../common/inputs/checked";
export type T = WithIdType<DataBase["Lessons"]>;

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
                            await updateDoc(getDocRef("Courses", data.id), {
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
}
export default function LessonsInfoGetter({ courseId }: Props) {
    const collectionCourses = createCollection("Lessons");
    const [curDel, setCurDel] = useState<T>();
    const [courses, loading, error] = useCollection(
        query(
            collectionCourses,
            where("courseId", "==", courseId),
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
                    if (curDel)
                        await deleteDoc(getDocRef("Courses", curDel.id));
                    setCurDel(undefined);
                }}
                onClose={function () {
                    setCurDel(undefined);
                }}
                open={curDel != undefined}
                data={{
                    title: `Delete Course`,
                    desc: `Once you click delete, The Lesson and associated data will be permanently deleted and cannot be restored.`,
                    accept: `Delete ${curDel?.name} lesson`,
                    deny: "Keep",
                }}
            />
        </>
    );
}
