import { CardTitle, MainCard } from "@/components/card";
import AddButton, { GoToButton } from "@/components/common/inputs/addButton";
import Page404 from "@/components/pages/404";
import QuestionInfoGetter from "@/components/pages/questions/info";
import Head from "next/head";
import { useRouter } from "next/router";

function SafeArea({ id }: { id: string }) {
    return (
        <div className="tw-flex-1 tw-flex tw-flex-col tw-items-stretch">
            <Head>
                <title>Questions</title>
            </Head>
            <div className="tw-flex-1">
                <MainCard>
                    <>
                        <CardTitle>Questions</CardTitle>
                        <MainCard>
                            <QuestionInfoGetter lessonId={id} />
                        </MainCard>
                    </>
                </MainCard>
            </div>
            <div className="py-3">
                <AddButton
                    label="Add Questions"
                    href={`/questions/add?lessonId=${id}`}
                />
                <GoToButton
                    label="Go To Lesson"
                    href={`/lessons?id=${id}`}
                />
            </div>
        </div>
    );
}
export default function Page() {
    const router = useRouter();
    const id = router.query.id;
    if (typeof id != "string") return <Page404 />;
    return <SafeArea id={id} />;
}
