import { CardTitle, MainCard } from "@/components/card";
import ErrorShower from "@/components/common/error";
import AddButton, { GoToButton } from "@/components/common/inputs/addButton";
import Page404 from "@/components/pages/404";
import CourseInfoForm from "@/components/pages/courses/form";
import LessonsInfoGetter from "@/components/pages/lessons/info";
import { DataBase } from "@/data";
import { getDocRef } from "@/firebase";
import {
    QueryDocumentSnapshot,
    updateDoc,
} from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useDocument } from "react-firebase-hooks/firestore";
interface UpdateForm {
    doc: QueryDocumentSnapshot<DataBase["Courses"]>;
}
function UpdateForm({ doc }: UpdateForm) {
    return (
        <>
            <CardTitle>Update Course Data</CardTitle>
            <MainCard>
                <CourseInfoForm
                    defaultData={doc.data()}
                    onData={async (data) => {
                        await updateDoc(doc.ref, {
                            ...data,
                        });
                        alert("the document updated successfully");
                    }}
                    buttonName="Update"
                />
            </MainCard>
        </>
    );
}
function SafeArea({ id }: { id: string }) {
    const [doc, loading, error] = useDocument(
        getDocRef("Courses", id as string)
    );
    if (doc && !doc.exists())
        return <Page404 message="The Course id is not exist" />;
    return (
        <div className="tw-flex-1 tw-flex tw-flex-col tw-items-stretch">
            <Head>
                <title>{doc?.data().name || "loading ..."}</title>
            </Head>
            <div className="tw-flex-1">
                <ErrorShower
                    loading={loading}
                    error={error}
                />
                <MainCard>
                    {doc && <UpdateForm doc={doc} />}
                    <MainCard>
                        <CardTitle>Lessons</CardTitle>
                        <LessonsInfoGetter courseId={id} />
                    </MainCard>
                </MainCard>
            </div>
            <div className="py-3">
                <AddButton
                    label="Add Lessons"
                    href={`/lessons/add?courseId=${id}`}
                />
                <GoToButton
                    label="Go To Level"
                    href={`/levels/info?id=${doc?.data().levelId}`}
                />
            </div>
        </div>
    );
}
export default function Page() {
    const router = useRouter();
    const id = router.query.id;
    if (typeof id != "string")
        return <Page404 message="You must provide The page id with url" />;
    return <SafeArea id={id} />;
}
