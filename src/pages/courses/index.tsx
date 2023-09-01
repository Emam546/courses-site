import { CardTitle, MainCard } from "@/components/card";
import ErrorShower from "@/components/common/error";
import AddButton from "@/components/common/inputs/addButton";
import Page404 from "@/components/pages/404";
import CourseInfoForm from "@/components/pages/courses/form";
import LessonsInfoGetter from "@/components/pages/lessons/info";
import { DataBase } from "@/data";
import { getDocRef } from "@/firebase";
import { DocumentSnapshot, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useDocument } from "react-firebase-hooks/firestore";
interface UpdateForm {
    doc: DocumentSnapshot<DataBase["Courses"]>;
}
function UpdateForm({ doc }: UpdateForm) {
    return (
        <>
            <CardTitle>Update Course Data</CardTitle>
            <CourseInfoForm
                defaultData={
                    {
                        ...doc.data(),
                        publishedAt: (doc.data()?.publishedAt as any).toDate(),
                    } as any
                }
                onData={async (data) => {
                    await updateDoc(doc.ref, {
                        ...data,
                    });
                    alert("the document updated successfully");
                }}
            />
        </>
    );
}
function SafeArea({ id }: { id: string }) {
    const [doc, loading, error] = useDocument(
        getDocRef("Courses", id as string)
    );
    return (
        <div className="tw-flex-1 tw-flex tw-flex-col tw-items-stretch">
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
            </div>
        </div>
    );
}
export default function Page() {
    const router = useRouter();
    const id = router.query.id;
    if (typeof id != "string") return <Page404 />;
    return <SafeArea id={id} />;
}
