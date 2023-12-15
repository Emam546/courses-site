import { useState } from "react";
import InfoGetter, { CreateElem } from "../../InsertCommonData";
import { Elem as OrgElem } from "../../InsertCommonData/Elem";

import Link from "next/link";
import { auth, fireStore, getDocRef } from "@/firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import DeleteDialog from "../../common/AlertDialog";
import { useAuthState } from "react-firebase-hooks/auth";
export type T = DataBase.WithIdType<DataBase["Levels"]>;

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
export interface Props {
    levels: DataBase.WithIdType<DataBase["Levels"]>[];
    isNotCreator?: boolean;
}
export default function LevelsInfoGetter({
    levels: initLevels,
    isNotCreator,
}: Props) {
    const [curDel, setCurDel] = useState<T>();
    const [levels, setLevels] = useState(initLevels);

    return (
        <>
            <>
                {levels.length > 0 && (
                    <InfoGetter
                        Elem={Elem}
                        data={levels}
                        onDeleteElem={
                            isNotCreator ? undefined : (elem) => setCurDel(elem)
                        }
                        onResort={
                            isNotCreator
                                ? undefined
                                : async (indexes) => {
                                      await Promise.all(
                                          indexes.map(async (newi, ci) => {
                                              updateDoc(
                                                  getDocRef(
                                                      "Levels",
                                                      levels[ci].id
                                                  ),
                                                  {
                                                      order: newi,
                                                  }
                                              );
                                          })
                                      );
                                      setLevels(
                                          indexes
                                              .map((newi, ci) => ({
                                                  ...levels[ci],
                                                  order: newi,
                                              }))
                                              .sort((a, b) => a.order - b.order)
                                      );
                                  }
                        }
                    />
                )}
                {levels.length == 0 && (
                    <p className="tw-mb-0">
                        There is no levels so far please add some levels
                    </p>
                )}
            </>

            <DeleteDialog
                onAccept={async () => {
                    if (curDel) {
                        await deleteDoc(doc(fireStore, "Levels", curDel.id));
                        setLevels(levels.filter((val) => val.id != curDel.id));
                    }
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
