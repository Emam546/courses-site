import { BigCard, CardTitle, MainCard } from "@/components/card";
import AddButton, { GoToButton } from "@/components/common/inputs/addButton";
import LevelsInfoGetter from "@/components/pages/levels/info";
import Head from "next/head";

export default function Levels() {
    return (
        <div className="tw-flex-1 tw-flex tw-flex-col tw-items-stretch">
            <Head>
                <title>Levels</title>
            </Head>
            <BigCard>
                <CardTitle>Levels</CardTitle>
                <MainCard>
                    <LevelsInfoGetter />
                </MainCard>
            </BigCard>
            <div className="tw-py-3">
                <AddButton
                    label="Add Level"
                    href="/levels/add"
                />
            </div>
        </div>
    );
}
