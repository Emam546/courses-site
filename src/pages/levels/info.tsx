import { CardTitle, MainCard } from "@/components/card";
import ErrorShower from "@/components/common/error";
import AddButton from "@/components/common/inputs/addButton";
import Page404 from "@/components/pages/404";
import CourseInfoGetter from "@/components/pages/courses/info";
import LevelInfoForm from "@/components/pages/levels/form";
import { DataBase } from "@/data";
import { getDocRef } from "@/firebase";
import { DocumentSnapshot, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useDocument } from "react-firebase-hooks/firestore";
interface UpdateForm {
    doc: DocumentSnapshot<DataBase["Levels"]>;
}
function UpdateForm({ doc }: UpdateForm) {
    return (
        <>
            <CardTitle>Update Level Data</CardTitle>
            <LevelInfoForm
                defaultData={doc.data()}
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
        getDocRef("Levels", id as string)
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
                    <>
                        <CardTitle>Courses</CardTitle>
                        <MainCard>
                            <CourseInfoGetter levelId={id} />
                        </MainCard>
                    </>
                </MainCard>
            </div>
            <div className="py-3">
                <AddButton
                    label="Add Course"
                    href={`/courses/add?levelId=${id}`}
                />
            </div>
        </div>
    );
}
export default function LevelInfo() {
    const id = useRouter().query.id;
    if (typeof id != "string") return <Page404 />;

    return <SafeArea id={id} />;
}
