/* eslint-disable react/display-name */
import PhoneInput, {
    DefaultInputComponentProps,
    FeatureProps as PhoneProps,
    Props as MainProps,
} from "react-phone-number-input";
import { FieldError } from "react-hook-form";
import { LabelElem } from "../styles";
import classNames from "classnames";
import style from "./style.module.scss";
import { ErrorInputShower } from "@/components/common/registeration";
type Props = {
    err?: FieldError;
    id: string;
    labelText: string;
} & MainProps<PhoneProps<DefaultInputComponentProps>>;
const PhoneNumber = ({ id, err, labelText, className, ...props }: Props) => {
    return (
        <LabelElem
            id={id}
            label={labelText}
        >
            <div className="focus:tw-outline-none tw-bg-neutral-100 tw-px-4 tw-py-3 tw-block tw-w-full disabled:tw-bg-neutral-300">
                <PhoneInput
                    international
                    countryCallingCodeEditable={false}
                    className={classNames(className, style["phone-input"])}
                    {...props}
                />
            </div>
            <ErrorInputShower err={err} />
        </LabelElem>
    );
};

export default PhoneNumber;
