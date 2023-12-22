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
import { auth, createCollection, getDocRef, getStorageRef } from "@/firebase";
import TeacherInfoForm, {
    OwnerDataType,
} from "@/components/pages/teachers/form";
import ErrorShower from "@/components/common/error";
import Head from "next/head";
import { useAuthState } from "react-firebase-hooks/auth";
import { ReactNode, useEffect, useLayoutEffect, useState } from "react";
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
import { getDownloadURL, uploadBytes } from "firebase/storage";
import StudentTeacherInfoForm, {
    DataType,
} from "@/components/pages/teachers/contact/form";
import { useDocument } from "@/hooks/fireStore";
export interface Props {
    doc: DataBase.WithIdType<DataBase["Teacher"]>;
    teacherInfo: DataBase.WithIdType<DataBase["TeacherInfo"]>;
    levels: DataBase.WithIdType<DataBase["Levels"]>[];
}
function CopyUserId({ text, children }: { text: string; children: ReactNode }) {
    const [copiedState, setCopiedState] = useState(false);
    const [copyState, setCopyState] = useState(false);
    return (
        <Tooltip
            title={copiedState ? "Copied" : "Copy"}
            disableInteractive
            disableFocusListener={copiedState}
            disableTouchListener={copiedState}
            open={copyState || copiedState}
            onOpen={() => {
                if (!copiedState) setCopyState(true);
            }}
            onClose={() => {
                setCopyState(false);
                setCopiedState(false);
            }}
            enterDelay={500}
            color={copiedState ? "success" : undefined}
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
    );
}
function Page({ doc: initData, levels, teacherInfo }: Props) {
    const [teacher] = useAuthState(auth);
    const teacherDoc = useAppSelector((state) => state.auth.user!);
    const [doc, setDoc] = useState(initData);
    const isAdmin = teacherDoc?.type == "admin";
    const isOwner = teacher?.uid == doc.id;
    const dispatch = useAppDispatch();
    const router = useRouter();
    useLayoutEffect(() => {
        if (router.query.id == undefined)
            router.replace(router.asPath, {
                query: {
                    id: doc.id,
                },
            });
    }, []);
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
                        onDataAdmin={async (data) => {
                            await updateDoc(getDocRef("Teacher", doc.id), {
                                ...data,
                                blocked: data.blocked
                                    ? {
                                          at: serverTimestamp(),
                                          teacherId: teacher!.uid,
                                      }
                                    : null,
                            });
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
                            setDoc({
                                ...doc,
                                ...data,
                                blocked: data.blocked
                                    ? {
                                          at: Timestamp.fromDate(new Date()),
                                          teacherId: teacher!.uid,
                                      }
                                    : null,
                            });
                        }}
                        onDataOwner={async (data) => {
                            const newData: Omit<OwnerDataType, "photoUrl"> & {
                                photoUrl?: string;
                            } = {
                                displayName: data.displayName,
                                phone: data.phone,
                            };
                            if (data.photoUrl) {
                                const res = await uploadBytes(
                                    getStorageRef(
                                        "Teachers",
                                        teacher!.uid,
                                        "profile"
                                    ),
                                    data.photoUrl
                                );
                                newData.photoUrl = await getDownloadURL(
                                    res.ref
                                );
                            }

                            await updateDoc(getDocRef("Teacher", doc.id), {
                                ...newData,
                            });
                            dispatch(
                                AuthActions.setUser({
                                    ...teacherDoc,
                                    ...newData,
                                })
                            );
                            setDoc({
                                ...doc,
                                ...newData,
                            });
                        }}
                        onFinish={() => {
                            alert("Document updated successfully");
                        }}
                        teacher={doc}
                        isAdmin={isAdmin}
                        isOwner={isOwner}
                    />
                </MainCard>
                <CardTitle>Students Info</CardTitle>
                <MainCard>
                    <StudentTeacherInfoForm
                        isNotCreator={teacher?.uid != doc.id}
                        defaultData={teacherInfo}
                        onData={async (data) => {
                            await updateDoc(
                                getDocRef("TeacherInfo", doc.id),
                                data
                            );
                            alert("document updated successfully");
                        }}
                        buttonName={"Update"}
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
                                href={`/?teacherId=${doc.id}`}
                                label={`Go To ${doc.displayName} DashBoard`}
                            />
                        </IsCreatorComp>

                        <GoToButton
                            href={`/assistant?teacherId=${doc.id}`}
                            label={`Go To ${doc.displayName} Assistant Board`}
                        />
                    </IsAdminComp>
                </NotIsOwnerComp>
                <IsOwnerComp teacherId={doc.id}>
                    <IsCreatorComp>
                        <GoToButton
                            href={`/?teacherId=${doc.id}`}
                            label={`Go To The DashBoard`}
                        />
                    </IsCreatorComp>
                    <GoToButton
                        href={`/assistant?teacherId=${doc.id}`}
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
    const [teacherDoc, loading3, error3] = useDocument(
        "TeacherInfo",
        teacherId
    );
    const [data, loading, error] = useCollectionOnce(
        query(
            createCollection("Levels"),
            where("teacherId", "==", teacherId),
            orderBy("order")
        )
    );
    if (error || error2 || error3)
        return <ErrorShower error={error || error2} />;
    if (loading || loading2 || loading3) return <ErrorShower loading />;
    if (!doc) return <Page404 message="The user is not Exist" />;
    if (!data) return <Page404 message="The user levels is not exist" />;
    const teacherExist = teacherDoc.exists();
    return (
        <Page
            doc={doc}
            teacherInfo={
                teacherExist
                    ? { id: teacherDoc.id, ...teacherDoc.data() }
                    : { id: teacherDoc.id }
            }
            levels={data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))}
        />
    );
}
