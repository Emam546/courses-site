import DeleteDialog from "@/components/common/AlertDialog";
import { useGetDoc } from "@/hooks/fireStore";
import { formateDate } from "@/utils";
import { Pagination } from "@mui/material";
import { updateDoc } from "firebase/firestore";
import Link from "next/link";
import React, { useState } from "react";
import { perPage } from "../results/hooks";
import { QueryDocumentSnapshot } from "firebase/firestore";
import { getDocRef } from "@/firebase";
import { MainCard } from "@/components/card";

interface ElemProps {
    userTeacher: DataBase.WithOrder<DataBase.WithIdType<DataBase["Students"]>>;
}
export interface Props {
    page: number;
    users: ElemProps["userTeacher"][];
    totalUsers: number;
    setPage: (page: number) => any;
}
function UserShower({ userTeacher: user }: ElemProps) {
    const [blocked, setBlocked] = useState(user.blocked);
    const [open, setOpen] = useState(false);
    const { data: level } = useGetDoc("Levels", user.levelId);
    return (
        <>
            <tr>
                <td className="border-bottom-0">
                    <h6 className="fw-semibold mb-0">{user.order}</h6>
                </td>
                <td className="border-bottom-0">
                    <Link
                        href={`users/info?id=${user.id}`}
                        className=""
                    >
                        {user.displayname}
                    </Link>
                    {/* <span className="fw-normal">Web Designer</span> */}
                </td>
                <td className="border-bottom-0">
                    <p className="mb-0 fw-normal">{level?.data()?.name}</p>
                </td>
                <td className="border-bottom-0">
                    <p className="mb-0 fw-normal">
                        {formateDate(user.createdAt.toDate())}
                    </p>
                </td>
                <td className="border-bottom-0">
                    <div className="tw-flex tw-items-center mb-0 fw-normal">
                        <input
                            type="checkbox"
                            checked={blocked}
                            className="tw-mr-1"
                            onChange={async (e) => {
                                const v = e.target.checked;
                                if (v) setOpen(true);
                                else setBlocked(false);
                            }}
                            id={`block-${user.id}`}
                        />
                        <label id={`block-${user.id}`}>block</label>
                    </div>
                </td>
            </tr>
            <DeleteDialog
                onAccept={async () => {
                    await updateDoc(getDocRef("Students", user.id), {
                        blocked: true,
                    });
                    setBlocked(true);
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

export default function UsersTable({
    page,
    users,
    totalUsers,
    setPage,
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
                                    <TH>Id</TH>
                                    <TH>Name</TH>
                                    <TH>Level</TH>
                                    <TH>Created At</TH>
                                    <TH>Blocked</TH>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((doc) => {
                                    return (
                                        <UserShower
                                            userTeacher={doc}
                                            key={doc.id}
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
