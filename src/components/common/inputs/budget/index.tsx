import {
    StyledInput,
    StyledSelect,
    WrapElem,
} from "@/components/common/inputs/styles";
import currencies from "./options.json";

type Props = {
    label: string;
    priceProps?: React.InputHTMLAttributes<HTMLInputElement>;
    unitProps?: React.SelectHTMLAttributes<HTMLSelectElement>;
};

export default function BudgetInput({
    label,
    priceProps,
    unitProps: unit,
}: Props) {
    return (
        <WrapElem label={label}>
            <div className="tw-flex tw-justify-stretch">
                <div>
                    <StyledInput {...priceProps} />
                </div>
                <div>
                    <StyledSelect {...unit}>
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
        </WrapElem>
    );
}
