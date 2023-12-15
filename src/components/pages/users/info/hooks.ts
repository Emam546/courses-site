import { auth, createCollection, getDocRef } from "@/firebase";
import { FirestoreError, QueryDocumentSnapshot } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import {
    QuerySnapshot,
    getCountFromServer,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
export const perPage = 30;

export function useGetUsersCount({
    courseId,
    levelId,
}: {
    courseId?: string;
    levelId?: string;
}) {
    const [teacher] = useAuthState(auth);
    return useQuery({
        queryKey: ["Students", "count", courseId || levelId],
        queryFn: async () => {
            if (courseId) {
                return (
                    await getCountFromServer(
                        query(
                            createCollection("Payments"),
                            where("courseId", "==", courseId)
                        )
                    )
                ).data().count;
            }
            if (levelId) {
                return (
                    await getCountFromServer(
                        query(
                            createCollection("Students"),
                            where("levelId", "==", levelId)
                        )
                    )
                ).data().count;
            }
            return (
                await getCountFromServer(
                    query(
                        createCollection("Students"),
                        where("teacherId", "==", teacher!.uid)
                    )
                )
            ).data().count;
        },
        onError(err: FirestoreError) {},
    });
}
export function useGetUsers({
    courseId,
    levelId,
    page,
}: {
    courseId?: string;
    levelId?: string;
    page: number;
}) {
    const [teacher] = useAuthState(auth);
    return useQuery({
        queryKey: ["Students", "page", page, courseId || levelId],

        queryFn: async (): Promise<
            QueryDocumentSnapshot<DataBase["Students"]>[]
        > => {
            if (courseId) {
                const enrollment = await getDoc(
                    getDocRef("EnrolledUsersRecord", courseId)
                );
                if (!enrollment.exists()) return [];
                const users = await Promise.all(
                    enrollment
                        .data()
                        .payments.slice(
                            perPage * page,
                            perPage * page + perPage
                        )
                        .map(async ({ userId }) => {
                            return await getDoc(getDocRef("Students", userId));
                        })
                );
                return users.filter(
                    (doc): doc is QueryDocumentSnapshot<DataBase["Students"]> =>
                        doc.exists()
                );
            }
            if (levelId) {
                return (
                    await getDocs(
                        query(
                            createCollection("Students"),
                            where("levelId", "==", levelId),
                            orderBy("createdAt"),
                            limit(perPage * page + perPage)
                        )
                    )
                ).docs.slice(perPage * page, perPage * page + perPage);
            }
            return (
                await getDocs(
                    query(
                        createCollection("Students"),
                        where("teacherId", "==", teacher!.uid),
                        orderBy("createdAt"),
                        limit(perPage * page + perPage)
                    )
                )
            ).docs.slice(perPage * page, perPage * page + perPage);
        },
        onError(err: FirestoreError) {},
    });
}
