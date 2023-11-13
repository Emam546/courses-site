import { ReactElement } from "react";

import { PageNotExisted } from "@/components/handelErrorMessage";

function Page() {
    return (
        <>
            <PageNotExisted />
        </>
    );
}
Page.getLayout = function getLayout(page: ReactElement) {
    return <>{page}</>;
};
export default Page;
