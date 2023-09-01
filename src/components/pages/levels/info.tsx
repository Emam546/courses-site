import React, { useState } from "react";
import InfoGetter, {
    CreateElem,
    Props as InfoProps,
} from "../../InsertCommonData";
import { Elem as OrgElem } from "../../InsertCommonData/Elem";
import { DataBase, WithIdType } from "@/data";
import Link from "next/link";
import { useCollection } from "react-firebase-hooks/firestore";
import { createCollection, fireStore, getDocRef } from "@/firebase";
import {
    deleteDoc,
    doc,
    getDoc,
    orderBy,
    query,
    updateDoc,
} from "firebase/firestore";
import DeleteDialog from "../../common/AlertDialog";
import ErrorShower from "../../common/error";
export type T = WithIdType<DataBase["Levels"]>;

const Elem = CreateElem<T>(({ index, props: { data }, ...props }, ref) => {
    return (
        <OrgElem
            {...props}
            ref={ref}
        >
            <Link href={`/levels/info?id=${data.id}`}>{data.name}</Link>
        </OrgElem>
    );
});

export default function LevelsInfoGetter() {
    const col = createCollection("Levels");
    const [curDel, setCurDel] = useState<T>();
    const [levels, loading, error] = useCollection(
        query(col, orderBy("order", "asc"))
    );

    if (!levels) return;
    return (
        <>
            <ErrorShower
                loading={loading}
                error={error}
            />
            {levels.size > 0 && (
                <InfoGetter
                    Elem={Elem}
                    data={levels.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }))}
                    onDeleteElem={(elem) => setCurDel(elem)}
                    onResort={async (indexes) => {
                        await Promise.all(
                            indexes.map(async (newi, ci) =>
                                updateDoc(levels.docs[ci].ref, {
                                    order: newi,
                                })
                            )
                        );
                    }}
                />
            )}
            {levels.size == 0 && (
                <p>There is no levels so far please add some levels</p>
            )}

            <DeleteDialog
                onAccept={async () => {
                    if (curDel)
                        await deleteDoc(doc(fireStore, "Levels", curDel.id));
                    setCurDel(undefined);
                }}
                onClose={function () {
                    setCurDel(undefined);
                }}
                open={curDel != undefined}
                data={{
                    title: `Delete Level`,
                    desc: `Once you click delete, The Level and associated data will be permanently deleted and cannot be restored.`,
                    accept: `Delete ${curDel?.name} level`,
                    deny: "Keep",
                }}
            />
        </>
    );
}
