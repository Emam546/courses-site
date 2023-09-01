import React from "react";

const CheckedInput = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
>(({ id, title, ...props }, ref) => {
    return (
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
    );
});
export default CheckedInput;
