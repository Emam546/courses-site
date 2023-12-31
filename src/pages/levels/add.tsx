import { BigCard, CardTitle, MainCard } from "@/components/card";
import { useRouter } from "next/router";
import { addDoc } from "firebase/firestore";
import { auth, createCollection } from "@/firebase";
import LevelInfoForm from "@/components/pages/levels/form";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoToButton } from "@/components/common/inputs/addButton";
import Head from "next/head";

export default function Page() {
    const router = useRouter();
    const colRef = createCollection("Levels");
    const [teacher] = useAuthState(auth);
    return (
        <>
            <Head>
                <title>Add Level</title>
            </Head>
            <BigCard>
                <CardTitle>Add Level</CardTitle>
                <MainCard>
                    <LevelInfoForm
                        onData={async (data) => {
                            await addDoc(colRef, {
                                ...data,
                                teacherId: teacher!.uid,
                                order: Date.now(),
                            });
                            await router.push("/levels");
                        }}
                        creatorId={teacher!.uid}
                        buttonName="Submit"
                    />
                </MainCard>
            </BigCard>
            <div className="tw-mt-3">
                <GoToButton
                    label="Go To Levels"
                    href={"/levels"}
                />
            </div>
        </>
    );
}
