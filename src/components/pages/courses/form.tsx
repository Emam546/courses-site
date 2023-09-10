import PrimaryButton from "@/components/button";
import { MainCard } from "@/components/card";
import BudgetInput from "@/components/common/inputs/budget";
import CheckedInput from "@/components/common/inputs/checked";
import MainInput, { ErrorInputShower } from "@/components/common/inputs/main";
import TextArea from "@/components/common/inputs/textArea";
import { WrapElem } from "@/components/common/inputs/styles";
import { Grid2 } from "@/components/grid";
import { DataBase } from "@/data";
import DatePicker from "@/components/common/inputs/datePicker";
import { useForm } from "react-hook-form";
import React from "react";
import { Timestamp } from "firebase/firestore";
export type DataType = Omit<
    DataBase["Courses"],
    "levelId" | "order" | "createdAt"
>;
export interface Props {
    defaultData?: DataType;
    onData: (data: DataType) => Promise<any> | any;
    buttonName: React.ReactNode;
}
export default function CourseInfoForm({
    defaultData,
    onData,
    buttonName,
}: Props) {
    const { register, handleSubmit, formState, getValues, setValue } =
        useForm<DataType>({
            defaultValues: {
                publishedAt: Timestamp.fromDate(new Date()),
                ...defaultData,
            },
        });
    register("publishedAt", { required: true });
    return (
        <MainCard>
            <form
                action=""
                onSubmit={handleSubmit(async (data) => {
                    await onData(data);
                })}
            >
                <Grid2>
                    <MainInput
                        id={"name-input"}
                        title={"Course Name"}
                        required
                        {...register("name", { required: true })}
                    />
                    <BudgetInput
                        label={"Course Price"}
                        priceProps={{
                            ...register("price.num", {
                                required: true,
                                valueAsNumber: true,
                                min: 0,
                            }),
                            required: true,
                            placeholder: "eg.120",
                            type: "number",
                        }}
                        unitProps={{
                            ...register("price.currency", {
                                required: true,
                            }),
                            required: true,
                        }}
                        err={
                            formState.errors.price?.num ||
                            formState.errors.price?.currency
                        }
                    />
                    <WrapElem label="Publish Date">
                        <DatePicker
                            value={getValues("publishedAt").toDate()}
                            onChange={(val) => {
                                if (!val) return formState;
                                setValue(
                                    "publishedAt",
                                    Timestamp.fromDate(val)
                                );
                            }}
                        />
                        <ErrorInputShower
                            err={formState.errors.publishedAt?.root}
                        />
                    </WrapElem>
                </Grid2>
                <div className="tw-mt-3 tw-mb-2">
                    <CheckedInput
                        title={"Hide Course"}
                        {...register("hide")}
                        id={"Hide-input"}
                    />
                </div>
                <div className="tw-my-2">
                    <CheckedInput
                        title={"Featured Course"}
                        {...register("featured")}
                        id={"featured-input"}
                    />
                </div>

                <div className="tw-mb-3">
                    <TextArea
                        title="Description"
                        id="desc-input"
                        {...register("desc", {
                            required: true,
                        })}
                        err={formState.errors.desc}
                    />
                </div>
                <div className="tw-flex tw-justify-end">
                    <PrimaryButton
                        type="submit"
                        disabled={formState.isSubmitting}
                    >
                        {buttonName}
                    </PrimaryButton>
                </div>
            </form>
        </MainCard>
    );
}
