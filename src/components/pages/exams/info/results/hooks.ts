import { auth, createCollection } from "@/firebase";
import { useQuery } from "@tanstack/react-query";
import {
    getCountFromServer,
    getDocs,
    limit,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
const perPage = 30;

export function useGetResultsCount({ examId }: { examId?: string }) {
    const [teacher] = useAuthState(auth);
    return useQuery({
        queryKey: ["Results", "count", "examId", examId],
        queryFn: async () => {
            return (
                await getCountFromServer(
                    query(
                        createCollection("Results"),
                        where("examId", "==", examId),
                        orderBy("startAt", "desc")
                    )
                )
            ).data().count;
        },
    });
}
export function useGetResults({
    examId,
    page,
}: {
    examId: string;
    page: number;
}) {
    const [teacher] = useAuthState(auth);
    return useQuery({
        queryKey: ["Results", "examId", examId],
        queryFn: async () => {
            return (
                await getDocs(
                    query(
                        createCollection("Results"),
                        where("examId", "==", examId),
                        orderBy("startAt", "desc"),
                        limit(perPage * page + perPage)
                    )
                )
            ).docs.slice(perPage * page, perPage * page + perPage);
        },
    });
}
