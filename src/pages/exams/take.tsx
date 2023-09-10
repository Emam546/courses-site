import Page404 from "@/components/pages/404";
import QuestionsViewer from "@/components/pages/exams/questions";
import { DataBase } from "@/data";
import { useGetDoc } from "@/hooks/fireStore";
import { QueryDocumentSnapshot } from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import ErrorShower from "@/components/common/error";

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
    if (typeof id != "string")
        return <Page404 message="The Lesson id is not exist" />;
    if (queryResult.isLoading || queryResult.isError)
        return (
            <ErrorShower
                error={queryResult.error as any}
                loading={queryResult.isLoading}
            />
        );

    if (!queryResult.data.exists())
        return <Page404 message="The Lesson is not exist" />;

    return <SafeArea doc={queryResult.data} />;
}
const Page = () => {
    return <Main />;
};
export default Page;
