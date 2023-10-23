import Page404 from "@/components/pages/404";
import QuestionsViewer, {
    useGetResult,
} from "@/components/pages/exams/questions";
import Loader from "@/components/loader";
import Head from "next/head";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "../_app";
import { ProvideUser } from "@/components/wrapper";
import Protector from "@/components/protector";
import { useGetExam } from ".";
import { ResultType } from "@/firebase/func/data/results";
import { ExamType } from "@/firebase/func/data/exam";
import { ErrorMessageCom } from "@/components/handelErrorMessage";

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
    if (typeof id != "string")
        return <Page404 message="The Lesson id is not exist" />;
    if (queryResult.isLoading || queryExam.isLoading) return <Loader />;
    if (queryResult.error || queryExam.error)
        return <ErrorMessageCom error={queryResult.error || queryExam.error} />;

    return (
        <ProvideUser>
            <Protector>
                <Page
                    doc={queryResult.data.result}
                    exam={queryExam.data.exam}
                />
            </Protector>
        </ProvideUser>
    );
}
const FinalPage: NextPageWithLayout = () => {
    return <SafeArea />;
};
FinalPage.getLayout = (child) => {
    return <>{child}</>;
};
export default Page;
