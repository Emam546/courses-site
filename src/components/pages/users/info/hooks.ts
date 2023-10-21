import { DataBase } from "@/data";
import { auth, createCollection, getDocRef } from "@/firebase";
import { QueryDocumentSnapshot } from "firebase/firestore";
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
const perPage = 30;

export function useGetUsersCount({
    courseId,
    levelId,
}: {
    courseId?: string;
    levelId?: string;
}) {
    const [teacher] = useAuthState(auth);
    return useQuery({
        queryKey: ["UsersTeachers", "count", levelId, courseId],
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
                            createCollection("UsersTeachers"),
                            where("levelId", "==", levelId)
                        )
                    )
                ).data().count;
            }
            return (
                await getCountFromServer(
                    query(
                        createCollection("UsersTeachers"),
                        where("teacherId", "==", teacher!.uid)
                    )
                )
            ).data().count;
        },
    });
}
export function useGetUser({
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
        queryKey: ["UsersTeachers", "page", page, levelId, courseId],

        queryFn: async (): Promise<
            QueryDocumentSnapshot<DataBase["UsersTeachers"]>[]
        > => {
            if (courseId) {
                const users = await Promise.all(
                    (
                        await getDocs(
                            query(
                                createCollection("Payments"),
                                where("courseId", "==", courseId),
                                limit(perPage * page + perPage)
                            )
                        )
                    ).docs
                        .slice(perPage * page, perPage * page + perPage)
                        .map(async (pay) => {
                            return await getDoc(
                                getDocRef(
                                    "UsersTeachers",
                                    teacher!.uid + pay.data().userId
                                )
                            );
                        })
                );
                return users.filter((doc) =>
                    doc.exists()
                ) as unknown as QueryDocumentSnapshot<
                    DataBase["UsersTeachers"]
                >[];
            }
            if (levelId) {
                return (
                    await getDocs(
                        query(
                            createCollection("UsersTeachers"),
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
                        createCollection("UsersTeachers"),
                        where("teacherId", "==", teacher!.uid),
                        orderBy("createdAt"),
                        limit(perPage * page + perPage)
                    )
                )
            ).docs.slice(perPage * page, perPage * page + perPage);
        },
    });
}
