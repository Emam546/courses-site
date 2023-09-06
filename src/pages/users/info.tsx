import { CardTitle, MainCard } from "@/components/card";
import { useRouter } from "next/router";
import { addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { createCollection, getDocRef } from "@/firebase";
import UserInfoForm from "@/components/pages/users/form";
import { useDocument } from "react-firebase-hooks/firestore";
import Page404 from "@/components/pages/404";
import ErrorShower from "@/components/common/error";
import PaymentForm from "@/components/pages/users/payment/form";
import PaymentInfoGenerator from "@/components/pages/users/payment/info";

function SafeArea({ id }: { id: string }) {
    const [doc, loading, error] = useDocument(getDocRef("Users", id));
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
            <MainCard>
                <div>
                    <CardTitle>Update User</CardTitle>
                    <UserInfoForm
                        onData={async (data) => {
                            await updateDoc(doc.ref, {
                                ...data,
                            });
                            alert("Document updated successfully");
                        }}
                        defaultData={{
                            ...doc.data(),
                            createdAt: (doc.data().createdAt as any).toDate(),
                        }}
                    />
                </div>
                <div>
                    <CardTitle>Activate Course</CardTitle>
                    <PaymentForm
                        onData={async (id) => {
                            await addDoc(createCollection("Payment"), {
                                activatedAt: serverTimestamp(),
                                type: "admin",
                                courseId: id,
                                userId: doc.id,
                            });
                        }}
                        userId={doc.id}
                        levelId={doc.data().levelId}
                    />
                </div>
                <div>
                    <CardTitle>Payments</CardTitle>
                    <PaymentInfoGenerator userId={doc.id} />
                </div>
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
