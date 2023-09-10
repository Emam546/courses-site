import { CardTitle, MainCard } from "@/components/card";
import { useRouter } from "next/router";
import { addDoc } from "firebase/firestore";
import { createCollection } from "@/firebase";
import LevelInfoForm from "@/components/pages/levels/form";

export default function Page() {
    const router = useRouter();
    const colRef = createCollection("Levels");

    return (
        <MainCard>
            <CardTitle>ADD Level</CardTitle>
            <MainCard>
                <LevelInfoForm
                    onData={async (data) => {
                        await addDoc(colRef, {
                            ...data,
                            order: Date.now(),
                        });
                        await router.push("/levels");
                    }}
                    buttonName="Submit"
                />
            </MainCard>
        </MainCard>
    );
}
