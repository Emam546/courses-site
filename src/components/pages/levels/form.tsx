import PrimaryButton from "@/components/button";
import { Grid2 } from "@/components/grid";
import MainInput from "@/components/common/inputs/main";
import TextArea from "@/components/common/inputs/textArea";
import { useForm } from "react-hook-form";
import React from "react";
import CheckedInput from "@/components/common/inputs/checked";
export type DataType = {
    name: string;
    desc: string;
    hide: boolean;
};
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
        defaultValues: {
            desc: defaultData?.desc,
            hide: defaultData?.hide,
            name: defaultData?.name,
        },
    });
    return (
        <form
            onSubmit={handleSubmit(onData)}
            autoComplete="off"
        >
            <Grid2>
                <MainInput
                    id={"name-input"}
                    title={"Level Name"}
                    {...register("name", {
                        required: true,
                        min: 5,
                    })}
                    err={formState.errors.name}
                />
            </Grid2>
            <div className="tw-mt-4">
                <TextArea
                    id={"desc-input"}
                    title={"Level description"}
                    {...register("desc")}
                    className="tw-min-h-[10rem]"
                    err={formState.errors.desc}
                />
            </div>
            <div className="tw-mt-2">
                <CheckedInput
                    id={"hide-input"}
                    title={"Hide Level"}
                    {...register("hide")}
                    err={formState.errors.hide}
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
