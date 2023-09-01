import PrimaryButton from "@/components/button";
import { CardTitle, MainCard } from "@/components/card";
import { Grid2 } from "@/components/grid";
import MainInput from "@/components/common/inputs/main";
import TextArea from "@/components/common/inputs/textArea";
import { useForm } from "react-hook-form";
import { DataBase } from "@/data";
export type DataType = Omit<DataBase["Levels"], "order">;
export interface Props {
    defaultData?: DataType;
    onData: (data: DataType) => Promise<any> | any;
}
export default function LevelInfoForm({ defaultData, onData }: Props) {
    const { register, handleSubmit, formState } = useForm<DataType>({
        defaultValues: defaultData,
    });
    return (
        <MainCard>
            <form
                action=""
                onSubmit={handleSubmit(onData)}
                autoComplete="false"
                aria-autocomplete="none"
            >
                <Grid2>
                    <MainInput
                        id={"name-input"}
                        title={"Level Name"}
                        {...register("name")}
                        autoComplete="false"
                    />
                </Grid2>
                <div className="tw-mt-4">
                    <TextArea
                        id={"name"}
                        title={"Course description"}
                        {...register("desc")}
                        className="tw-min-h-[10rem]"
                    />
                </div>
                <div className="tw-mt-4">
                    <PrimaryButton
                        type="submit"
                        disabled={formState.isSubmitting}
                    >
                        Add
                    </PrimaryButton>
                </div>
            </form>
        </MainCard>
    );
}
