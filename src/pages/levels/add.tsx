import { CardTitle, MainCard } from "@/components/card";
import { useRouter } from "next/router";
import { addDoc } from "firebase/firestore";
import { auth, createCollection } from "@/firebase";
import LevelInfoForm from "@/components/pages/levels/form";
import { useAuthState } from "react-firebase-hooks/auth";
import AddButton, { GoToButton } from "@/components/common/inputs/addButton";

export default function Page() {
    const router = useRouter();
    const colRef = createCollection("Levels");
    const [teacher] = useAuthState(auth);
    return (
        <>
            <MainCard>
                <CardTitle>Add Level</CardTitle>
                <MainCard>
                    <LevelInfoForm
                        onData={async (data) => {
                            await addDoc(colRef, {
                                ...data,
                                teacherId: teacher?.uid,
                                order: Date.now(),
                            });
                            await router.push("/levels");
                        }}
                        buttonName="Submit"
                    />
                </MainCard>
            </MainCard>
            <div className="tw-mt-3">
                <GoToButton
                    label="Go To Levels"
                    href={"/levels"}
                />
            </div>
        </>
    );
}
