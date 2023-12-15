import { BigCard, CardTitle, MainCard } from "@/components/card";
import ErrorShower from "@/components/common/error";
import AddButton, { GoToButton } from "@/components/common/inputs/addButton";
import Page404 from "@/components/pages/404";
import CourseInfoForm from "@/components/pages/courses/form";
import LessonsInfoGetter from "@/components/pages/lessons/info";
import PrintCourseStudents from "@/components/pages/print/StudentCourse";
import {
    useGetUsersCount,
    useGetUsers,
    perPage,
} from "@/components/pages/users/info/hooks";
import UsersTable from "@/components/pages/users/info/table";
import { IsOwnerComp } from "@/components/wrappers/wrapper";
import { auth, getDocRef } from "@/firebase";
import { useDocument } from "@/hooks/fireStore";
import { updateDoc } from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useGetTeachers } from "../lessons";

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
            <div className="tw-flex tw-items-center tw-justify-between">
                <CardTitle>Students</CardTitle>
                {!state && <PrintCourseStudents courseId={doc.id} />}
            </div>
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
                        headKeys={[
                            "blocked",
                            "createdAt",
                            "creatorId",
                            "userName",
                            "displayname",
                            "order",
                        ]}
                    />
                )}
            </MainCard>
        </>
    );
}
export interface Props {
    course: DataBase.WithIdType<DataBase["Courses"]>;
    assistantTeachers: DataBase.WithIdType<DataBase["Teacher"]>[];
}
function Page({ course: initData, assistantTeachers }: Props) {
    const [course, setCourse] = useState(initData);
    const [teacher] = useAuthState(auth);
    return (
        <>
            <Head>
                <title>{course.name}</title>
            </Head>
            <BigCard>
                <CardTitle>Update Course Data</CardTitle>
                <MainCard>
                    <CourseInfoForm
                        assistants={assistantTeachers}
                        defaultData={course}
                        onData={async (data) => {
                            await updateDoc(getDocRef("Courses", course.id), {
                                ...data,
                            });
                            setCourse({ ...course, ...data });
                            alert("the document updated successfully");
                        }}
                        creatorId={course.teacherId}
                        buttonName="Update"
                        isNotCreator={teacher?.uid != course.teacherId}
                    />
                </MainCard>
                <CardTitle>Lessons</CardTitle>
                <MainCard>
                    <LessonsInfoGetter
                        isNotCreator={teacher?.uid != course.teacherId}
                        courseId={course.id}
                    />
                </MainCard>
                <Students doc={course} />
            </BigCard>
            <div className="py-3">
                <IsOwnerComp teacherId={course.teacherId}>
                    <AddButton
                        label="Add a Lesson"
                        href={`/lessons/add?courseId=${course.id}`}
                    />
                </IsOwnerComp>
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
    const [assistantTeachers, loading2, error2] = useGetTeachers(
        doc?.data()?.paymentAdderIds
    );
    if (typeof id != "string")
        return <Page404 message="You must provide The page id with url" />;
    if (error2 || error) return <ErrorShower error={error} />;
    if (isLoading) return <ErrorShower loading />;
    if (doc && !doc.exists())
        return <Page404 message="The Course id is not exist" />;
    if (loading2) return <ErrorShower loading />;

    return (
        <Page
            assistantTeachers={assistantTeachers}
            course={{ id: doc.id, ...doc.data() }}
        />
    );
}
