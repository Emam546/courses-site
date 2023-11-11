import { changeTitle, useChangeTitle, useResetTitle } from "@/hooks";
import React from "react";

export default function Loader() {
    useChangeTitle("Loading");
    return (
        <div id="preloder">
            <div className="loader" />
        </div>
    );
}
