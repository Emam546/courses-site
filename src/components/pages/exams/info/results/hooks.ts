import { createCollection } from "@/firebase";
import { useQuery } from "@tanstack/react-query";
import {
    getCountFromServer,
    getDocs,
    limit,
    orderBy,
    query,
    where,
} from "firebase/firestore";
const perPage = 30;

export function useGetResultsCount({ examId }: { examId?: string }) {
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
