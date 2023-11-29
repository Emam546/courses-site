import { BigCard, CardTitle, MainCard } from "@/components/card";
import ErrorShower from "@/components/common/error";
import AddButton, { GoToButton } from "@/components/common/inputs/addButton";
import Page404 from "@/components/pages/404";
import CourseInfoForm from "@/components/pages/courses/form";
import LessonsInfoGetter from "@/components/pages/lessons/info";
import {
    useGetUsersCount,
    useGetUsers,
    perPage,
} from "@/components/pages/users/info/hooks";
import UsersTable from "@/components/pages/users/info/table";
import { getDocRef } from "@/firebase";
import { useDocument, useGetDoc } from "@/hooks/fireStore";
import { QueryDocumentSnapshot, updateDoc } from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

interface StudentsForm {
    doc: DataBase.WithIdType<DataBase["Courses"]>;
}
function Students({ doc }: StudentsForm) {
    const [page, setPage] = useState(0);
    const queryCount = useGetUsersCount({
        courseId: doc.id,
        levelId: doc.levelId,
    });
    const queryUsers = useGetUsers({
        courseId: doc.id,
        levelId: doc.levelId,
        page: page,
    });
    const state = !queryUsers.data || queryCount.data == null;
    const curCount = perPage * page + 1;
    return (
        <>
            <CardTitle>Students</CardTitle>
            <MainCard>
                {state ? (
                    <ErrorShower
                        loading={queryUsers.isLoading || queryCount.isLoading}
                        error={queryUsers.error || queryCount.error}
                    />
                ) : (
                    <UsersTable
                        page={page}
                        setPage={setPage}
                        totalUsers={queryCount.data}
                        users={queryUsers.data.map((val, i) => ({
                            ...val.data(),
                            id: val.id,
                            order: i + curCount,
                        }))}
                    />
                )}
            </MainCard>
        </>
    );
}
export interface Props {
    course: DataBase.WithIdType<DataBase["Courses"]>;
}
function Page({ course: initData }: Props) {
    const [course, setCourse] = useState(initData);
    return (
        <>
            <Head>
                <title>{course.name}</title>
            </Head>
            <BigCard>
                <CardTitle>Update Course Data</CardTitle>
                <MainCard>
                    <CourseInfoForm
                        defaultData={course}
                        onData={async (data) => {
                            console.log(course,data);
                            await updateDoc(getDocRef("Courses", course.id), {
                                ...data,
                            });
                            setCourse({ ...course, ...data });
                            alert("the document updated successfully");
                        }}
                        buttonName="Update"
                    />
                </MainCard>
                <CardTitle>Lessons</CardTitle>
                <MainCard>
                    <LessonsInfoGetter courseId={course.id} />
                </MainCard>
                <Students doc={course} />
            </BigCard>
            <div className="py-3">
                <AddButton
                    label="Add Lessons"
                    href={`/lessons/add?courseId=${course.id}`}
                />
                <GoToButton
                    label="Go To Level"
                    href={`/levels/info?id=${course.levelId}`}
                />
            </div>
        </>
    );
}
export default function SafeArea() {
    const router = useRouter();
    const id = router.query.id;
    const [doc, isLoading, error] = useDocument("Courses", id as string);

    if (typeof id != "string")
        return <Page404 message="You must provide The page id with url" />;
    if (isLoading || error)
        return (
            <ErrorShower
                loading={isLoading}
                error={error}
            />
        );
    if (doc && !doc.exists())
        return <Page404 message="The Course id is not exist" />;
    return <Page course={{ id: doc.id, ...doc.data() }} />;
}
