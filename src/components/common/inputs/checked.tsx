import React from "react";
import { ErrorInputShower } from "./main";
import { FieldError } from "react-hook-form";
export type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    err?: FieldError;
};
const CheckedInput = React.forwardRef<HTMLInputElement, Props>(
    ({ id, title, err, ...props }, ref) => {
        return (
            <>
                <div className="form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id={id}
                        ref={ref}
                        {...props}
                    />
                    <label
                        className="form-check-label"
                        htmlFor={id}
                    >
                        {title}
                    </label>
                </div>
                <ErrorInputShower err={err} />
            </>
        );
    }
);
export default CheckedInput;
