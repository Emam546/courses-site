import Page404 from "@/components/pages/404";
import QuestionsViewer from "@/components/pages/exams/questions";
import { useDocument, useGetDoc } from "@/hooks/fireStore";
import { QueryDocumentSnapshot } from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import ErrorShower from "@/components/common/error";
export interface Props {
    exam: DataBase.WithIdType<DataBase["Exams"]>;
    result: DataBase.WithIdType<DataBase["Results"]>;
}
function Page({ exam, result }: Props) {
    return (
        <>
            <Head>
                <title>{exam.name}</title>
            </Head>
            <QuestionsViewer
                result={result}
                exam={exam}
            />
        </>
    );
}

function SafeArea() {
    const router = useRouter();
    const { id } = router.query;
    const [result, isLoading, error] = useDocument("Results", id as string);
    const [exam, isLoading2, error2] = useDocument(
        "Exams",
        result?.data()?.examId
    );
    if (typeof id != "string")
        return <Page404 message="The Lesson id is not exist" />;
    if (error || error2)
        return (
            <ErrorShower
                loading={false}
                error={error || error2}
            />
        );
    if (isLoading || isLoading2) return <ErrorShower loading />;

    if (!result.exists()) return <Page404 message="The Result is not exist" />;
    if (!exam.exists()) return <Page404 message="The Exam is not exist" />;

    return (
        <Page
            result={{ ...result.data(), id: result.id }}
            exam={{
                ...exam.data(),
                id: exam.id,
            }}
        />
    );
}

export default SafeArea;
