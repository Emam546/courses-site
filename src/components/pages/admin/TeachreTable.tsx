import DeleteDialog from "@/components/common/AlertDialog";
import { formateDate } from "@/utils";
import { Pagination } from "@mui/material";
import { Timestamp, serverTimestamp, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { useState } from "react";
import { auth, getDocRef } from "@/firebase";
import { TeacherComp } from "../lessons/assistants/info";
import { useAuthState } from "react-firebase-hooks/auth";
export const perPage = 15;
interface ElemProps {
    userTeacher: DataBase.WithOrder<DataBase.WithIdType<DataBase["Teacher"]>>;
}
export interface Props {
    page: number;
    users: ElemProps["userTeacher"][];
    totalUsers: number;
    setPage: (page: number) => any;
}
function TeacherShower({ userTeacher: user }: ElemProps) {
    const [blocked, setBlocked] = useState(user.blocked);
    const [open, setOpen] = useState(false);
    const [teacher] = useAuthState(auth);
    return (
        <>
            <tr>
                <td className="border-bottom-0">
                    <h6 className="fw-semibold mb-0">{user.order}</h6>
                </td>
                <td className="border-bottom-0">
                    <TeacherComp user={user} />
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
                            checked={new Boolean(blocked).valueOf()}
                            className="tw-mr-1"
                            onChange={async (e) => {
                                const v = e.target.checked;
                                if (v) return setOpen(true);
                                await updateDoc(getDocRef("Teacher", user.id), {
                                    blocked: null,
                                });
                                setBlocked(null);
                            }}
                            id={`block-${user.id}`}
                        />
                        <label id={`block-${user.id}`}>block</label>
                    </div>
                </td>
            </tr>
            <DeleteDialog
                onAccept={async () => {
                    await updateDoc(getDocRef("Teacher", user.id), {
                        blocked: {
                            at: serverTimestamp(),
                            teacherId: teacher!.uid,
                        },
                    });
                    setBlocked({
                        at: Timestamp.fromDate(new Date()),
                        teacherId: teacher!.uid,
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
                    accept: `Block ${user.displayName}`,
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
        <div className="tw-w-full">
            {totalUsers > 0 && (
                <>
                    <div className="table-responsive tw-w-full">
                        <table className="table text-nowrap mb-0 align-middle">
                            <thead className="text-dark fs-4">
                                <tr>
                                    <TH>Id</TH>
                                    <TH>Name</TH>
                                    <TH>Created At</TH>
                                    <TH>Blocked</TH>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((doc) => {
                                    return (
                                        <>
                                            <TeacherShower
                                                userTeacher={doc}
                                                key={doc.id}
                                            />
                                        </>
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
                <p className="tw-mb-0">There is no teachers so far</p>
            )}
        </div>
    );
}
