import UsersInfoGenerator from "@/components/pages/users/info";
import React from "react";

export default function Page() {
    return (
        <div className="tw-flex-1 tw-flex tw-flex-col tw-items-stretch">
            <div className="tw-flex-1">
                <UsersInfoGenerator />
            </div>
        </div>
    );
}
