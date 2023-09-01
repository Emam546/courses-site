import classNames from "classnames";
import React from "react";
export interface MainCardProps {
    children: React.ReactNode;
}
export function MainCard({
    children,
    className,
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className="card">
            <div className={classNames("card-body", className)}>{children}</div>
        </div>
    );
}
export type CardTitleProps = React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
>;
export function CardTitle({ ...props }: CardTitleProps) {
    return (
        <h5
            className={classNames("card-title fw-semibold", props.className)}
            {...props}
        />
    );
}
