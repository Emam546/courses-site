/* eslint-disable react/display-name */
import classNames from "classnames";
import React, { InputHTMLAttributes, SelectHTMLAttributes } from "react";
import { FieldError } from "react-hook-form";

export function ErrorShower({
    err,
    className,
    ...props
}: { err?: FieldError } & React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <>
            {err && (
                <p
                    className={classNames("tw-text-red-600")}
                    {...props}
                >
                    {err.type == "required" && "Required"}
                    {err.message != "" && err.message}
                </p>
            )}
        </>
    );
}
export type NormalInputProps = {
    err?: FieldError;
    labelText: React.ReactNode;
    id: string;
} & InputHTMLAttributes<HTMLInputElement>;
export const NormalInput = React.forwardRef<HTMLInputElement, NormalInputProps>(
    ({ labelText, err, id, ...props }, ref) => {
        return (
            <div>
                <label
                    htmlFor={id}
                    className="tw-block tw-mb-2 tw-text-sm tw-font-medium tw-text-gray-900 dark:tw-text-white"
                >
                    {labelText}
                </label>
                <input
                    id={id}
                    className="tw-bg-gray-50 tw-border tw-border-gray-300 tw-text-gray-900 sm:tw-text-sm tw-rounded-lg focus:tw-ring-primary-600 focus:tw-border-primary-600 tw-block tw-w-full tw-p-2.5 dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:tw-placeholder-gray-400 dark:tw-text-white dark:focus:tw-ring-blue-500 dark:focus:tw-border-blue-500"
                    {...props}
                    ref={ref}
                />
                <ErrorShower err={err} />
            </div>
        );
    }
);
export type SelectInputProps = {
    err?: FieldError;
    labelText: React.ReactNode;
    id: string;
} & SelectHTMLAttributes<HTMLSelectElement>;
export const SelectInput = React.forwardRef<
    HTMLSelectElement,
    SelectInputProps
>(({ labelText, children, err, id, ...props }, ref) => {
    return (
        <div>
            <label
                htmlFor={id}
                className="tw-block tw-mb-2 tw-text-sm tw-font-medium tw-text-gray-900 dark:tw-text-white"
            >
                {labelText}
            </label>

            <select
                id={id}
                className="tw-bg-gray-50 tw-border tw-border-gray-300 tw-text-gray-900 sm:tw-text-sm tw-rounded-lg focus:tw-ring-primary-600 focus:tw-border-primary-600 tw-block tw-w-full tw-p-2.5 dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:tw-placeholder-gray-400 dark:tw-text-white dark:focus:tw-ring-blue-500 dark:focus:tw-border-blue-500"
                ref={ref}
                {...props}
            >
                {children}
            </select>
            <ErrorShower err={err} />
        </div>
    );
});