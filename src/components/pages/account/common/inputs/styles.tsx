/* eslint-disable react/display-name */
import classNames from "classnames";
import React, { Dispatch, InputHTMLAttributes, ReactNode } from "react";
export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
export interface SetInputProps<T> {
    setValue?: Dispatch<T>;
}
export interface GeneralInputProps<T extends string | number | any[]>
    extends InputHTMLAttributes<HTMLInputElement>,
        SetInputProps<T> {}
export const StyledInput = React.forwardRef<HTMLInputElement, InputProps>(
    (props, ref) => (
        <input
            autoComplete="off"
            ref={ref}
            {...props}
            className={classNames(
                "focus:tw-outline-none tw-bg-neutral-100 tw-px-4 tw-py-3 tw-block tw-w-full disabled:tw-bg-neutral-300",
                props.className
            )}
        />
    )
);
export interface Props
    extends React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
    > {
    label?: string | React.ReactNode;
}
export const LabelElem = React.forwardRef<HTMLDivElement, Props>(
    ({ label, children, ...props }, ref) => {
        if (!label) return <>{children}</>;
        return (
            <div
                ref={ref}
                {...props}
            >
                <label className="tw-block">
                    <span className="tw-py-2 tw-block tw-text-neutral-400 tw-leading-6">
                        {label}
                    </span>
                    {children}
                </label>
            </div>
        );
    }
);
export const WrapElem = React.forwardRef<HTMLDivElement, Props>(
    ({ label, children, ...props }, ref) => {
        if (!label) return <>{children}</>;
        return (
            <div
                ref={ref}
                {...props}
            >
                <span className="tw-py-2 tw-block tw-text-neutral-400 tw-leading-6">
                    {label}
                </span>
                {children}
            </div>
        );
    }
);
export function BottomLine({
    children,
    focus = false,
}: {
    children: ReactNode;
    focus?: boolean;
}) {
    return (
        <div
            className={classNames(
                'after:tw-content-[""] after:tw-absolute after:tw-w-0 focus-within:after:tw-w-full after:tw-transition-all after:tw-duration-75 after:tw-h-[3px] after:tw-bg-blue-600 after:tw-z-10 after:tw-bottom-0 after:tw-left-1/2 after:-tw-translate-x-1/2 tw-relative',
                {
                    "after:tw-w-full": focus,
                }
            )}
        >
            {children}
        </div>
    );
}
