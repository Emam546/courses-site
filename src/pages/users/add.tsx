import { BigCard, CardTitle, MainCard } from "@/components/card";
import { auth, getDocRef } from "@/firebase";
import UserAddInfoForm from "@/components/pages/users/add";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoToButton } from "@/components/common/inputs/addButton";
import Head from "next/head";
import ErrorShower from "@/components/common/error";
import Page404 from "@/components/pages/404";
import { useRouter } from "next/router";
import { useDocument } from "@/hooks/fireStore";
import { createStudentCall } from "@/firebase/functions";
import UsersTable, {
    Props as UserTableProps,
} from "@/components/pages/users/info/table";
import { useState } from "react";
import { perPage } from "@/components/pages/users/info/hooks";
import { getDoc } from "firebase/firestore";
export interface Props {
    level: DataBase.WithIdType<DataBase["Levels"]>;
}


export function Page({ level }: Props) {
    const [teacher] = useAuthState(auth);
    const [users, setUsers] = useState<UserTableProps["users"]>([]);
    const [page, setPage] = useState(0);
    return (
        <>
            <Head>
                <title>{level.name}: Add User</title>
            </Head>
            <BigCard>
                <CardTitle className="tw-mb-2">Adding User</CardTitle>
                <CardTitle>Level:{level.name}</CardTitle>
                <MainCard>
                    <UserAddInfoForm
                        onData={async (data) => {
                            const res = await createStudentCall({
                                displayname: data.displayname,
                                levelId: level.id,
                                teacherId: level.teacherId,
                                userName: data.userName,
                                email: data.email || undefined,
                                phone: data.phone || undefined,
                            });
                            if (!res.data.success) return alert(res.data.msg);
                            const id = res.data.data.id;
                            const user = await getDoc(
                                getDocRef("Students", id)
                            );
                            if (!user.exists())
                                return alert("The user was't added");

                            setUsers((pre) => {
                                return [
                                    ...pre,
                                    {
                                        id: user.id,
                                        ...user.data(),
                                        order: pre.length + 1,
                                    },
                                ];
                            });
                            alert("User added successfully");
                        }}
                        teacherId={level.teacherId}
                        buttonName="Submit"
                    />
                </MainCard>
                <CardTitle>Users added So Far</CardTitle>
                <MainCard>
                    <UsersTable
                        page={page}
                        setPage={setPage}
                        users={users.slice(
                            page * perPage,
                            (page + 1) * perPage
                        )}
                        headKeys={[
                            "order",
                            "displayname",
                            "userName",
                            "blocked",
                        ]}
                        totalUsers={users.length}
                    />
                </MainCard>
            </BigCard>
            <div className="tw-mt-3">
                <GoToButton
                    label="Go To The Level"
                    href={`/levels/info?${level.id}`}
                />
            </div>
        </>
    );
}
export default function SafeArea() {
    const router = useRouter();
    const { levelId } = router.query;
    const [level, isLoading, error] = useDocument("Levels", levelId as string);

    if (typeof levelId != "string") return <Page404 />;
    if (isLoading || error)
        return (
            <ErrorShower
                loading={isLoading}
                error={error}
            />
        );
    if (!level.exists()) return <Page404 message="The level is not exist" />;
    return <Page level={{ id: levelId, ...level.data() }} />;
}
