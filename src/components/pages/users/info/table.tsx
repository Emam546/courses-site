import DeleteDialog from "@/components/common/AlertDialog";
import { useGetDoc } from "@/hooks/fireStore";
import { formateDate, hasOwnProperty } from "@/utils";
import { Pagination } from "@mui/material";
import { Timestamp, serverTimestamp, updateDoc } from "firebase/firestore";
import Link from "next/link";
import React, { useState } from "react";
import { perPage } from "../results/hooks";
import { auth, getDocRef } from "@/firebase";
import { TeacherComp } from "../../lessons/assistants/info";
import { useAuthState } from "react-firebase-hooks/auth";

interface ElemProps {
    userTeacher: DataBase.WithOrder<DataBase.WithIdType<DataBase["Students"]>>;
}
type HeadKeys =
    | keyof DataBase["Students"]
    | "order"
    | "userName"
    | "creatorId"
    | "emailVerified";
export interface Props {
    page: number;
    users: ElemProps["userTeacher"][];
    totalUsers: number;
    setPage: (page: number) => any;
    headKeys: HeadKeys[];
}
function UserShower({
    userTeacher: user,
    headKeys,
}: ElemProps & { headKeys: HeadKeys[] }) {
    const [blocked, setBlocked] = useState(user.blocked);
    const [open, setOpen] = useState(false);
    const { data: level } = useGetDoc("Levels", user.levelId);
    const { data: teacher } = useGetDoc(
        "Teacher",
        hasOwnProperty(user, "userName") ? user.creatorId : undefined
    );
    const [STeacher] = useAuthState(auth);
    return (
        <>
            <tr>
                <E
                    val="order"
                    heads={headKeys}
                >
                    <td>
                        <h6 className="fw-semibold mb-0">{user.order}</h6>
                    </td>
                </E>
                <E
                    val="displayname"
                    heads={headKeys}
                >
                    <td>
                        <Link
                            href={`/users/info?id=${user.id}`}
                            className="tw-block"
                        >
                            {user.displayname}
                        </Link>
                        {hasOwnProperty(user, "userName") && (
                            <span className="fw-normal">{user.userName}</span>
                        )}
                    </td>
                </E>

                <E
                    val="levelId"
                    heads={headKeys}
                >
                    <td>
                        <p className="mb-0 fw-normal">
                            {level?.data()?.name || "Deleted"}
                        </p>
                    </td>
                </E>
                <E
                    val="createdAt"
                    heads={headKeys}
                >
                    <td>
                        <p className="mb-0 fw-normal">
                            {formateDate(user.createdAt.toDate())}
                        </p>
                    </td>
                </E>
                <E
                    heads={headKeys}
                    val="creatorId"
                >
                    <td>
                        {teacher &&
                            (teacher.exists() ? (
                                <TeacherComp
                                    user={{
                                        id: teacher.id,
                                        ...teacher.data(),
                                    }}
                                />
                            ) : undefined)}
                    </td>
                </E>
                <E
                    val="blocked"
                    heads={headKeys}
                >
                    <td>
                        <div className="tw-flex tw-items-center mb-0 fw-normal">
                            <input
                                type="checkbox"
                                checked={new Boolean(blocked).valueOf()}
                                className="tw-mr-1"
                                onChange={async (e) => {
                                    const v = e.target.checked;
                                    if (v) return setOpen(true);
                                    await updateDoc(
                                        getDocRef("Students", user.id),
                                        {
                                            blocked: null,
                                        }
                                    );
                                    setBlocked(null);
                                }}
                                id={`block-${user.id}`}
                            />
                            <label id={`block-${user.id}`}>block</label>
                        </div>
                    </td>
                </E>
            </tr>
            <DeleteDialog
                onAccept={async () => {
                    await updateDoc(getDocRef("Students", user.id), {
                        blocked: {
                            at: serverTimestamp(),
                            teacherId: STeacher!.uid,
                        },
                    });
                    setBlocked({
                        at: Timestamp.fromDate(new Date()),
                        teacherId: STeacher!.uid,
                    });
                    setOpen(false);
                }}
                onClose={function () {
                    setOpen(false);
                }}
                open={open}
                data={{
                    title: `Block User`,
                    desc: `Once you click Block, The user will be blocked form the courses and he will have no more access on teh server`,
                    accept: `Block ${user.displayname}`,
                    deny: "Keep",
                }}
            />
        </>
    );
}
export function TH({ children }: { children: string }) {
    return (
        <th className="border-bottom-0">
            <h6 className="fw-semibold mb-0">{children}</h6>
        </th>
    );
}
function E({
    val,
    heads,
    children,
}: {
    val: HeadKeys;
    heads: HeadKeys[];
    children: React.ReactNode;
}) {
    if (!heads.includes(val)) return null;
    return <>{children}</>;
}
export default function UsersTable({
    page,
    users,
    totalUsers,
    setPage,
    headKeys,
}: Props) {
    const pageNum = Math.floor(totalUsers / perPage);

    return (
        <div>
            {totalUsers > 0 && (
                <>
                    <div className="table-responsive">
                        <table className="table text-nowrap mb-0 align-middle">
                            <thead className="text-dark fs-4">
                                <tr>
                                    <E
                                        heads={headKeys}
                                        val="order"
                                    >
                                        <TH>Id</TH>
                                    </E>
                                    <E
                                        heads={headKeys}
                                        val="displayname"
                                    >
                                        <TH>Name</TH>
                                    </E>
                                    <E
                                        heads={headKeys}
                                        val="levelId"
                                    >
                                        <TH>Level</TH>
                                    </E>
                                    <E
                                        heads={headKeys}
                                        val="createdAt"
                                    >
                                        <TH>Created At</TH>
                                    </E>
                                    <E
                                        heads={headKeys}
                                        val="creatorId"
                                    >
                                        <TH>Creator</TH>
                                    </E>
                                    <E
                                        heads={headKeys}
                                        val="blocked"
                                    >
                                        <TH>Blocked</TH>
                                    </E>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((doc) => {
                                    return (
                                        <UserShower
                                            userTeacher={doc}
                                            key={doc.id}
                                            headKeys={headKeys}
                                        />
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {pageNum > 0 && (
                        <div className="tw-mt-2">
                            <Pagination
                                onChange={(e, value) => {
                                    setPage(value);
                                }}
                                page={page}
                                count={pageNum}
                            />
                        </div>
                    )}
                </>
            )}
            {totalUsers == 0 && (
                <p className="tw-mb-0">There is no users so far</p>
            )}
        </div>
    );
}
