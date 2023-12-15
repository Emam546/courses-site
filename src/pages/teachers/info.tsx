import { BigCard, CardTitle, MainCard } from "@/components/card";
import { useRouter } from "next/router";
import {
    FirestoreError,
    getDoc,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from "firebase/firestore";
import { auth, createCollection, getDocRef } from "@/firebase";
import TeacherInfoForm from "@/components/pages/teachers/form";
import ErrorShower from "@/components/common/error";
import Head from "next/head";
import { useAuthState } from "react-firebase-hooks/auth";
import { ReactNode, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import LevelsInfoGetter from "@/components/pages/levels/info";
import { useCollectionOnce } from "react-firebase-hooks/firestore";
import {
    IsAdminComp,
    IsCreatorComp,
    IsOwnerComp,
    NotIsOwnerComp,
} from "@/components/wrappers/wrapper";
import { GoToButton } from "@/components/common/inputs/addButton";
import Page404 from "@/components/pages/404";
import { useLoadingPromise } from "@/hooks";
import { AuthActions } from "@/store/auth";
import { hasOwnProperty } from "@/utils";
import Tooltip from "@mui/material/Tooltip";
import { Timestamp } from "firebase/firestore";
export interface Props {
    doc: DataBase.WithIdType<DataBase["Teacher"]>;
    levels: DataBase.WithIdType<DataBase["Levels"]>[];
}
function CopyUserId({ text, children }: { text: string; children: ReactNode }) {
    const [copiedState, setCopiedState] = useState(false);
    const [copyState, setCopyState] = useState(false);
    return (
        <Tooltip
            title="Copy"
            disableInteractive
            onOpen={() => {
                if (!copiedState) setCopyState(true);
            }}
            open={copyState}
            onClose={() => {
                setCopyState(false);
            }}
            enterDelay={500}
        >
            <Tooltip
                title="Copied"
                open={copiedState}
                disableFocusListener
                disableInteractive
                disableTouchListener
                onClose={() => setCopiedState(false)}
                color="success"
            >
                <button
                    type="button"
                    onClick={() => {
                        setCopiedState(true);
                        setCopyState(false);
                        navigator.clipboard.writeText(text);
                    }}
                    className="tw-p-0 tw-m-0  tw-bg-inherit tw-border-none tw-text-gray-400 hover:tw-text-gray-300 focus:tw-text-gray-300"
                >
                    {children}
                </button>
            </Tooltip>
        </Tooltip>
    );
}
function Page({ doc: initData, levels }: Props) {
    const [teacher] = useAuthState(auth);
    const teacherDoc = useAppSelector((state) => state.auth.user!);
    const [doc, setDoc] = useState(initData);
    const isAdmin = teacherDoc?.type == "admin";
    const isOwner = teacher?.uid == doc.id;
    const dispatch = useAppDispatch();

    return (
        <>
            <Head>
                <title>Teacher:{doc.displayName}</title>
            </Head>
            <BigCard>
                <div className="tw-flex tw-justify-between">
                    <CardTitle>Update User</CardTitle>
                    <CopyUserId text={doc.id}>ID: {doc.id}</CopyUserId>
                </div>
                <MainCard>
                    <TeacherInfoForm
                        onData={async (data) => {
                            let newData: DataBase.WithIdType<
                                DataBase["Teacher"]
                            > = {
                                ...doc,
                            };
                            if (hasOwnProperty(data, "blocked")) {
                                if (isOwner)
                                    dispatch(
                                        AuthActions.setUser({
                                            ...teacherDoc,
                                            ...data,
                                            blocked: data.blocked
                                                ? {
                                                      at: new Date().toString(),
                                                      teacherId: teacher!.uid,
                                                  }
                                                : null,
                                        })
                                    );
                                await updateDoc(getDocRef("Teacher", doc.id), {
                                    ...data,
                                    blocked: data.blocked
                                        ? {
                                              at: serverTimestamp(),
                                              teacherId: teacher!.uid,
                                          }
                                        : null,
                                });
                                setDoc({
                                    ...doc,
                                    ...data,
                                    blocked: data.blocked
                                        ? {
                                              at: Timestamp.fromDate(
                                                  new Date()
                                              ),
                                              teacherId: teacher!.uid,
                                          }
                                        : null,
                                });
                            } else {
                                if (isOwner)
                                    dispatch(
                                        AuthActions.setUser({
                                            ...teacherDoc,
                                            ...data,
                                        })
                                    );
                                await updateDoc(getDocRef("Teacher", doc.id), {
                                    ...data,
                                });
                                setDoc({
                                    ...doc,
                                    ...data,
                                });
                            }
                        }}
                        teacher={doc}
                        isAdmin={isAdmin}
                        isOwner={isOwner}
                    />
                </MainCard>
                {levels.length > 0 && (
                    <IsAdminComp>
                        <CardTitle>Levels</CardTitle>
                        <MainCard>
                            <LevelsInfoGetter
                                levels={levels}
                                isNotCreator={teacher?.uid == doc.id}
                            />
                        </MainCard>
                    </IsAdminComp>
                )}
            </BigCard>
            <div className="tw-py-3">
                <NotIsOwnerComp teacherId={doc.id}>
                    <IsAdminComp>
                        <IsCreatorComp user={doc}>
                            <GoToButton
                                href={`/?=${doc.id}`}
                                label={`Go To ${doc.displayName} DashBoard`}
                            />
                        </IsCreatorComp>

                        <GoToButton
                            href={`/assistants?=${doc.id}`}
                            label={`Go To ${doc.displayName} Assistant Board`}
                        />
                    </IsAdminComp>
                </NotIsOwnerComp>
                <IsOwnerComp teacherId={doc.id}>
                    <IsCreatorComp>
                        <GoToButton
                            href={`/?=${doc.id}`}
                            label={`Go To The DashBoard`}
                        />
                    </IsCreatorComp>
                    <GoToButton
                        href={`/assistants?=${doc.id}`}
                        label={`Go To The Assistant Board`}
                    />
                </IsOwnerComp>
            </div>
        </>
    );
}
export async function getTeacher(
    id: string
): Promise<DataBase.WithIdType<DataBase["Teacher"]> | null> {
    const doc = await getDoc(getDocRef("Teacher", id));
    if (!doc.exists()) return null;

    return {
        id: doc.id,
        ...doc.data(),
    };
}
export function useGetTeacher(id?: string) {
    return useLoadingPromise<
        DataBase.WithIdType<DataBase["Teacher"]> | null,
        FirestoreError
    >(() => getTeacher(id!), [id], typeof id == "string");
}
export default function SafeArea() {
    const router = useRouter();
    const [teacher] = useAuthState(auth);
    const teacherId = (router.query.id || teacher!.uid) as string;
    const [doc, loading2, error2] = useGetTeacher(teacherId);
    const [data, loading, error] = useCollectionOnce(
        query(
            createCollection("Levels"),
            where("teacherId", "==", teacherId),
            orderBy("order")
        )
    );
    if (error || error2) return <ErrorShower error={error || error2} />;
    if (loading || loading2) return <ErrorShower loading />;
    if (!doc) return <Page404 message="The user is not Exist" />;
    if (!data) return <ErrorShower loading={loading} />;
    if (error || loading)
        return (
            <ErrorShower
                loading={loading}
                error={error}
            />
        );

    return (
        <Page
            doc={doc}
            levels={data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))}
        />
    );
}
