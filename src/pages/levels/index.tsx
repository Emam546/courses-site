import { BigCard, CardTitle, MainCard } from "@/components/card";
import ErrorShower from "@/components/common/error";
import AddButton from "@/components/common/inputs/addButton";
import LevelsInfoGetter from "@/components/pages/levels/info";
import { IsOwnerComp } from "@/components/wrappers/wrapper";
import { auth, createCollection } from "@/firebase";
import { orderBy, query, where } from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionOnce } from "react-firebase-hooks/firestore";
export interface Props {
    levels: DataBase.WithIdType<DataBase["Levels"]>[];
    creatorId: string;
}
export function Page({ levels, creatorId }: Props) {
    const [teacher] = useAuthState(auth);
    return (
        <div className="tw-flex-1 tw-flex tw-flex-col tw-items-stretch">
            <Head>
                <title>Levels</title>
            </Head>
            <BigCard>
                <CardTitle>Levels</CardTitle>
                <MainCard>
                    <LevelsInfoGetter
                        levels={levels}
                        isNotCreator={creatorId != teacher?.uid}
                    />
                </MainCard>
            </BigCard>
            <div className="tw-py-3">
                <IsOwnerComp teacherId={creatorId}>
                    <AddButton
                        label="Add Level"
                        href="/levels/add"
                    />
                </IsOwnerComp>
            </div>
        </div>
    );
}
export default function SafeArea() {
    const router = useRouter();
    const [teacher] = useAuthState(auth);
    const teacherId = (router.query.teacherId || teacher!.uid) as string;
    const [data, loading, error] = useCollectionOnce(
        query(
            createCollection("Levels"),
            where("teacherId", "==", teacherId),
            orderBy("order")
        )
    );
    if (loading || error)
        return (
            <ErrorShower
                loading={loading}
                error={error}
            />
        );
    if (!data) return <ErrorShower loading={loading} />;
    return (
        <Page
            levels={data.docs.map((val) => {
                return { id: val.id, ...val.data() };
            })}
            creatorId={teacherId}
        />
    );
}
