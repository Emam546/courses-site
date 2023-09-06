import { DataBase } from "@/data";
import { createCollection, getDocRef } from "@/firebase";
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
    return useQuery({
        queryKey: ["level"],
        queryFn: async () =>
            await getDocs(query(createCollection("Levels"), orderBy("order"))),
    });
}
export function useGetCourses(levelId?: string) {
    return useQuery({
        queryKey: ["courses", levelId],
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
