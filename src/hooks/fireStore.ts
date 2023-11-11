import { auth, createCollection, getDocRef } from "@/firebase";
import queryClient from "@/queryClient";
import { useQuery } from "@tanstack/react-query";
import {
    DocumentSnapshot,
    Query,
    getCountFromServer,
    getDoc,
    getDocs,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export function useCountDocs<T>(
    query?: Query<T>
): [number | undefined, boolean, any] {
    const [count, setCount] = useState<number>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>();
    useEffect(() => {
        setLoading(true);
        if (!query) return setCount(undefined);
        getCountFromServer(query)
            .then((val) => {
                setCount(val.data().count);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
            });
    }, [query]);
    return [count, loading, error];
}
export function useGetLevels() {
    const [teacher] = useAuthState(auth);

    return useQuery({
        queryKey: ["Levels"],
        queryFn: async () =>
            await getDocs(
                query(
                    createCollection("Levels"),
                    where("teacherId", "==", teacher!.uid),
                    orderBy("order")
                )
            ),
    });
}
export function useGetCourses(levelId?: string) {
    const [teacher] = useAuthState(auth);
    return useQuery({
        queryKey: ["Courses", "levelId", levelId],
        enabled: typeof levelId == "string",
        queryFn: async () =>
            await getDocs(
                query(
                    createCollection("Courses"),
                    where("levelId", "==", levelId),
                    orderBy("order")
                )
            ),
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
export function updateDocCache<T extends keyof DataBase>(
    path: T,
    val: DocumentSnapshot<DataBase[T]>,
    id: string
) {
    queryClient.setQueryData([path, id], val);
}
