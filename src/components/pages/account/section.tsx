import React, { ReactNode } from "react";
interface Props {
    label: string;
    children: ReactNode;
}
export default function Section({ label, children }: Props) {
    return (
        <>
            <h3 className="tw-mx-12 tw-text-neutral-400 tw-font-medium tw-text-sm tw-my-2">
                {label}
            </h3>
            <section className="tw-bg-white tw-p-10">{children}</section>
        </>
    );
}
