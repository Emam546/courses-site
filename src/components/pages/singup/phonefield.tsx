/* eslint-disable react/display-name */
import PhoneInput, {
    DefaultInputComponentProps,
    FeatureProps as PhoneProps,
    Props as MainProps,
} from "react-phone-number-input";
import React from "react";
import { Control, FieldError, useController } from "react-hook-form";
import { LabelElem } from "@/components/common/registeration";
import classNames from "classnames";
import style from "./style.module.scss";
type Props = {
    err?: FieldError;
    id: string;
    labelText: string;
} & MainProps<PhoneProps<DefaultInputComponentProps>>;
const PhoneNumber = ({ id, err, labelText, className, ...props }: Props) => {
    return (
        <LabelElem
            id={id}
            labelText={labelText}
            err={err}
        >
            <div
                className="tw-bg-gray-50 tw-border tw-border-gray-300
            tw-text-gray-900 sm:tw-text-sm tw-rounded-lg
            focus-within:tw-ring-primary-600 focus-within:tw-border-primary-600 tw-block
            tw-w-full tw-p-2.5"
            >
                <PhoneInput
                    international
                    countryCallingCodeEditable={false}
                    className={classNames(
                        "tw-pl-2",
                        className,
                        style["phone-input"]
                    )}
                    {...props}
                />
            </div>
        </LabelElem>
    );
};

export default PhoneNumber;
