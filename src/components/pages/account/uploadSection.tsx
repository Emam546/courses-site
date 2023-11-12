import { CircularProgress } from "@mui/material";
import Section from "./section";
import Grid2Container from "./common/2GridInputHolder";
import NormalInput from "./common/inputs/normal";
import { useForm } from "react-hook-form";
import SelectInput from "./common/inputs/selectOption";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGetLevels } from "@/hooks/firebase";
import { isValidPhoneNumber } from "react-phone-number-input";

import { StateType } from "@/store/auth";
import PhoneNumber from "../singup/phonefield";
export type DateType = {
    levelId: string;
    displayname: string;
    phone: string;
};
type FormValues = NonNullable<StateType["user"]>;
export interface Props {
    values: FormValues;
    onData: (data: DateType) => any;
}
export default function UploadAction({ values, onData }: Props) {
    const { register, handleSubmit, formState, setValue, getValues, control } =
        useForm<FormValues>({
            values,
        });
    const { data: levels } = useGetLevels();
    register("phone", {
        required: "phone number is required",
        validate: (val) => {
            if (!isValidPhoneNumber(val))
                return "the phone number is not valid";
        },
    });
    return (
        <Section label={"Account"}>
            <form
                onSubmit={handleSubmit(async (data) => {
                    await onData({
                        levelId: data.levelId,
                        displayname: data.displayname,
                        phone: data.phone,
                    });
                })}
                action=""
                method="post"
            >
                <Grid2Container className="md:tw-gap-x-10 md:tw-gap-y-6">
                    <NormalInput
                        err={formState.errors.displayname}
                        label="User Name"
                        type="text"
                        {...register("displayname", {
                            required: true,
                        })}
                    />
                    <NormalInput
                        err={formState.errors.displayname}
                        label="Email"
                        type="email"
                        {...register("email", {
                            required: true,
                            disabled: true,
                        })}
                    />
                    <PhoneNumber
                        labelText={"Your phone number"}
                        err={formState.errors.phone}
                        id="tel"
                        placeholder="Enter your phone number"
                        countryCallingCodeEditable={false}
                        international
                        value={getValues("phone")}
                        defaultCountry="EG"
                        onChange={(val) => {
                            if (val) setValue("phone", val);
                        }}
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
                        {...register("levelId", { required: true })}
                    />
                </Grid2Container>

                <button
                    className="tw-text-blue-500 hover:tw-text-blue-800 tw-font-medium tw-text-lg tw-mt-6 tw-p-2 tw-block tw-w-fit md:tw-ml-auto tw-cursor-pointer"
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
