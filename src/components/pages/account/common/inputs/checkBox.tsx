import classNames from "classnames";
import React from "react";
import style from "./checkbox.module.css";
export default function CheckBox({
    label,
    ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
    return (
        <label className="tw-flex tw-items-center tw-gap-1">
            <input
                {...props}
                type="checkbox"
                id={props.name}
                className={classNames(
                    style["input_checkbox"],
                    "tw-appearance-none",
                    props.className
                )}
            />
            <div
                className={classNames(
                    "tw-inline-block tw-w-12 tw-p-[2px] tw-bg-neutral-300 hover:tw-bg-neutral-500 tw-rounded-xl tw-cursor-pointer tw-transition",
                    "after:tw-content-[''] after:tw-w-5 after:tw-h-5 after:tw-rounded-[50%] after:tw-block after:tw-bg-white after:tw-z-10 after:tw-transition"
                )}
            ></div>
            {label && <span>{label}</span>}
        </label>
    );
}
