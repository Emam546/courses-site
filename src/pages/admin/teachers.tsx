import { BigCard } from "@/components/card";
import ErrorShower from "@/components/common/error";
import TeachersTable, {
    Props as UserTableProps,
    perPage,
} from "@/components/pages/admin/TeachreTable";
import { createCollection } from "@/firebase";
import { useQuery } from "@tanstack/react-query";
import {
    FirestoreError,
    getCountFromServer,
    getDocs,
    limit,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import Head from "next/head";
import { useState } from "react";
export interface Props {
    count: number;
}
function useGetAssistantsCount() {
    return useQuery<number, FirestoreError>({
        queryKey: ["Teachers", "count"],
        queryFn: async () => {
            const res = await getCountFromServer(
                query(createCollection("Teacher"), orderBy("createdAt", "desc"))
            );
            return res.data().count - 1;
        },
    });
}
function useGetAssistants(page: number) {
    return useQuery<UserTableProps["users"], FirestoreError>({
        queryKey: ["Teachers", "lastTeachers", page],
        queryFn: async () => {
            const res = await getDocs(
                query(
                    createCollection("Teacher"),

                    orderBy("createdAt", "desc"),
                    limit(perPage)
                )
            );
            return res.docs.map((doc, i) => {
                return {
                    id: doc.id,
                    order: i + 1,
                    ...doc.data(),
                };
            });
        },
    });
}
function Page({ count }: Props) {
    const [page, setPage] = useState(0);
    const initUser = useGetAssistants(page);
    return (
        <>
            <Head>
                <title>Admin</title>
            </Head>
            <BigCard>
                <div className="card w-100">
                    <div className="card-body p-4">
                        <h5 className="card-title fw-semibold mb-4">
                            Assistants
                        </h5>
                        <TeachersTable
                            page={page}
                            setPage={setPage}
                            totalUsers={count}
                            users={initUser.data || []}
                        />
                        <ErrorShower error={initUser.error} />
                    </div>
                </div>
            </BigCard>
        </>
    );
}

export default function SafeArea() {
    const userCount = useGetAssistantsCount();
    if (userCount.error)
        return (
            <ErrorShower
                loading={false}
                error={userCount.error}
            />
        );
    if (userCount.isLoading) return <ErrorShower loading />;
    return <Page count={userCount.data} />;
}
