import { BigCard, CardTitle, MainCard } from "@/components/card";
import ErrorShower from "@/components/common/error";
import AddButton, { GoToButton } from "@/components/common/inputs/addButton";
import Page404 from "@/components/pages/404";
import ExamsInfoGetter from "@/components/pages/exams/info";
import LessonGetDataForm from "@/components/pages/lessons/form";
import { IsOwnerComp } from "@/components/wrappers/wrapper";
import { auth, getDocRef } from "@/firebase";
import { useDocument } from "@/hooks/fireStore";
import { FirestoreError, updateDoc } from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getTeacher } from "../teachers/info";
import { useLoadingPromiseQuery } from "@/hooks";

export interface Props {
    doc: DataBase.WithIdType<DataBase["Lessons"]>;
    course: DataBase.WithIdType<DataBase["Courses"]>;
    assistantTeachers: DataBase.WithIdType<DataBase["Teacher"]>[];
}
function Page({ doc: initData, course, assistantTeachers }: Props) {
    const [lesson, setDoc] = useState(initData);
    const [teacher] = useAuthState(auth);
    return (
        <>
            <Head>
                <title>{lesson.name}</title>
            </Head>
            <BigCard>
                <CardTitle>Update Lesson Data</CardTitle>
                <MainCard>
                    <LessonGetDataForm
                        creatorId={lesson.teacherId}
                        course={course}
                        defaultData={{
                            ...lesson,
                            assistantTeachers,
                        }}
                        onData={async (data) => {
                            await updateDoc(getDocRef("Lessons", lesson.id), {
                                ...data,
                            });
                            setDoc({ ...lesson, ...data });
                            alert("the Document updated successfully");
                        }}
                        isNotCreator={teacher?.uid != lesson.teacherId}
                        buttonName={"Update"}
                    />
                </MainCard>
                <CardTitle>Exams</CardTitle>
                <MainCard>
                    <ExamsInfoGetter lessonId={lesson.id} />
                </MainCard>
            </BigCard>
            <div className="py-3">
                <IsOwnerComp teacherId={lesson.teacherId}>
                    <AddButton
                        label="Add Exams"
                        href={`/exams/add?lessonId=${lesson.id}`}
                    />
                    <AddButton
                        label="Add questions"
                        href={`/questions/add?lessonId=${lesson.id}`}
                    />
                </IsOwnerComp>
                <GoToButton
                    label="Go To questions"
                    href={`/lessons/questions?id=${lesson.id}`}
                />
                <GoToButton
                    label="Go To The Course"
                    href={`/courses?id=${lesson.courseId}`}
                />
            </div>
        </>
    );
}
export function useGetTeachers(ids?: string[]) {
    return useLoadingPromiseQuery<
        DataBase.WithIdType<DataBase["Teacher"]>[],
        FirestoreError
    >(
        async () => {
            const data = await Promise.all(ids!.map((id) => getTeacher(id)));
            return data.filter(
                (val): val is DataBase.WithIdType<DataBase["Teacher"]> =>
                    val != null
            );
        },
        ["Teachers", ids],
        typeof ids != "undefined"
    );
}
export default function SafeArea() {
    const router = useRouter();
    const id = router.query.id;
    const [doc, loading, error] = useDocument("Lessons", id as string);
    const [courseDoc, loading2, error2] = useDocument(
        "Courses",
        doc?.data()?.courseId
    );
    const addersIds = doc?.data()?.adderIds || [];
    const [teachers, loading3, error3] = useGetTeachers(addersIds);
    if (typeof id != "string")
        return <Page404 message="You must provide The page id with url" />;
    if (error || error2 || error3)
        return <ErrorShower error={error || error2 || error3} />;
    if (loading || loading2 || loading3) return <ErrorShower loading />;
    if (doc && !doc.exists())
        return <Page404 message="The Lesson is not exist" />;
    if (courseDoc && !courseDoc.exists())
        return <Page404 message="The Course is not exist" />;

    return (
        <Page
            course={{ id: courseDoc.id, ...courseDoc.data() }}
            doc={{ id, ...doc.data() }}
            assistantTeachers={teachers}
        />
    );
}
