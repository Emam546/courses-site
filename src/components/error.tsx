import React from "react";
import Page404 from "./pages/404";

export default function ErrorShower({ err }: { err: any }) {
    return (
        <Page404 state="504">
            <div>
                <h2 className="tw-text-red-500">Error happened</h2>
            </div>
        </Page404>
    );
}
