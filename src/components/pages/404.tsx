import React from "react";
export interface Message {
    message?: string;
}
export default function Page404({ message="The Url is not exist" }: Message) {
    return (
        <div className="tw-flex-1 tw-flex tw-flex-col tw-justify-center tw-items-center">
            <div>404</div>
            {message != undefined && <div>{message}</div>}
        </div>
    );
}
