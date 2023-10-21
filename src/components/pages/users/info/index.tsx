import { useEffect, useState } from "react";
import { DataBase } from "@/data";
import { updateDoc } from "firebase/firestore";
import ErrorShower from "../../../common/error";
import { QueryDocumentSnapshot } from "firebase/firestore";
import Pagination from "@mui/material/Pagination";
import { SelectCourse } from "./selectLevel";
import DeleteDialog from "@/components/common/AlertDialog";
import { useGetUser as useGetUsers, useGetUsersCount } from "./hooks";
import { formateDate } from "@/utils";
import styles from "../../style.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";
import { useGetDoc } from "@/hooks/fireStore";
import { perPage } from "../results/hooks";
interface ElemProps {
    userTeacher: QueryDocumentSnapshot<DataBase["UsersTeachers"]>;
}

function UserShower({ userTeacher: user }: ElemProps) {
    const [blocked, setBlocked] = useState(user.data().blocked);
    const [open, setOpen] = useState(false);
    const { data: level } = useGetDoc("Levels", user.data().levelId);
    return (
        <>
            <tr>
                <td>
                    <Link
                        href={`users/info?id=${user.id}`}
                        className=""
                    >
                        {user.data().displayname}
                    </Link>
                </td>
                <td>{level?.data()?.name}</td>
                <td>{formateDate(user.data().createdAt.toDate())}</td>

                <td>
                    <div className="tw-flex tw-items-center">
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
                    await updateDoc(user.ref, {
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
                    accept: `Block ${user.data().displayname}`,
                    deny: "Keep",
                }}
            />
        </>
    );
}

export default function UserInfoGenerator() {
    const router = useRouter();
    const [page, setPage] = useState(0);
    const [levelId, setLevelId] = useState<string | undefined>(
        router.query["levelId"] as string
    );
    const [courseId, setCourseId] = useState<string | undefined>(
        router.query["courseId"] as string
    );
    const queryCount = useGetUsersCount({
        courseId,
        levelId,
    });
    const queryUsers = useGetUsers({
        courseId,
        levelId,
        page: page,
    });
    const users = queryUsers.data;
    const count = queryCount.data;
    useEffect(() => {
        if (courseId)
            router.replace(
                "/users",
                { query: { levelId, courseId } },
                { scroll: false }
            );
        else
            router.replace("/users", { query: { levelId } }, { scroll: false });
    }, [courseId]);
    useEffect(() => {
        setCourseId(undefined);
    }, [levelId]);
    return (
        <>
            <SelectCourse
                onCourse={(course) => setCourseId(course?.id)}
                onLevel={(level) => {
                    setLevelId(level?.id);
                }}
                courseId={courseId}
                levelId={levelId}
            />
            <div className="tw-mt-3">
                <ErrorShower
                    loading={queryUsers.isLoading || queryCount.isLoading}
                    error={(queryCount.error || queryUsers.error) as any}
                />
                {users && count != undefined && (
                    <div className="mt-3">
                        {count > 0 && (
                            <>
                                <table
                                    className={styles.table}
                                    border={1}
                                >
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Level</th>
                                            <th>Created At</th>
                                            <th>Blocked</th>
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
                                <div className="tw-mt-5">
                                    <Pagination
                                        onChange={(e, value) => {
                                            setPage(value);
                                        }}
                                        page={page}
                                        count={Math.floor(
                                            queryCount.data / perPage
                                        )}
                                    />
                                </div>
                            </>
                        )}
                        {count == 0 && <p>There is no users so far</p>}
                    </div>
                )}
            </div>
        </>
    );
}