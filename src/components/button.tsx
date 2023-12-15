import classNames from "classnames";
import React from "react";

export default function PrimaryButton({
    className,
    ...props
}: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
>) {
    return (
        <button
            className={classNames("btn btn-primary", className)}
            {...props}
        />
    );
}

export function SuccessButton({
    className,
    ...props
}: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
>) {
    return (
        <button
            className={classNames("btn btn-success", className)}
            {...props}
        />
    );
}
