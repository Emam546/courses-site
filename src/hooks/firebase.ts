import { DataBase } from "@/data";
import { createCollection, getDocRef } from "@/firebase";
import { useAppSelector } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { getDoc, query, where, getDocs, limit, DocumentSnapshot } from "firebase/firestore";

export function useGetPayment(courseId?: string) {
    const user = useAppSelector((state) => state.auth.user);
    return useQuery({
        queryKey: ["payment", courseId],
        enabled: typeof courseId == "string" && user != undefined,
        queryFn: async () => {
            const res = await getDocs(
                query(
                    createCollection("Payment"),
                    where("userId", "==", user!.id),
                    where("courseId", "==", courseId),
                    limit(1)
                )
            );
            if (res.empty) return null;
            return res.docs[0];
        },
    });
}
export function useGetDoc<T extends keyof DataBase>(path: T, id?: string) {
    return useQuery<DocumentSnapshot<DataBase[T]>>({
        queryKey: [path, id],
        enabled: typeof id == "string",
        queryFn: async () => {
            return await getDoc(getDocRef<T>(path, id as string));
        },
    });
}
