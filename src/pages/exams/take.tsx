import Page404 from "@/components/pages/404";
import QuestionsViewer from "@/components/pages/exams/questions";
import Loader from "@/components/loader";
import { PaymentProtector } from "@/components/payment";
import { DataBase } from "@/data";
import { useGetDoc } from "@/hooks/firebase";
import { QueryDocumentSnapshot } from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "../_app";
import { ProvideUser } from "@/components/wrapper";
import Protector from "@/components/protector";
import { useGetExamCourse } from ".";
import { GoToButton } from "@/components/common/addButton";
function SafeArea({
    doc,
}: {
    doc: QueryDocumentSnapshot<DataBase["Results"]>;
}) {
    const { data: exam } = useGetDoc("Exams", doc.data().examId);

    return (
        <>
            <Head>
                <title>{exam?.data()?.name || "loading ..."}</title>
            </Head>
            {exam?.exists() && (
                <QuestionsViewer
                    resultId={doc.id}
                    exam={exam}
                />
            )}
        </>
    );
}

function Main() {
    const router = useRouter();
    const { id } = router.query;
    const queryResult = useGetDoc("Results", id as string);
    const queryCourse = useGetExamCourse(queryResult.data?.data()?.examId);

    if (typeof id != "string")
        return <Page404 message="The Lesson id is not exist" />;
    if (queryResult.isLoading) return <Loader />;
    if (queryResult.isError) return null;
    if (!queryResult.data.exists())
        return <Page404 message="The Lesson is not exist" />;
    if (queryCourse.isLoading) return <Loader />;
    if (queryCourse.isError) return null;
    if (!queryCourse.data.exists())
        return <Page404 message="The Course is not exist" />;

    return (
        <ProvideUser>
            <Protector>
                <PaymentProtector course={queryCourse.data}>
                    <SafeArea doc={queryResult.data} />
                </PaymentProtector>
            </Protector>
        </ProvideUser>
    );
}
const Page: NextPageWithLayout = () => {
    return <Main />;
};
Page.getLayout = (child) => {
    return <>{child}</>;
};
export default Page;
