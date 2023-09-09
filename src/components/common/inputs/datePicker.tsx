import {
    BaseSingleInputFieldProps,
    DatePickerProps,
    DateValidationError,
    FieldSection,
    DatePicker as OrgDatePicker,
    PickerShortcutChangeImportance,
    UseDateFieldProps,
    usePickerLayout,
} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Dayjs } from "dayjs";
import React, { ComponentType, useRef, useState } from "react";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TextFieldProps } from "@mui/material/TextField";
import { DateOrTimeViewWithMeridiem } from "@mui/x-date-pickers/internals/models";
import { formateDate } from "@/utils";
export type Props = {
    value: Date;
    onChange?: (val: Date) => any;
} & DatePickerProps<Date> &
    React.RefAttributes<HTMLDivElement>;
interface ButtonFieldProps
    extends UseDateFieldProps<Dayjs>,
        BaseSingleInputFieldProps<
            Dayjs | null,
            Dayjs,
            FieldSection,
            DateValidationError
        > {
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}
function CustomField(props: ButtonFieldProps) {
    return (
        <div
            ref={props.InputProps?.ref}
            className="form-control tw-py-0 tw-flex tw-items-center hover:tw-border-gray-900 focus-within:tw-border-gray-900"
        >
            <p className="tw-py-3 tw-text-gray-900 tw-m-0 tw-flex-1">
                {formateDate(props.value!.toDate(), "/")}
            </p>
            <button
                disabled={props.disabled}
                onClick={() => props.setOpen?.(true)}
                type="button"
                className="tw-border-none tw-text-gray-400 tw-text-xl"
            >
                <FontAwesomeIcon icon={faCalendarDays} />
            </button>
        </div>
    );
}
export default function DatePicker({ value, onChange }: Props) {
    const [open, setOpen] = useState(false);
    return (
        <OrgDatePicker
            value={dayjs(value)}
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            slots={{
                field: CustomField,
            }}
            slotProps={{
                field: { setOpen } as any,
            }}
            onChange={(v) => onChange && onChange((v as Dayjs).toDate())}
        />
    );
}
