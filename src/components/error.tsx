import React from "react";

export default function ErrorShower({ err }: { err: any }) {
    return (
        <div id="preloder">
            <div>
                <h2 className="tw-text-red-500">Error happened</h2>
            </div>
        </div>
    );
}
