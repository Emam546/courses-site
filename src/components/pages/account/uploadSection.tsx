import { CircularProgress } from "@mui/material";
import Section from "./section";
import Grid2Container from "./common/2GridInputHolder";
import NormalInput from "./common/inputs/normal";
import { useForm } from "react-hook-form";
import SelectInput from "./common/inputs/selectOption";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGetLevels } from "@/hooks/firebase";
import { DataBase } from "@/data";
import { validatePhone, validateUserName } from "../singup";
export type DateType = Omit<
    DataBase["Users"],
    "createdAt" | "blocked" | "userName" | "password"
>;
export interface Props {
    values: DataBase["Users"];
    onData: (data: DateType) => any;
}
export default function UploadAction({ values, onData }: Props) {
    const { register, handleSubmit, formState, clearErrors, control } = useForm<
        DataBase["Users"]
    >({
        values,
    });
    const { data: levels } = useGetLevels();
    return (
        <Section label={"Account"}>
            <form
                onSubmit={handleSubmit(async (data) => {
                    await onData({
                        levelId: data.levelId,
                        name: data.name,
                        phone: data.phone,
                    });
                })}
                action=""
                method="post"
            >
                <Grid2Container className="md:tw-gap-x-10 md:tw-gap-y-6">
                    <NormalInput
                        err={formState.errors.name}
                        label="Name"
                        required
                        {...register("name", { required: true })}
                    />
                    <NormalInput
                        err={formState.errors.userName}
                        label="User Name"
                        type="text"
                        required
                        disabled
                        {...register("userName", {
                            required: true,
                            validate: validateUserName,
                            disabled: true,
                        })}
                    />
                    <NormalInput
                        err={formState.errors.phone}
                        label="Phone"
                        type="tel"
                        required
                        {...register("phone", {
                            required: true,
                            validate: validatePhone,
                        })}
                    />
                    <SelectInput
                        err={formState.errors.levelId}
                        control={control}
                        options={
                            levels?.docs.map((doc) => ({
                                label: doc.data().name,
                                val: doc.id,
                            })) || []
                        }
                        label="Level"
                        required
                        {...register("levelId", { required: true })}
                    />
                </Grid2Container>

                <button
                    className="tw-text-blue-500 hover:tw-text-blue-800 tw-font-medium tw-text-lg tw-mt-6 tw-p-2 tw-block tw-w-fit md:tw-ml-auto"
                    type="submit"
                    disabled={formState.isSubmitSuccessful}
                >
                    {formState.isSubmitting && (
                        <CircularProgress className="tw-max-w-[1.2rem] tw-max-h-[1.2rem]" />
                    )}
                    {formState.isSubmitSuccessful &&
                        !formState.isSubmitting && (
                            <FontAwesomeIcon icon={faCircleCheck} />
                        )}

                    <span className="tw-px-2">
                        {formState.isSubmitting ? "Saving" : "Save"}
                    </span>
                </button>
            </form>
        </Section>
    );
}
