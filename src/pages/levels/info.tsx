import { BigCard, CardTitle, MainCard } from "@/components/card";
import ErrorShower from "@/components/common/error";
import AddButton, { GoToButton } from "@/components/common/inputs/addButton";
import Page404 from "@/components/pages/404";
import CourseInfoFormGetter from "@/components/pages/courses/info";
import LevelInfoForm from "@/components/pages/levels/form";
import { auth, createCollection, getDocRef } from "@/firebase";
import { useDocument } from "@/hooks/fireStore";
import {
    FirestoreError,
    getDocs,
    orderBy,
    query,
    updateDoc,
    where,
    QuerySnapshot,
} from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useGetTeachers } from "../lessons";
import { IsOwnerComp } from "@/components/wrappers/wrapper";
import { useLoadingPromise } from "@/hooks";
import { useAppSelector } from "@/store";

interface Props {
    doc: DataBase.WithIdType<DataBase["Levels"]>;
    courses?: DataBase.WithIdType<DataBase["Courses"]>[];
    assistantTeachers: DataBase.WithIdType<DataBase["Teacher"]>[];
}
function Page({ doc: initData, courses, assistantTeachers }: Props) {
    const [doc, setDoc] = useState(initData);
    const [teacher] = useAuthState(auth);
    return (
        <div className="tw-flex-1 tw-flex tw-flex-col tw-items-stretch">
            <Head>
                <title>{doc.name}</title>
            </Head>
            <BigCard>
                <CardTitle>Update Level Data</CardTitle>
                <MainCard>
                    <LevelInfoForm
                        defaultData={{
                            ...doc,
                            assistantTeachers: assistantTeachers,
                        }}
                        onData={async (data) => {
                            await updateDoc(getDocRef("Levels", doc.id), {
                                ...data,
                            });
                            setDoc({ ...doc, ...data });
                            alert("the document updated successfully");
                        }}
                        creatorId={doc.teacherId}
                        isNotCreator={teacher?.uid != doc.teacherId}
                        buttonName="Update"
                    />
                </MainCard>
                <IsOwnerComp teacherId={doc.teacherId}>
                    <CardTitle>Courses</CardTitle>
                    <MainCard>
                        <CourseInfoFormGetter
                            isNotCreator={teacher?.uid != doc.teacherId}
                            levelId={doc.id}
                        />
                    </MainCard>
                </IsOwnerComp>
            </BigCard>
            <div className="py-3">
                {(teacher?.uid == doc.teacherId ||
                    doc.usersAdderIds.includes(teacher!.uid)) && (
                    <AddButton
                        label="Add a Student"
                        href={`/users/add?levelId=${doc.id}`}
                    />
                )}

                <IsOwnerComp teacherId={doc.teacherId}>
                    <AddButton
                        label="Add a Course"
                        href={`/courses/add?levelId=${doc.id}`}
                    />
                </IsOwnerComp>
                <GoToButton
                    label="Manage Users"
                    href={`/levels/users?levelId=${doc.id}`}
                />
                <IsOwnerComp teacherId={doc.teacherId}>
                    <GoToButton
                        label="Go To Levels"
                        href="/levels"
                    />
                </IsOwnerComp>
            </div>
        </div>
    );
}
export function useGetCourses(levelId: string, state: boolean = true) {
    return useLoadingPromise<
        QuerySnapshot<DataBase["Courses"]>,
        FirestoreError
    >(
        () =>
            getDocs(
                query(
                    createCollection("Courses"),
                    where("levelId", "==", levelId),
                    orderBy("order")
                )
            ),
        [levelId],
        typeof levelId == "string" && state
    );
}
export default function SafeArea() {
    const teacher = useAppSelector((state) => state.auth.user!);
    const id = useRouter().query.id;
    const [doc, loading, error] = useDocument("Levels", id as string);
    const loadingCourseState =
        teacher.type == "admin" || teacher.id == doc?.data()?.teacherId;
    const [courses, loading2, error2] = useGetCourses(
        id as string,
        loadingCourseState
    );
    const [assistantTeachers, loading3, error3] = useGetTeachers(
        doc?.data()?.usersAdderIds
    );
    if (typeof id != "string")
        return <Page404 message="You must provide the page id" />;

    if (error || error2 || error3)
        return <ErrorShower error={error || error2 || error3} />;
    if (loading) return <ErrorShower loading />;
    if (!doc.exists()) return <Page404 message="The Level id is not exist" />;
    if (loading2 && loadingCourseState) return <ErrorShower loading />;
    if (loading3) return <ErrorShower loading />;

    return (
        <Page
            courses={courses?.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))}
            doc={{ id, ...doc.data() }}
            assistantTeachers={assistantTeachers}
        />
    );
}
