import { BigCard, CardTitle, MainCard } from "@/components/card";
import { useRouter } from "next/router";
import {
    Timestamp,
    addDoc,
    getDocsFromServer,
    limit,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from "firebase/firestore";
import { auth, createCollection, fireStore, getDocRef } from "@/firebase";
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
import PrintUserResults from "@/components/pages/print/UserResults";
import { IsOwnerComp, IsOwnerOrAdminComp } from "@/components/wrappers/wrapper";
import PrintUserPayments from "@/components/pages/print/UserPayments";
export interface Props {
    doc: DataBase.WithIdType<DataBase["Students"]>;
    level: DataBase.WithIdType<DataBase["Levels"]> | null;
}

function Page({ doc: initData, level }: Props) {
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
                                    blocked: data.blocked
                                        ? {
                                              at: serverTimestamp(),
                                              teacherId: teacher!.uid,
                                          }
                                        : null,
                                });
                                setDoc({
                                    ...doc,
                                    levelId: data.levelId,
                                    blocked: data.blocked
                                        ? {
                                              at: Timestamp.fromDate(
                                                  new Date()
                                              ),
                                              teacherId: teacher!.uid,
                                          }
                                        : null,
                                });
                                alert("Document updated successfully");
                            }}
                            user={doc}
                        />
                    </MainCard>
                </>
                <IsOwnerComp teacherId={doc.teacherId}>
                    <CardTitle>Activate Course</CardTitle>
                    <MainCard>
                        <PaymentForm
                            onData={async ({ id, price }) => {
                                const pay = await getDocsFromServer(
                                    query(
                                        createCollection("Teacher"),
                                        where("courseId", "==", id),
                                        where("userId", "==", doc.id),
                                        limit(1)
                                    )
                                );
                                if (!pay.empty)
                                    return alert(
                                        "The payment action was added before"
                                    );

                                await addDoc(createCollection("Payments"), {
                                    activatedAt: serverTimestamp(),
                                    type: "admin",
                                    courseId: id,
                                    userId: doc.id,
                                    teacherId: doc.teacherId,
                                    price,
                                    creatorId: teacher?.uid,
                                });
                            }}
                            userId={doc.id}
                            levelId={doc.levelId}
                        />
                    </MainCard>
                </IsOwnerComp>

                <IsOwnerOrAdminComp teacherId={doc.teacherId}>
                    <div className="tw-flex tw-items-center tw-justify-between">
                        <CardTitle>Payments</CardTitle>
                        <PrintUserPayments userId={doc.id} />
                    </div>
                    <MainCard>
                        <PaymentInfoGenerator userId={doc.id} />
                    </MainCard>
                </IsOwnerOrAdminComp>
                <>
                    <div className="tw-flex tw-items-center tw-justify-between">
                        <CardTitle>Results</CardTitle>
                        <PrintUserResults userId={doc.id} />
                    </div>
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
    const [level, loading2, error2] = useDocument(
        "Levels",
        doc?.data()?.levelId as string
    );

    if (typeof id != "string")
        return <Page404 message="You must provide the page id" />;
    if (error || error2) return <ErrorShower error={error || error2} />;
    if (loading) return <ErrorShower loading={true} />;
    if (!doc.exists()) return <Page404 message="The User is not exist" />;
    if (loading2) return <ErrorShower loading />;

    return (
        <Page
            doc={{ ...doc.data(), id: doc.id }}
            level={level.exists() ? { ...level.data(), id: level.id } : null}
        />
    );
}
