/* eslint-disable react/display-name */
import classNames from "classnames";
import React, { RefObject } from "react";
interface Props extends React.HTMLAttributes<HTMLDivElement> {}

const Grid2Container = React.forwardRef<HTMLDivElement, Props>((props, ref) => (
    <div
        {...props}
        ref={ref}
        className={classNames(
            "tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-x-7 tw-gap-y-4 tw-transition-[width] tw-duration-700",
            props.className
        )}
    >
        {props.children}
    </div>
));
export default Grid2Container;
