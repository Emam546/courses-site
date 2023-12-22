import PrimaryButton from "@/components/button";
import { Grid2 } from "@/components/grid";
import MainInput from "@/components/common/inputs/main";
import TextArea from "@/components/common/inputs/textArea";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import CheckedInput from "@/components/common/inputs/checked";
import { CardTitle } from "@/components/card";

export type DataType = {
    contactEmail?: string;
    contactPhone?: string;
    address?: string;
};
export interface Props {
    defaultData?: DefaultData;
    onData: (data: DataType) => Promise<any> | any;
    buttonName: React.ReactNode;
    isNotCreator?: boolean;
}
export type DefaultData = DataType;
export default function StudentTeacherInfoForm({
    defaultData,
    buttonName,
    onData,
    isNotCreator,
}: Props) {
    const { register, handleSubmit, formState } =
        useForm<DataType>({
            defaultValues: {
                ...defaultData,
            },
        });

    return (
        <form
            onSubmit={handleSubmit(onData)}
            autoComplete="off"
        >
            <Grid2>
                <MainInput
                    id={"contactEmail-input"}
                    title={"Contact Email"}
                    {...register("contactEmail", {
                        required: true,
                        min: 5,
                    })}
                    err={formState.errors.contactEmail}
                    disabled={isNotCreator}
                />
                <MainInput
                    id={"ContactPhone-input"}
                    title={"Contact Phone"}
                    {...register("contactPhone")}
                    disabled={isNotCreator}
                    err={formState.errors.contactPhone}
                />
                <MainInput
                    id={"address-input"}
                    title={"Address"}
                    {...register("address")}
                    disabled={isNotCreator}
                    err={formState.errors.address}
                />
            </Grid2>

            <div className="tw-mt-4 tw-flex tw-justify-end">
                <PrimaryButton
                    type="submit"
                    disabled={formState.isSubmitting || isNotCreator}
                >
                    {buttonName}
                </PrimaryButton>
            </div>
        </form>
    );
}
