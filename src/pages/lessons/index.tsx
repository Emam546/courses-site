import { CardTitle, MainCard } from "@/components/card";
import ErrorShower from "@/components/common/error";
import AddButton, { GoToButton } from "@/components/common/inputs/addButton";
import Page404 from "@/components/pages/404";
import ExamsInfoGetter from "@/components/pages/exams/info";
import LessonGetDataForm from "@/components/pages/lessons/form";
import { DataBase } from "@/data";
import { getDocRef } from "@/firebase";
import { DocumentSnapshot, QueryDocumentSnapshot, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useDocument } from "react-firebase-hooks/firestore";
interface UpdateForm {
    doc: QueryDocumentSnapshot<DataBase["Lessons"]>;
}
function UpdateForm({ doc }: UpdateForm) {
    return (
        <>
            <CardTitle>Update Lesson Data</CardTitle>
            <LessonGetDataForm
                courseId={doc.data()!.courseId}
                defaultData={
                    {
                        ...doc.data(),
                        publishedAt: (doc.data().publishedAt as any).toDate(),
                    } as any
                }
                onData={async (data) => {
                    await updateDoc(doc.ref, {
                        ...data,
                    });
                    alert("the document updated successfully");
                }}
                buttonName={"Update"}
            />
        </>
    );
}
function SafeArea({ id }: { id: string }) {
    const [doc, loading, error] = useDocument(
        getDocRef("Lessons", id as string)
    );
    if (doc && !doc.exists())
        return <Page404 message="The Course id is not exist" />;
    return (
        <div className="tw-flex-1 tw-flex tw-flex-col tw-items-stretch">
            <div className="tw-flex-1">
                <ErrorShower
                    loading={loading}
                    error={error}
                />
                <MainCard>
                    {doc && <UpdateForm doc={doc} />}
                    <>
                        <CardTitle>Exams</CardTitle>
                        <MainCard>
                            <ExamsInfoGetter lessonId={id} />
                        </MainCard>
                    </>
                </MainCard>
            </div>
            <div className="py-3">
                <AddButton
                    label="Add Exams"
                    href={`/exams/add?lessonId=${id}`}
                />
                <AddButton
                    label="Add questions"
                    href={`/questions/add?lessonId=${id}`}
                />
                <GoToButton
                    label="Go To questions"
                    href={`/lessons/questions?id=${id}`}
                />
            </div>
        </div>
    );
}
export default function Page() {
    const router = useRouter();
    const id = router.query.id;
    if (typeof id != "string") return <Page404 message="You must provide The page id with url" />;
    return <SafeArea id={id} />;
}
