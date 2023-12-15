import { BigCard, CardTitle, MainCard } from "@/components/card";
import ErrorShower from "@/components/common/error";
import AddButton, { GoToButton } from "@/components/common/inputs/addButton";
import Page404 from "@/components/pages/404";
import CourseInfoFormGetter from "@/components/pages/courses/info";
import { auth } from "@/firebase";
import { useDocument } from "@/hooks/fireStore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { IsOwnerComp } from "@/components/wrappers/wrapper";
import { useAppSelector } from "@/store";
import { useGetCourses } from "./info";
import UserLevelInfoGenerator from "@/components/pages/levels/users";

interface Props {
    doc: DataBase.WithIdType<DataBase["Levels"]>;
    courses: DataBase.WithIdType<DataBase["Courses"]>[];
}
function Page({ doc, courses }: Props) {
    const [teacher] = useAuthState(auth);
    return (
        <div className="tw-flex-1 tw-flex tw-flex-col tw-items-stretch">
            <Head>
                <title>{doc.name}</title>
            </Head>
            <BigCard>
                <UserLevelInfoGenerator
                    courses={courses}
                    level={doc}
                />
            </BigCard>
            <div className="py-3">
                <GoToButton
                    label="Go To The Level"
                    href={`/levels?id=${doc.id}`}
                />
            </div>
        </div>
    );
}

export default function SafeArea() {
    const id = useRouter().query.levelId;
    const [doc, loading, error] = useDocument("Levels", id as string);

    const [courses, loading2, error2] = useGetCourses(id as string);

    if (typeof id != "string")
        return <Page404 message="You must provide the page id" />;

    if (error || error2) return <ErrorShower error={error || error2} />;
    if (loading) return <ErrorShower loading />;
    if (!doc.exists()) return <Page404 message="The Level id is not exist" />;
    if (loading2) return <ErrorShower loading />;

    return (
        <Page
            courses={courses.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))}
            doc={{ id, ...doc.data() }}
        />
    );
}
