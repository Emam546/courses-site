import PrimaryButton from "@/components/button";
import { CardTitle, MainCard } from "@/components/card";
import { Grid2 } from "@/components/grid";
import MainInput from "@/components/common/inputs/main";
import TextArea from "@/components/common/inputs/textArea";
import { useForm } from "react-hook-form";
import { DataBase } from "@/data";
import React from "react";
export type DataType = Omit<DataBase["Levels"], "order">;
export interface Props {
    defaultData?: DataType;
    onData: (data: DataType) => Promise<any> | any;
    buttonName: React.ReactNode;
}
export default function LevelInfoForm({
    defaultData,
    buttonName,
    onData,
}: Props) {
    const { register, handleSubmit, formState } = useForm<DataType>({
        defaultValues: defaultData,
    });
    return (
        <form
            action=""
            onSubmit={handleSubmit(onData)}
            autoComplete="false"
        >
            <Grid2>
                <MainInput
                    id={"name-input"}
                    title={"Level Name"}
                    {...register("name", {
                        required: true,
                        min: 5,
                    })}
                    autoComplete="false"
                    err={formState.errors.name}
                />
            </Grid2>
            <div className="tw-mt-4">
                <TextArea
                    id={"desc-input"}
                    title={"Course description"}
                    {...register("desc", {
                        required: true,
                    })}
                    className="tw-min-h-[10rem]"
                    err={formState.errors.desc}
                />
            </div>
            <div className="tw-mt-4 tw-flex tw-justify-end">
                <PrimaryButton
                    type="submit"
                    disabled={formState.isSubmitting}
                >
                    {buttonName}
                </PrimaryButton>
            </div>
        </form>
    );
}
