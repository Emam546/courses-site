import { auth, createCollection, getDocRef } from "@/firebase";
import { useAppSelector } from "@/store";
import { useQuery } from "@tanstack/react-query";
import {
    getDoc,
    query,
    where,
    getDocs,
    limit,
    DocumentSnapshot,
    orderBy,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

export function useGetPayment(courseId?: string) {
    const [user] = useAuthState(auth);
    return useQuery({
        queryKey: ["payment", courseId],
        enabled: typeof courseId == "string" && user != undefined,
        queryFn: async () => {
            const res = await getDocs(
                query(
                    createCollection("Payments"),
                    where("userId", "==", user!.uid),
                    where("courseId", "==", courseId),
                    limit(1)
                )
            );
            if (res.empty) return null;
            return res.docs[0];
        },
    });
}
export function useGetLevels() {
    return useQuery({
        queryKey: ["Levels"],
        queryFn: async () => {
            return await getDocs(
                query(createCollection("Levels"), orderBy("order"))
            );
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
