import {
    StyledInput,
    InputProps,
    SelectedInputProps,
    StyledSelect,
    WrapElem,
} from "@/components/common/inputs/styles";
import currencies from "./options.json";
import { ErrorInputShower } from "../main";
import { FieldError } from "react-hook-form";

export type Props = {
    label: string;
    priceProps?: InputProps;
    unitProps?: SelectedInputProps;
    err?: FieldError;
};

export default function BudgetInput({
    label,
    priceProps,
    unitProps: unit,
    err,
}: Props) {
    return (
        <WrapElem label={label}>
            <div className="tw-flex tw-justify-stretch">
                <div>
                    <StyledInput {...(priceProps as any)} />
                </div>
                <div>
                    <StyledSelect
                        {...({ defaultValue: "EGP", ...unit } as any)}
                    >
                        {currencies.map(({ code, name }) => {
                            return (
                                <option
                                    key={name}
                                    value={code}
                                >
                                    {name}
                                </option>
                            );
                        })}
                    </StyledSelect>
                </div>
            </div>
            <ErrorInputShower err={err} />
        </WrapElem>
    );
}
