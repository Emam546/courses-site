import {
    DatePickerProps,
    DatePicker as OrgDatePicker,
} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Dayjs } from "dayjs";
import React from "react";
export type Props = {
    value: Date;
    onChange?: (val: Date) => any;
} & DatePickerProps<Date> &
    React.RefAttributes<HTMLDivElement>;
export default function DatePicker({ value, onChange }: Props) {
    return (
        <OrgDatePicker
            value={dayjs(value)}
            onChange={(v) => onChange && onChange((v as Dayjs).toDate())}
        />
    );
}
