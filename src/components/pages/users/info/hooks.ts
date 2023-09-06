import { DataBase } from "@/data";
import { createCollection, getDocRef } from "@/firebase";
import { useQuery } from "@tanstack/react-query";
import {
    QuerySnapshot,
    getCountFromServer,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    startAt,
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
        queryKey: ["users", "count", levelId, courseId],
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
        queryKey: ["users", "page", page, levelId, courseId],
        queryFn: async (): Promise<QuerySnapshot<DataBase["Users"]>> => {
            if (courseId) {
                const users = await Promise.all(
                    (
                        await getDocs(
                            query(
                                createCollection("Payment"),
                                where("courseId", "==", courseId),
                                orderBy("activatedAt"),
                                startAt(page * perPage),
                                limit(perPage)
                            )
                        )
                    ).docs.map(async (pay) => {
                        return await getDoc(
                            getDocRef("Users", pay.data().userId)
                        );
                    })
                );
                const docs = {
                    docs: users,
                    empty: users.length == 0,
                    size: users.length,
                    query: undefined,
                } as unknown as QuerySnapshot<DataBase["Users"]>;
                return docs;
            }
            if (levelId) {
                return await getDocs(
                    query(
                        createCollection("Users"),
                        where("levelId", "==", levelId),
                        orderBy("createdAt"),
                        startAt(page * perPage),
                        limit(perPage)
                    )
                );
            }
            return await getDocs(
                query(
                    createCollection("Users"),
                    orderBy("createdAt"),
                    startAt(page * perPage),
                    limit(perPage)
                )
            );
        },
    });
}
