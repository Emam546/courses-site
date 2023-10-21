import { CardTitle, MainCard } from "@/components/card";
import { useRouter } from "next/router";
import { addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { auth, createCollection, getDocRef } from "@/firebase";
import UserInfoForm from "@/components/pages/users/form";
import { useDocument } from "react-firebase-hooks/firestore";
import Page404 from "@/components/pages/404";
import ErrorShower from "@/components/common/error";
import PaymentForm from "@/components/pages/users/payment/form";
import PaymentInfoGenerator from "@/components/pages/users/payment/info";
import UserResultGenerator from "@/components/pages/users/results";
import Head from "next/head";
import { useAuthState } from "react-firebase-hooks/auth";

function SafeArea({ id }: { id: string }) {
    const [doc, loading, error] = useDocument(getDocRef("UsersTeachers", id));
    const [teacher] = useAuthState(auth);
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
        <>
            <Head>
                <title>User:{doc.data().displayname}</title>
            </Head>
            <MainCard>
                <>
                    <CardTitle>Update User</CardTitle>
                    <MainCard>
                        <UserInfoForm
                            onData={async (data) => {
                                await updateDoc(doc.ref, {
                                    ...data,
                                });
                                alert("Document updated successfully");
                            }}
                            defaultData={doc.data()}
                        />
                    </MainCard>
                </>
                <>
                    <CardTitle>Activate Course</CardTitle>
                    <MainCard>
                        <PaymentForm
                            onData={async (id) => {
                                await addDoc(createCollection("Payments"), {
                                    activatedAt: serverTimestamp(),
                                    type: "admin",
                                    courseId: id,
                                    userId: doc.id,
                                    teacherId: teacher!.uid,
                                });
                            }}
                            userId={doc.id}
                            levelId={doc.data().levelId}
                        />
                    </MainCard>
                </>
                <>
                    <CardTitle>Payments</CardTitle>
                    <MainCard>
                        <PaymentInfoGenerator userId={doc.data().userId} />
                    </MainCard>
                </>
                <>
                    <CardTitle>Results</CardTitle>
                    <MainCard>
                        <UserResultGenerator userId={doc.data().userId} />
                    </MainCard>
                </>
            </MainCard>
        </>
    );
}
export default function Page() {
    const id = useRouter().query.id;
    if (typeof id != "string")
        return <Page404 message="You must provide the page id" />;

    return <SafeArea id={id} />;
}
