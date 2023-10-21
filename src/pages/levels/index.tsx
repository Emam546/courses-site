import { MainCard } from "@/components/card";
import AddButton, { GoToButton } from "@/components/common/inputs/addButton";
import LevelsInfoGetter from "@/components/pages/levels/info";
import Head from "next/head";

export default function Levels() {
    return (
        <div className="tw-flex-1 tw-flex tw-flex-col tw-items-stretch">
            <Head>
                <title>Levels</title>
            </Head>
            <div className="tw-flex-1">
                <MainCard>
                    <LevelsInfoGetter />
                </MainCard>
            </div>
            <div className="tw-py-3">
                <AddButton
                    label="Add Level"
                    href="/levels/add"
                />
            </div>
        </div>
    );
}
