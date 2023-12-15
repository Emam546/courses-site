import React, { useState } from "react";
import { auth, getDocRef } from "@/firebase";
import { deleteDoc } from "firebase/firestore";
import DeleteDialog from "../../../common/AlertDialog";
import Link from "next/link";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TeacherImage } from "../../teachers/form";
import { useAuthState } from "react-firebase-hooks/auth";
export type T = DataBase.WithIdType<DataBase["Lessons"]>;

export interface Props {
    teachers: DataBase.WithIdType<DataBase["Teacher"]>[];
    isNotCreator?: boolean;
    onRemove?: (val: DataBase.WithIdType<DataBase["Teacher"]>) => {};
}
export function TeacherComp({
    user,
    children,
}: {
    user: DataBase.WithIdType<DataBase["Teacher"]>;
    children?: React.ReactNode;
}) {
    const [userG] = useAuthState(auth);
    return (
        <div
            key={user.id}
            className="tw-py-1 tw-flex tw-justify-between tw-items-center"
        >
            <div className="tw-flex tw-items-center tw-gap-x-3">
                <div className="tw-w-10">
                    <TeacherImage
                        src={user.photoUrl}
                        alt={user.displayName}
                    />
                </div>
                <div>
                    <Link
                        href={`/teachers/info?id=${user.id}`}
                        className="fw-semibold tw-block"
                    >
                        {userG?.uid == user.id ? "You" : user.displayName}
                    </Link>
                    <span className="fw-normal first-letter:tw-capitalize">
                        {user.type}
                    </span>
                </div>
            </div>
            <div>{children}</div>
        </div>
    );
}
export default function LessonsAssistantInfoGetter({
    teachers,
    onRemove,
    isNotCreator,
}: Props) {
    const [curDel, setCurDel] = useState<T>();
    return (
        <>
            {teachers.length > 0 && (
                <div>
                    {teachers.map((user, i) => {
                        return (
                            <div key={user.id}>
                                <TeacherComp user={user}>
                                    {onRemove && !isNotCreator && (
                                        <button
                                            className="tw-border-none tw-bg-inherit hover:tw-text-red-500 tw-text-xl tw-p-2"
                                            onClick={() => {
                                                onRemove(user);
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faXmark} />
                                        </button>
                                    )}
                                </TeacherComp>
                            </div>
                        );
                    })}
                </div>
            )}
            {teachers.length == 0 && (
                <p className="tw-mb-0">There is no Assistants so far please</p>
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
