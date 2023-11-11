import PrimaryButton from "@/components/button";
import { Grid2 } from "@/components/grid";
import MainInput from "@/components/common/inputs/main";
import { useForm } from "react-hook-form";
import DatePicker from "@/components/common/inputs/datePicker";
import { WrapElem } from "@/components/common/inputs/styles";
import SelectInput from "@/components/common/inputs/select";
import { useGetLevels } from "@/hooks/fireStore";
import CheckedInput from "@/components/common/inputs/checked";

export type DataType = {
    levelId: string;
    blocked: boolean;
};
export interface Props {
    defaultData: DataBase["Students"];
    onData: (data: DataType) => Promise<any> | any;
}
export default function LevelInfoForm({ defaultData, onData }: Props) {
    const { register, handleSubmit, formState, getValues } = useForm<
        DataBase["Students"]
    >({
        defaultValues: defaultData,
    });
    const { data: levels } = useGetLevels();
    return (
        <>
            <form
                onSubmit={handleSubmit((data) => {
                    onData({
                        levelId: data.levelId,
                        blocked: data.blocked,
                    });
                })}
                autoComplete="off"
            >
                <Grid2>
                    <MainInput
                        id={"name-input"}
                        title={"Name"}
                        {...register("displayname", { disabled: true })}
                        err={formState.errors.displayname}
                    />
                    <MainInput
                        id={"phone-input"}
                        title={"Phone"}
                        {...register("phone", { disabled: true })}
                        err={formState.errors.phone}
                    />
                    <MainInput
                        id={"email-input"}
                        title={"Email"}
                        {...register("email", { disabled: true })}
                        err={formState.errors.email}
                    />
                    <WrapElem label="Created At">
                        <DatePicker
                            disabled
                            value={getValues("createdAt").toDate()}
                        />
                    </WrapElem>
                    <SelectInput
                        id={"level-input"}
                        title={"Level"}
                        {...register("levelId", { required: "Select a level" })}
                        err={formState.errors.levelId}
                    >
                        {levels?.docs.map((doc) => {
                            return (
                                <option
                                    value={doc.id}
                                    key={doc.id}
                                >
                                    {doc.data().name}
                                </option>
                            );
                        })}
                    </SelectInput>
                    <CheckedInput
                        id={"block-input"}
                        title={"Block State"}
                        {...register("blocked")}
                    />
                </Grid2>
                <div className="tw-mt-4 tw-flex tw-justify-end">
                    <PrimaryButton
                        type="submit"
                        disabled={formState.isSubmitting}
                    >
                        Update
                    </PrimaryButton>
                </div>
            </form>
        </>
    );
}
