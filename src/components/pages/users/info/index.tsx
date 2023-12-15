import { useEffect, useState } from "react";

import ErrorShower from "../../../common/error";
import { SelectCourse } from "./selectLevel";
import { perPage, useGetUsers, useGetUsersCount } from "./hooks";
import { useRouter } from "next/router";
import UsersTable from "./table";
import { MainCard } from "@/components/card";

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
    const curCount = page * perPage + 1;
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
            <MainCard className="tw-mt-3 p-4">
                <ErrorShower
                    loading={queryUsers.isLoading || queryCount.isLoading}
                    error={queryCount.error || queryUsers.error}
                />
                <h5 className="card-title fw-semibold mb-4">Students</h5>
                {users && count != undefined && (
                    <div>
                        <UsersTable
                            page={page}
                            setPage={setPage}
                            totalUsers={count}
                            users={users.map((val, i) => ({
                                ...val.data(),
                                id: val.id,
                                order: i + curCount,
                            }))}
                            headKeys={[
                                "levelId",
                                "order",
                                "displayname",
                                "userName",
                                "creatorId",
                                "createdAt",
                                "blocked",
                            ]}
                        />
                    </div>
                )}
            </MainCard>
        </>
    );
}
