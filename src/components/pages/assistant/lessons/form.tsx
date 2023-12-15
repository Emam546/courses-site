import MainInput, { ErrorInputShower } from "@/components/common/inputs/main";
import { WrapElem } from "@/components/common/inputs/styles";
import { Grid2 } from "@/components/grid";
import DatePicker from "@/components/common/inputs/datePicker";
import { useForm } from "react-hook-form";
import { Timestamp } from "firebase/firestore";
import TextArea from "@/components/common/inputs/textArea";

export type DataType = {
    name: string;
    briefDesc: string;
    publishedAt: Timestamp;
};


export interface Props {
    defaultData: DataType;
}

export default function LessonGetDataForm({ defaultData }: Props) {
    const { register, handleSubmit, formState, getValues, watch, setValue } =
        useForm<DataType>({
            defaultValues: {
                publishedAt:
                    defaultData?.publishedAt || Timestamp.fromDate(new Date()),
                briefDesc: defaultData?.briefDesc,
                name: defaultData?.name,
            },
        });

    register("publishedAt", {
        required: "You must provide a date",
    });

    return (
        <>
            <div>
                <Grid2>
                    <MainInput
                        id={"name-input"}
                        title={"Lesson Name"}
                        {...register("name", {
                            required: true,
                            minLength: 8,
                        })}
                        err={formState.errors.name}
                        disabled
                    />
                    <WrapElem label="Publish Date">
                        <DatePicker
                            value={getValues("publishedAt").toDate()}
                            onChange={(val) => {
                                if (!val) return;
                                setValue(
                                    "publishedAt",
                                    Timestamp.fromDate(val)
                                );
                            }}
                            disabled
                        />
                        <ErrorInputShower
                            err={formState.errors.publishedAt as any}
                        />
                    </WrapElem>
                </Grid2>
                <div className="tw-my-3">
                    <TextArea
                        id={"brief-desc-input"}
                        title="Brief Description"
                        {...register("briefDesc")}
                        disabled
                        err={formState.errors.briefDesc}
                    />
                </div>
            </div>
        </>
    );
}
