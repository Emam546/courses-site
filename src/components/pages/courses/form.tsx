import PrimaryButton from "@/components/button";
import BudgetInput from "@/components/common/inputs/budget";
import CheckedInput from "@/components/common/inputs/checked";
import MainInput, { ErrorInputShower } from "@/components/common/inputs/main";
import TextArea from "@/components/common/inputs/textArea";
import { WrapElem } from "@/components/common/inputs/styles";
import { Grid2 } from "@/components/grid";

import DatePicker from "@/components/common/inputs/datePicker";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { Timestamp } from "firebase/firestore";
import { CardTitle } from "@/components/card";
import { SearchTeacherForm } from "../lessons/assistants/form";
import LessonsAssistantInfoGetter from "../lessons/assistants/info";
export type DataType = {
    name: string;
    desc: string;
    hide: boolean;
    featured: boolean;
    price: {
        num: number;
        currency: string;
    };
    publishedAt: Timestamp;
    paymentAdderIds: string[];
};
export interface Props {
    defaultData?: DataType;
    onData: (data: DataType) => Promise<any> | any;
    buttonName: React.ReactNode;
    isNotCreator?: boolean;
    assistants: DataBase.WithIdType<DataBase["Teacher"]>[];
    creatorId: string;
}
export default function CourseInfoForm({
    defaultData,
    onData,
    buttonName,
    assistants,
    isNotCreator,
    creatorId,
}: Props) {
    const { register, handleSubmit, formState, getValues, setValue, watch } =
        useForm<DataType>({
            defaultValues: {
                publishedAt:
                    defaultData?.publishedAt || Timestamp.fromDate(new Date()),
                price: defaultData?.price,
                desc: defaultData?.desc,
                featured: defaultData?.featured,
                hide: defaultData?.hide,
                name: defaultData?.name,
                paymentAdderIds: defaultData?.paymentAdderIds || [],
            },
        });
    register("publishedAt", {
        required: "You must Provide",
        disabled: isNotCreator,
    });
    const value = watch("price.num");
    const [assistantTeachers, setTeachers] = useState(assistants || []);
    return (
        <form
            autoComplete="off"
            onSubmit={handleSubmit(async (data) => {
                await onData(data);
            })}
        >
            <Grid2>
                <MainInput
                    id={"name-input"}
                    title={"Course Name"}
                    {...register("name", {
                        required: "You must fill the input",
                        disabled: isNotCreator,
                    })}
                    err={formState.errors.name}
                />
                <div>
                    <BudgetInput
                        label={"Course Price"}
                        priceProps={{
                            ...register("price.num", {
                                required:
                                    "Please set the course price or set it to 0",
                                valueAsNumber: true,
                                min: 0,
                            }),
                            placeholder: "eg.120",
                            type: "number",
                            disabled: isNotCreator,
                        }}
                        unitProps={{
                            ...register("price.currency", {
                                required: "Please select a currency",

                                disabled: isNotCreator,
                            }),
                        }}
                        err={
                            formState.errors.price?.num ||
                            formState.errors.price?.currency
                        }
                    />
                    {value == 0 && (
                        <p className="tw-text-sm tw-text-green-500 tw-absolute tw-mb-0">
                            The Course is Free Now any one can access it
                        </p>
                    )}
                </div>
                <WrapElem label="Publish Date">
                    <DatePicker
                        value={getValues("publishedAt").toDate()}
                        onChange={(val) => {
                            if (!val) return formState;
                            setValue("publishedAt", Timestamp.fromDate(val));
                        }}
                        disabled={isNotCreator}
                    />
                    <ErrorInputShower
                        err={formState.errors.publishedAt?.root}
                    />
                </WrapElem>
            </Grid2>
            <div className="tw-mt-3 tw-mb-2">
                <CheckedInput
                    title={"Hide Course"}
                    {...register("hide", {
                        disabled: isNotCreator,
                    })}
                    id={"Hide-input"}
                />
            </div>
            <div className="tw-my-2">
                <CheckedInput
                    title={"Featured Course"}
                    {...register("featured", {
                        disabled: isNotCreator,
                    })}
                    id={"featured-input"}
                />
            </div>

            <div className="tw-mb-3">
                <TextArea
                    title="Description"
                    id="desc-input"
                    {...register("desc", {
                        disabled: isNotCreator,
                    })}
                    err={formState.errors.desc}
                />
            </div>
            <CardTitle className="tw-mt-3">Payer Assistants</CardTitle>
            <div className="tw-space-y-3">
                <SearchTeacherForm
                    onAdd={(teacher) => {
                        if (teacher.id == creatorId)
                            return alert(
                                "You can't add the creator of this document"
                            );

                        if (getValues("paymentAdderIds").includes(teacher.id))
                            return alert("The user has already been added");
                        setValue("paymentAdderIds", [
                            ...getValues("paymentAdderIds"),
                            teacher.id,
                        ]);
                        setTeachers((pre) => [...pre, teacher]);
                    }}
                />
                <LessonsAssistantInfoGetter
                    isNotCreator={isNotCreator}
                    onRemove={async (removedUser) => {
                        setValue(
                            "paymentAdderIds",
                            getValues("paymentAdderIds").filter(
                                (id) => removedUser.id != id
                            )
                        );
                        setTeachers((pre) =>
                            pre.filter(({ id }) => removedUser.id != id)
                        );
                    }}
                    teachers={assistantTeachers}
                />
            </div>
            <div className="tw-flex tw-justify-end">
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
