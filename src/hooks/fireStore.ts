import { auth, createCollection, getDocRef } from "@/firebase";
import queryClient from "@/queryClient";
import { useQuery } from "@tanstack/react-query";
import {
    DocumentSnapshot,
    FirestoreError,
    getDoc,
    getDocs,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useLoadingPromise, useLoadingPromiseQuery } from ".";

export function useGetLevels(teacherId?: string) {
    const [teacher] = useAuthState(auth);
    const id = teacherId || teacher!.uid;
    return useQuery({
        queryKey: ["Levels", id],
        queryFn: async () =>
            await getDocs(
                query(
                    createCollection("Levels"),
                    where("teacherId", "==", id),
                    orderBy("order")
                )
            ),
    });
}
export function useGetCourses(levelId?: string) {
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
    return useQuery<DocumentSnapshot<DataBase[T]>, FirestoreError>({
        queryKey: [path, id],
        enabled: typeof id == "string",
        queryFn: async () => {
            return await getDoc(getDocRef<T>(path, id as string));
        },
        onError(err: FirestoreError) {},
    });
}

export function useDocument<T extends keyof DataBase>(path: T, id?: string) {
    return useLoadingPromise<DocumentSnapshot<DataBase[T]>, FirestoreError>(
        () => getDoc(getDocRef(path, id!)),
        [path, id],
        typeof id == "string"
    );
}
export function useDocumentQuery<T extends keyof DataBase>(
    path: T,
    id?: string
) {
    return useLoadingPromiseQuery<
        DocumentSnapshot<DataBase[T]>,
        FirestoreError
    >(() => getDoc(getDocRef(path, id!)), [path, id], typeof id == "string");
}

export function updateDocCache<T extends keyof DataBase>(
    path: T,
    val: DocumentSnapshot<DataBase[T]>,
    id: string
) {
    queryClient.setQueryData([path, id], val);
}
export async function getDocCache<T extends keyof DataBase>(
    path: T,
    id: string
): Promise<DocumentSnapshot<DataBase[T]>> {
    const data = queryClient.getQueryData<DocumentSnapshot<DataBase[T]>>([
        path,
        id,
    ]);
    if (data) return data;
    return await queryClient.fetchQuery([path, id], () =>
        getDoc(getDocRef(path, id!))
    );
}
