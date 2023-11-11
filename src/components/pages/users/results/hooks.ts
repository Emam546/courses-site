import { auth, createCollection } from "@/firebase";
import queryClient from "@/queryClient";
import { QuerySnapshot } from "@google-cloud/firestore";
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
export const perPage = 30;

export function useGetResultsCount({ userId }: { userId?: string }) {
    const [teacher] = useAuthState(auth);
    return useQuery({
        queryKey: ["Results", "count", "userId", userId],
        queryFn: async () => {
            return (
                await getCountFromServer(
                    query(
                        createCollection("Results"),
                        where("userId", "==", userId),
                        orderBy("startAt", "desc")
                    )
                )
            ).data().count;
        },
    });
}
export function clearResults(userId: string) {
    queryClient.refetchQueries({
        queryKey: ["Results", "userId", userId],
    });
    queryClient.refetchQueries({
        queryKey: ["Results", "count", "userId", userId],
    });
}
export function useGetResults({
    userId,
    page,
}: {
    userId: string;
    page: number;
}) {
    const [teacher] = useAuthState(auth);
    return useQuery({
        queryKey: ["Results", "userId", userId, "page", page],
        queryFn: async () => {
            return (
                await getDocs(
                    query(
                        createCollection("Results"),
                        where("userId", "==", userId),
                        orderBy("startAt", "desc"),
                        limit(perPage * page + perPage)
                    )
                )
            ).docs.slice(page * perPage, perPage * page + perPage);
        },
    });
}
