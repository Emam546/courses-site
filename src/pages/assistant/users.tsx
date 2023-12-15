import { BigCard, CardTitle, MainCard } from "@/components/card";
import ErrorShower from "@/components/common/error";
import LevelsInfoGetter, {
    Props as LevelInfoProps,
} from "@/components/pages/assistant/levels";
import { auth, createCollection } from "@/firebase";
import { QuerySnapshot } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { FirestoreError, getDocs, query, where } from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useLoadingPromise } from "@/hooks";
import { getTeacher } from "../teachers/info";

export interface Props {
    docs: LevelInfoProps["teachers"];
}
function Page({ docs }: Props) {
    return (
        <>
            <Head>
                <title>Assistant User Levels</title>
            </Head>
            <BigCard>
                <CardTitle>Levels</CardTitle>
                <MainCard>
                    <LevelsInfoGetter teachers={docs} />
                </MainCard>
            </BigCard>
        </>
    );
}
export function useGetLevelsTeacher(teacherId?: string) {
    return useLoadingPromise<QuerySnapshot<DataBase["Levels"]>, FirestoreError>(
        () =>
            getDocs(
                query(
                    createCollection("Levels"),
                    where("usersAdderIds", "array-contains", teacherId)
                )
            ),
        [teacherId],
        typeof teacherId == "string"
    );
}
export default function SafeArea() {
    const router = useRouter();
    const [teacher] = useAuthState(auth);
    const teacherId = (router.query.teacherId as string) || teacher?.uid;
    const [levels, loading, error] = useGetLevelsTeacher(teacherId);
    const queryData = useQuery<Props["docs"], FirestoreError>({
        enabled: new Boolean(levels).valueOf(),
        queryKey: ["LevelsAssistant", teacherId],
        queryFn: async () => {
            const acc: Props["docs"] = [];
            for (let i = 0; i < levels!.docs.length; i++) {
                const level = levels!.docs[i];
                const levelData = level.data();
                const teacherArr = acc.find(
                    (teacher) => teacher.teacher.id == levelData.teacherId
                );
                if (!teacherArr) {
                    const teacher = await getTeacher(levelData.teacherId);
                    if (!teacher)
                        throw new Error(
                            `Un existed Teacher id:${levelData.teacherId}`
                        );
                    acc.push({
                        data: [{ id: level.id, ...level.data() }],
                        teacher,
                    });
                    continue;
                }

                teacherArr.data.push({ id: level.id, ...level.data() });
            }
            return acc;
        },
    });
    if (error || queryData.error)
        return (
            <ErrorShower
                loading={false}
                error={error}
            />
        );
    if (loading || queryData.isLoading) return <ErrorShower loading />;

    return <Page docs={queryData.data} />;
}
