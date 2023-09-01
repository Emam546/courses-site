import classNames from "classnames";
import React from "react";
export type InputProps = React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
>;
export const StyledInput = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, ...props }, ref) => {
        return (
            <input
                className={classNames("form-control placeholder:tw-text-gray-300", className)}
                {...props}
                ref={ref}
            />
        );
    }
);
export const StyledSelect = React.forwardRef<
    HTMLSelectElement,
    React.DetailedHTMLProps<
        React.SelectHTMLAttributes<HTMLSelectElement>,
        HTMLSelectElement
    >
>(({ className, ...props }, ref) => {
    return (
        <select
            className={classNames("form-select", className)}
            ref={ref}
            {...props}
        />
    );
});

export interface Props
    extends React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
    > {
    label?: string | React.ReactNode;
}
export const WrapElem = React.forwardRef<HTMLDivElement, Props>(
    ({ label, children, ...props }, ref) => {
        if (!label) return <>{children}</>;
        return (
            <div
                ref={ref}
                {...props}
            >
                <span className="form-label tw-mb-1 tw-block">{label}</span>
                {children}
            </div>
        );
    }
);
