import PrimaryButton from "@/components/button";
import { Grid2 } from "@/components/grid";
import MainInput from "@/components/common/inputs/main";
import TextArea from "@/components/common/inputs/textArea";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import CheckedInput from "@/components/common/inputs/checked";
import { CardTitle } from "@/components/card";
import { SearchTeacherForm } from "../lessons/assistants/form";
import LessonsAssistantInfoGetter from "../lessons/assistants/info";
export type DataType = {
    name: string;
    desc: string;
    hide: boolean;
    usersAdderIds: string[];
};
export interface Props {
    defaultData?: DefaultData;
    onData: (data: DataType) => Promise<any> | any;
    buttonName: React.ReactNode;
    isNotCreator?: boolean;
    creatorId: string;
}
export type DefaultData = DataType & {
    assistantTeachers: DataBase.WithIdType<DataBase["Teacher"]>[];
};
export default function LevelInfoForm({
    defaultData,
    buttonName,
    onData,
    isNotCreator,
    creatorId,
}: Props) {
    const { register, handleSubmit, getValues, setValue, formState } =
        useForm<DataType>({
            defaultValues: {
                desc: defaultData?.desc,
                hide: defaultData?.hide,
                name: defaultData?.name,
                usersAdderIds: defaultData?.usersAdderIds || [],
            },
        });
    const [assistantTeachers, setTeachers] = useState(
        defaultData?.assistantTeachers || []
    );
    register("usersAdderIds");
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
                    disabled={isNotCreator}
                />
            </Grid2>
            <div className="tw-mt-4">
                <TextArea
                    id={"desc-input"}
                    title={"Level description"}
                    {...register("desc")}
                    className="tw-min-h-[10rem]"
                    disabled={isNotCreator}
                    err={formState.errors.desc}
                />
            </div>
            <div className="tw-mt-2">
                <CheckedInput
                    id={"hide-input"}
                    title={"Hide Level"}
                    {...register("hide")}
                    disabled={isNotCreator}
                    err={formState.errors.hide}
                />
            </div>
            <CardTitle className="tw-mt-3">Assistants</CardTitle>
            <div className="tw-space-y-3">
                {!isNotCreator && (
                    <SearchTeacherForm
                        onAdd={(teacher) => {
                            if (teacher.id == creatorId)
                                return alert(
                                    "You can't add the creator of this document"
                                );

                            if (getValues("usersAdderIds").includes(teacher.id))
                                return alert("The user has already been added");
                            setValue("usersAdderIds", [
                                ...getValues("usersAdderIds"),
                                teacher.id,
                            ]);
                            setTeachers((pre) => [...pre, teacher]);
                        }}
                    />
                )}

                <LessonsAssistantInfoGetter
                    isNotCreator={isNotCreator}
                    onRemove={async (removedUser) => {
                        setValue(
                            "usersAdderIds",
                            getValues("usersAdderIds").filter(
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
