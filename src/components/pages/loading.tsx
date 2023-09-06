import React from "react";
import LoadingIndicator from "../common/loadingIndicator";

export default function LoadingArea() {
    return (
        <div className="tw-min-h-screen tw-flex tw-items-center tw-justify-center">
            <div className="tw-flex tw-flex-col tw-items-center">
                <LoadingIndicator />
                <h2 className="tw-mt-3">Loading ...</h2>
            </div>
        </div>
    );
}
