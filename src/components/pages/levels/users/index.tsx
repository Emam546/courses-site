import { useState } from "react";

import ErrorShower from "../../../common/error";
import { SelectCourse } from "./selectLevel";
import {
    perPage,
    useGetUsers,
    useGetUsersCount,
} from "@/components/pages/users/info/hooks";

import { MainCard } from "@/components/card";
import UsersTable from "@/components/pages/users/info/table";
export interface Props {
    level: DataBase.WithIdType<DataBase["Levels"]>;
    courses: DataBase.WithIdType<DataBase["Courses"]>[];
}
export default function UserLevelInfoGenerator({ courses, level }: Props) {
    const [page, setPage] = useState(0);
    const [course, setCourseId] =
        useState<DataBase.WithIdType<DataBase["Courses"]>>();
    const queryCount = useGetUsersCount({
        courseId: course?.id,
        levelId: level.id,
    });
    const queryUsers = useGetUsers({
        courseId: course?.id,
        levelId: level.id,
        page: page,
    });
    const users = queryUsers.data;
    const count = queryCount.data;
    const curCount = page * perPage + 1;
    return (
        <>
            <SelectCourse
                onCourse={(course) => {
                    if (course == "All") setCourseId(undefined);
                    else setCourseId(course);
                }}
                courseId={course?.id}
                courses={courses}
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
