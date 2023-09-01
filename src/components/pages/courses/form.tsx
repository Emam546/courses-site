import PrimaryButton from "@/components/button";
import { CardTitle, MainCard } from "@/components/card";
import ErrorShower from "@/components/common/error";
import BudgetInput from "@/components/common/inputs/budget";
import CheckedInput from "@/components/common/inputs/checked";
import MainInput from "@/components/common/inputs/main";
import TextArea from "@/components/common/inputs/textArea";
import { WrapElem } from "@/components/common/inputs/styles";
import { Grid2 } from "@/components/grid";
import { DataBase } from "@/data";
import { createCollection, getDocRef } from "@/firebase";
import DatePicker from "@/components/common/inputs/datePicker";
import { addDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
export type DataType = Omit<
    DataBase["Courses"],
    "levelId" | "order" | "createdAt"
>;
export interface Props {
    defaultData?: DataType;
    onData: (data: DataType) => Promise<any> | any;
}
export default function CourseInfoForm({ defaultData, onData }: Props) {
    const { register, handleSubmit, formState, getValues, setValue } =
        useForm<DataType>({
            defaultValues: {
                publishedAt: new Date(),
                ...defaultData,
            },
        });

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
                    />
                    <WrapElem label="Publish Date">
                        <DatePicker
                            value={getValues("publishedAt")}
                            onChange={(val) => {
                                setValue("publishedAt", val as Date);
                            }}
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
                <div className="tw-mb-3">
                    <TextArea
                        title="Description"
                        id="desc-input"
                        {...register("desc")}
                    />
                </div>
                <PrimaryButton
                    type="submit"
                    disabled={formState.isSubmitting}
                >
                    Add
                </PrimaryButton>
            </form>
        </MainCard>
    );
}
