import { BigCard, CardTitle, MainCard } from "@/components/card";
import { useRouter } from "next/router";
import { addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { auth, createCollection, getDocRef } from "@/firebase";
import UserInfoForm from "@/components/pages/users/form";
import Page404 from "@/components/pages/404";
import ErrorShower from "@/components/common/error";
import PaymentForm from "@/components/pages/users/payment/form";
import PaymentInfoGenerator from "@/components/pages/users/payment/info";
import UserResultGenerator from "@/components/pages/users/results";
import Head from "next/head";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocument } from "@/hooks/fireStore";
import { useState } from "react";
export interface Props {
    doc: DataBase.WithIdType<DataBase["Students"]>;
}
function Page({ doc: initData }: Props) {
    const [teacher] = useAuthState(auth);
    const [doc, setDoc] = useState(initData);
    return (
        <>
            <Head>
                <title>User:{doc.displayname}</title>
            </Head>
            <BigCard>
                <>
                    <CardTitle>Update User</CardTitle>
                    <MainCard>
                        <UserInfoForm
                            onData={async (data) => {
                                await updateDoc(getDocRef("Students", doc.id), {
                                    ...data,
                                });
                                setDoc({ ...doc, ...data });
                                alert("Document updated successfully");
                            }}
                            defaultData={doc}
                        />
                    </MainCard>
                </>
                <>
                    <CardTitle>Activate Course</CardTitle>
                    <MainCard>
                        <PaymentForm
                            onData={async ({ id, price }) => {
                                await addDoc(createCollection("Payments"), {
                                    activatedAt: serverTimestamp(),
                                    type: "admin",
                                    courseId: id,
                                    userId: doc.id,
                                    teacherId: teacher!.uid,
                                    price,
                                });
                            }}
                            userId={doc.id}
                            levelId={doc.levelId}
                        />
                    </MainCard>
                </>
                <>
                    <CardTitle>Payments</CardTitle>
                    <MainCard>
                        <PaymentInfoGenerator userId={doc.id} />
                    </MainCard>
                </>
                <>
                    <CardTitle>Results</CardTitle>
                    <MainCard>
                        <UserResultGenerator userId={doc.id} />
                    </MainCard>
                </>
            </BigCard>
        </>
    );
}
export default function SafeArea() {
    const id = useRouter().query.id;
    const [doc, loading, error] = useDocument("Students", id as string);

    if (typeof id != "string")
        return <Page404 message="You must provide the page id" />;
    if (error || loading)
        return (
            <ErrorShower
                loading={loading}
                error={error}
            />
        );
    if (!doc.exists()) return <Page404 message="The Level id is not exist" />;

    return <Page doc={{ ...doc.data(), id: doc.id }} />;
}
