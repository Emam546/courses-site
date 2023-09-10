import { CardTitle, MainCard } from "@/components/card";
import ErrorShower from "@/components/common/error";
import AddButton, { GoToButton } from "@/components/common/inputs/addButton";
import Page404 from "@/components/pages/404";
import LevelInfoFormGetter from "@/components/pages/courses/info";
import LevelInfoForm from "@/components/pages/levels/form";
import { DataBase } from "@/data";
import { getDocRef } from "@/firebase";
import {
    DocumentSnapshot,
    QueryDocumentSnapshot,
    updateDoc,
} from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useDocument } from "react-firebase-hooks/firestore";
interface UpdateForm {
    doc: QueryDocumentSnapshot<DataBase["Levels"]>;
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
                buttonName="Update"
            />
        </>
    );
}
function SafeArea({ id }: { id: string }) {
    const [doc, loading, error] = useDocument(getDocRef("Levels", id));
    if (doc && !doc.exists())
        return <Page404 message="The Level id is not exist" />;
    if (!doc)
        return (
            <ErrorShower
                loading={loading}
                error={error}
            />
        );
    return (
        <div className="tw-flex-1 tw-flex tw-flex-col tw-items-stretch">
            <Head>
                <title>{doc.data().name}</title>
            </Head>
            <div className="tw-flex-1">
                <MainCard>
                    <UpdateForm doc={doc} />
                    <>
                        <CardTitle>Courses</CardTitle>
                        <MainCard>
                            <LevelInfoFormGetter levelId={id} />
                        </MainCard>
                    </>
                </MainCard>
            </div>
            <div className="py-3">
                <AddButton
                    label="Add Course"
                    href={`/courses/add?levelId=${id}`}
                />
                <GoToButton
                    label="Go To Levels"
                    href="/levels"
                />
            </div>
        </div>
    );
}
export default function Page() {
    const id = useRouter().query.id;
    if (typeof id != "string")
        return <Page404 message="You must provide the page id" />;

    return <SafeArea id={id} />;
}
