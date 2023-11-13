import QuestionsViewer from "@/components/pages/exams/questions";
import { useGetResult } from "@/components/pages/exams/questions/hooks";
import Loader from "@/components/loader";
import Head from "next/head";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "../_app";
import { ProviderUser } from "@/components/wrapper";
import { useGetExam } from ".";
import { ResultType } from "@/firebase/func/data/results";
import { ExamType } from "@/firebase/func/data/exam";
import {
    ErrorMessageCom,
    PageNotExisted,
} from "@/components/handelErrorMessage";

function Page({ doc, exam }: { doc: ResultType; exam: ExamType }) {
    return (
        <>
            <Head>
                <title>{exam.name}</title>
            </Head>
            <QuestionsViewer
                resultId={doc.id}
                initialData={doc}
                exam={exam}
            />
        </>
    );
}

function SafeArea() {
    const router = useRouter();
    const { id } = router.query;
    const queryResult = useGetResult(id as string);
    const queryExam = useGetExam(queryResult.data?.result.examId);

    if (typeof id != "string") return <PageNotExisted />;
    if (queryResult.error || queryExam.error)
        return <ErrorMessageCom error={queryResult.error || queryExam.error} />;
    if (queryResult.isLoading || queryExam.isLoading) return <Loader />;
    return (
        <ProviderUser>
            <Page
                doc={queryResult.data.result}
                exam={queryExam.data.exam}
            />
        </ProviderUser>
    );
}
const FinalPage: NextPageWithLayout = () => {
    return <SafeArea />;
};
FinalPage.getLayout = (child) => {
    return <>{child}</>;
};
export default FinalPage;
