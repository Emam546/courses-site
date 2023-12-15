import { BigCard, CardTitle, MainCard } from "@/components/card";
import ErrorShower from "@/components/common/error";
import CoursesLessonsInfoGetter, {
    Props as CoursesLessonsInfoProps,
} from "@/components/pages/assistant/lessons";
import { auth, createCollection, getDocRef } from "@/firebase";
import { QuerySnapshot } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import {
    FirestoreError,
    getDoc,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionOnce } from "react-firebase-hooks/firestore";
import { useLoadingPromise } from "@/hooks";
import { getTeacher } from "../teachers/info";

export interface Props {
    docs: CoursesLessonsInfoProps["teachers"];
}
function Page({ docs }: Props) {
    return (
        <>
            <Head>
                <title>Assistant Tasks</title>
            </Head>
            <BigCard>
                <CardTitle>Lessons</CardTitle>
                <MainCard>
                    <CoursesLessonsInfoGetter teachers={docs} />
                </MainCard>
            </BigCard>
        </>
    );
}
export function useGetLessonsTeacher(teacherId?: string) {
    return useLoadingPromise<
        QuerySnapshot<DataBase["Lessons"]>,
        FirestoreError
    >(
        () =>
            getDocs(
                query(
                    createCollection("Lessons"),
                    where("adderIds", "array-contains", teacherId)
                )
            ),
        [teacherId],
        typeof teacherId == "string"
    );
}
export default function SafeArea() {
    const router = useRouter();
    const [teacher] = useAuthState(auth);
    const teacherId = (router.query.teacherId as string) || teacher?.uid;
    const [lessons, loading, error] = useGetLessonsTeacher(teacherId);
    const queryData = useQuery<Props["docs"], FirestoreError>({
        enabled: new Boolean(lessons).valueOf(),
        queryKey: ["LessonsAssistant", teacherId],
        queryFn: async () => {
            const acc: Props["docs"] = [];
            for (let i = 0; i < lessons!.docs.length; i++) {
                const lesson = lessons!.docs[i];
                const lessonData = lesson.data();
                const teacherArr = acc.find(
                    (teacher) => teacher.teacher.id == lessonData.teacherId
                );
                if (!teacherArr) {
                    const teacher = await getTeacher(lessonData.teacherId);
                    if (!teacher)
                        throw new Error(
                            `Un existed Teacher id:${lessonData.teacherId}`
                        );
                    const course = await getDoc(
                        getDocRef("Courses", lessonData.courseId)
                    );
                    if (!course.exists())
                        throw new Error(`Un existed Course id:${course.id}`);
                    acc.push({
                        data: [
                            {
                                course: { id: course.id, ...course.data() },
                                lessons: [{ id: lesson.id, ...lesson.data() }],
                            },
                        ],
                        teacher,
                    });
                    continue;
                }
                const courseArr = teacherArr.data.find(
                    (val) => val.course.id == lessonData.courseId
                );
                if (!courseArr) {
                    const course = await getDoc(
                        getDocRef("Courses", lessonData.courseId)
                    );
                    if (!course.exists())
                        throw new Error(`Un existed Course id:${course.id}`);
                    teacherArr.data.push({
                        course: { id: course.id, ...course.data() },
                        lessons: [{ id: lesson.id, ...lesson.data() }],
                    });
                    continue;
                }
                courseArr.lessons.push({ id: lesson.id, ...lesson.data() });
            }
            return acc;
        },
    });
    if (error || queryData.error)
        return (
            <ErrorShower
                loading={false}
                error={error}
            />
        );
    if (loading || queryData.isLoading) return <ErrorShower loading />;

    return <Page docs={queryData.data} />;
}
