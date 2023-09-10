/* eslint-disable react/display-name */
import React, { useEffect, useRef, useState } from "react";
import { BottomLine, GeneralInputProps, LabelElem } from "./styles";
import classNames from "classnames";
import { assertIsNode } from "@/utils";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Control, Field, FieldError, useController } from "react-hook-form";
import { ErrorInputShower } from "@/components/common/registeration";
export interface OptionType {
    val: string | "";
    label: string;
}
export interface Props extends GeneralInputProps<string> {
    label?: string;
    control: Control<any>;
    options: OptionType[];
    name: string;
    err?: FieldError;
}
function LiElem({
    val,
    label,
    ...props
}: { val: string; label: string } & React.LiHTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={classNames(
                "hover:tw-bg-blue-200 tw-block tw-px-4 tw-py-3 tw-cursor-pointer tw-select-none hover:tw-text-blue-600",
                "aria-selected:tw-text-neutral-400"
            )}
            {...props}
        >
            {label}
        </div>
    );
}

const SelectInput = React.forwardRef<HTMLInputElement, Props>(
    (
        {
            options = [{ val: "", label: "Select Option" }],
            label,
            control,
            name,
            err,
            ...props
        },
        ref
    ) => {
        const [expand, setExpand] = useState(false);
        const containerDiv = useRef<HTMLDivElement>(null);
        const { field } = useController({ name, control });
        const inpVal = options.findIndex((val) => val.val == field.value);
        const val = (inpVal > -1 && inpVal) || 0;
        useEffect(() => {
            function handelClick(e: MouseEvent) {
                if (!containerDiv.current) return;
                assertIsNode(e.target);
                const state = containerDiv.current.contains(e.target);
                setFocus(state);
                if (!state) setExpand(false);
            }
            window.addEventListener("click", handelClick);
            return () => window.removeEventListener("click", handelClick);
        }, []);
        const [focus, setFocus] = useState(false);
        return (
            <LabelElem
                label={label}
                ref={containerDiv}
            >
                <div className="tw-relative">
                    <BottomLine focus={focus}>
                        <div
                            onClick={() => {
                                setExpand(!expand);
                                setFocus(true);
                            }}
                            className={classNames(
                                "tw-bg-neutral-100 tw-px-4 tw-py-3 tw-block tw-w-full tw-cursor-pointer tw-select-none",
                                "tw-flex tw-items-center tw-justify-between"
                            )}
                        >
                            <span>{options?.[val]?.label}</span>
                            <FontAwesomeIcon
                                icon={faChevronDown}
                                className={classNames(
                                    "tw-text-blue-600 tw-transition tw-duration-200",
                                    {
                                        "-rotate-180": expand,
                                    }
                                )}
                            />
                        </div>
                    </BottomLine>
                    <div
                        className={classNames(
                            "tw-absolute tw-z-10 tw-bg-neutral-100  tw-py-1 tw-top-[calc(100%+3px)] tw-w-full tw-left-0 tw-max-h-48 tw-overflow-y-auto",
                            { "tw-hidden": !expand || !focus }
                        )}
                        aria-expanded={expand}
                    >
                        {options.map(({ val: valLi, label }, i) => {
                            return (
                                <LiElem
                                    val={valLi}
                                    key={i}
                                    label={label}
                                    tabIndex={i}
                                    aria-selected={i == val}
                                    onClick={() => {
                                        field.onChange(options[i].val);
                                        setExpand(false);
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
                <ErrorInputShower err={err} />
                <input
                    {...props}
                    ref={field.ref}
                    name={name}
                    type="hidden"
                    autoComplete="off"
                    onFocusCapture={(ev) => {
                        if (props.onFocusCapture) props.onFocusCapture(ev);
                        setFocus(true);
                    }}
                    onBlurCapture={(ev) => {
                        if (props.onBlurCapture) props.onBlurCapture(ev);
                        setFocus(false);
                    }}
                />
            </LabelElem>
        );
    }
);
export default SelectInput;
