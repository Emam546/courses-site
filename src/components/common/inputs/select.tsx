import React from "react";
import { StyledSelect } from "./styles";
export type Props = {
    id: string;
    title: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

const SelectInput = React.forwardRef<HTMLSelectElement, Props>(function (
    { id, title, ...props },
    ref
) {
    return (
        <div>
            <label
                htmlFor={id}
                className="form-label"
            >
                {title}
            </label>
            <StyledSelect
                id={id}
                {...props}
                ref={ref}
            />
        </div>
    );
});
export default SelectInput;
