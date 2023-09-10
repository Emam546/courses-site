/* eslint-disable react/display-name */
import React, { InputHTMLAttributes, useRef } from "react";
import { BottomLine, StyledInput } from "./styles";
import { LabelElem } from "./styles";
import { Control, FieldError, useController } from "react-hook-form";
import { ErrorInputShower } from "@/components/common/registeration";
export interface PropsWithOutOptions
    extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    err?: FieldError;
}

const NormalInput = React.forwardRef<HTMLInputElement, PropsWithOutOptions>(
    ({ label, err, ...props }, ref) => {
        const containerRef = useRef<HTMLDivElement>(null);
        return (
            <LabelElem
                ref={containerRef}
                label={label}
            >
                <div className="relative tw-mb-1">
                    <BottomLine>
                        <StyledInput
                            {...props}
                            autoComplete="off"
                            ref={ref}
                        />
                    </BottomLine>
                </div>
                <ErrorInputShower err={err} />
            </LabelElem>
        );
    }
);

export default NormalInput;
