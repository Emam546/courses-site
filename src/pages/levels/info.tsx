import { BigCard, CardTitle, MainCard } from "@/components/card";
import ErrorShower from "@/components/common/error";
import AddButton, { GoToButton } from "@/components/common/inputs/addButton";
import Page404 from "@/components/pages/404";
import CourseInfoFormGetter, { T } from "@/components/pages/courses/info";
import LevelInfoForm from "@/components/pages/levels/form";
import { createCollection, getDocRef } from "@/firebase";
import { useDocument } from "@/hooks/fireStore";
import {
    DocumentSnapshot,
    FirestoreError,
    getDoc,
    getDocs,
    orderBy,
    query,
    updateDoc,
    where,
    QuerySnapshot,
} from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import path from "path";
import { useState, useEffect } from "react";

interface Props {
    doc: DataBase.WithIdType<DataBase["Levels"]>;
    courses: DataBase.WithIdType<DataBase["Courses"]>[];
}
function Page({ doc: initData, courses }: Props) {
    const [doc, setDoc] = useState(initData);
    return (
        <div className="tw-flex-1 tw-flex tw-flex-col tw-items-stretch">
            <Head>
                <title>{doc.name}</title>
            </Head>
            <BigCard>
                <CardTitle>Update Level Data</CardTitle>
                <MainCard>
                    <LevelInfoForm
                        defaultData={doc}
                        onData={async (data) => {
                            console.log(doc, data);
                            await updateDoc(getDocRef("Levels", doc.id), {
                                ...data,
                            });
                            setDoc({ ...doc, ...data });
                            alert("the document updated successfully");
                        }}
                        buttonName="Update"
                    />
                </MainCard>

                <CardTitle>Courses</CardTitle>
                <MainCard>
                    <CourseInfoFormGetter levelId={doc.id} />
                </MainCard>
            </BigCard>
            <div className="py-3">
                <AddButton
                    label="Add Course"
                    href={`/courses/add?levelId=${doc.id}`}
                />
                <GoToButton
                    label="Go To Levels"
                    href="/levels"
                />
            </div>
        </div>
    );
}
export function useGetCourses(
    levelId: string
):
    | [QuerySnapshot<DataBase["Courses"]>, false, null]
    | [null, false, FirestoreError]
    | [null, true, null] {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<QuerySnapshot<DataBase["Courses"]> | null>(
        null
    );
    const [error, setError] = useState<FirestoreError | null>(null);
    useEffect(() => {
        if (!levelId) return;
        setLoading(true);
        getDocs(
            query(
                createCollection("Courses"),
                where("levelId", "==", levelId),
                orderBy("order")
            )
        )
            .then((data) => {
                setData(data);
            })
            .catch((err) => setError(err))
            .finally(() => {
                setLoading(false);
            });
    }, [path, levelId]);
    return [data, loading, error] as any;
}
export default function SafeArea() {
    const id = useRouter().query.id;
    const [doc, loading, error] = useDocument("Levels", id as string);
    const [courses, loading2, error2] = useGetCourses(id as string);
    if (typeof id != "string")
        return <Page404 message="You must provide the page id" />;
    if (error2 || error)
        return (
            <ErrorShower
                loading={false}
                error={error || error2}
            />
        );
    if (loading || loading2) return <ErrorShower loading={loading} />;
    if (!doc.exists()) return <Page404 message="The Level id is not exist" />;

    return (
        <Page
            courses={courses.docs.map((doc) => ({ id: doc.id, ...doc.data() }))}
            doc={{ id, ...doc.data() }}
        />
    );
}
