import { DataBase } from "@/data";
import { createCollection, getDocRef } from "@/firebase";
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
const perPage = 30;

export function useGetUsersCount({
    courseId,
    levelId,
}: {
    courseId?: string;
    levelId?: string;
}) {
    return useQuery({
        queryKey: ["Users", "count", levelId, courseId],
        queryFn: async () => {
            if (courseId) {
                return (
                    await getCountFromServer(
                        query(
                            createCollection("Payment"),
                            where("courseId", "==", courseId)
                        )
                    )
                ).data().count;
            }
            if (levelId) {
                return (
                    await getCountFromServer(
                        query(
                            createCollection("Users"),
                            where("levelId", "==", levelId)
                        )
                    )
                ).data().count;
            }
            return (
                await getCountFromServer(query(createCollection("Users")))
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
    return useQuery({
        queryKey: ["Users", "page", page, levelId, courseId],
        queryFn: async (): Promise<
            QueryDocumentSnapshot<DataBase["Users"]>[]
        > => {
            if (courseId) {
                const users = await Promise.all(
                    (
                        await getDocs(
                            query(
                                createCollection("Payment"),
                                where("courseId", "==", courseId),
                                limit(perPage * page + perPage)
                            )
                        )
                    ).docs
                        .slice(perPage * page, perPage * page + perPage)
                        .map(async (pay) => {
                            return await getDoc(
                                getDocRef("Users", pay.data().userId)
                            );
                        })
                );
                return users.filter((doc) =>
                    doc.exists()
                ) as unknown as QueryDocumentSnapshot<DataBase["Users"]>[];
            }
            if (levelId) {
                return (
                    await getDocs(
                        query(
                            createCollection("Users"),
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
                        createCollection("Users"),
                        orderBy("createdAt"),
                        limit(perPage * page + perPage)
                    )
                )
            ).docs.slice(perPage * page, perPage * page + perPage);
        },
    });
}
