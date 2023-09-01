import React from "react";
type Props = {
    id: string;
    title: string;
    desc?: string;
} & React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
>;
const MainInput = React.forwardRef<HTMLInputElement, Props>(function (
    { id, title, desc, ...props }: Props,
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
            <input
                className="form-control"
                id={id}
                {...props}
                ref={ref}
            />
            {desc && <div className="form-text">{desc}</div>}
        </div>
    );
});
export default MainInput;
