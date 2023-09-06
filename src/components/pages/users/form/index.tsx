import PrimaryButton from "@/components/button";
import { MainCard } from "@/components/card";
import { Grid2 } from "@/components/grid";
import MainInput from "@/components/common/inputs/main";
import { useForm } from "react-hook-form";
import { DataBase } from "@/data";
import DatePicker from "@/components/common/inputs/datePicker";
import { WrapElem } from "@/components/common/inputs/styles";
import SelectInput from "@/components/common/inputs/select";
import { useGetLevels } from "@/utils/hooks/fireStore";
import CheckedInput from "@/components/common/inputs/checked";
export type DataType = Omit<DataBase["Users"], "password">;
export interface Props {
    defaultData: Omit<DataBase["Users"], "password">;
    onData: (data: { levelId: string; blocked: boolean }) => Promise<any> | any;
}
export default function LevelInfoForm({ defaultData, onData }: Props) {
    const { register, handleSubmit, formState, getValues } = useForm<DataType>({
        defaultValues: defaultData,
    });
    const { data: levels } = useGetLevels();
    return (
        <MainCard>
            <form
                action=""
                onSubmit={handleSubmit((data) => {
                    onData({
                        blocked: data.blocked,
                        levelId: data.levelId,
                    });
                })}
                autoComplete="false"
                aria-autocomplete="none"
            >
                <Grid2>
                    <MainInput
                        id={"name-input"}
                        title={"Name"}
                        {...register("name", { disabled: true })}
                        autoComplete="false"
                    />
                    <MainInput
                        id={"username-input"}
                        title={"User Name"}
                        {...register("userName", { disabled: true })}
                        autoComplete="false"
                    />
                    <MainInput
                        id={"phone-input"}
                        title={"Phone"}
                        {...register("phone", { disabled: true })}
                        autoComplete="false"
                    />
                    <MainInput
                        id={"email-input"}
                        title={"Email"}
                        {...register("email", { disabled: true })}
                        autoComplete="false"
                    />
                    <WrapElem label="Created At">
                        <DatePicker
                            disabled
                            value={getValues("createdAt")}
                        />
                    </WrapElem>
                    <SelectInput
                        id={"level-input"}
                        title={"Level"}
                        {...register("levelId")}
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
        </MainCard>
    );
}
