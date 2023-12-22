import PrimaryButton from "@/components/button";
import { Grid2 } from "@/components/grid";
import MainInput from "@/components/common/inputs/main";
import { useForm } from "react-hook-form";
import { getDocs, limit, query, where } from "firebase/firestore";
import { createCollection } from "@/firebase";
import { pattern } from "@func/server/utils/validateUserName";

export function validateUsername(value: string) {
    // Check if the username matches the pattern
    if (pattern.test(value)) {
        return undefined;
    } else {
        return "Invalid username. Username should contain only letters, numbers, dashes, and underscores and be 3-16 characters long.";
    }
}
const emailPattern =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export function validEmail(value: string) {
    // Check if the username matches the pattern
    if (emailPattern.test(value)) {
        return undefined;
    } else {
        return "Invalid email";
    }
}

export interface FormData {
    userName: string;
    displayname: string;
    phone: string;
    email?: string;
}
export interface Props {
    defaultData?: FormData;
    buttonName?: string;
    onData: (data: FormData) => Promise<any> | any;
    teacherId: string;
}

export default function UserAddingInfoForm({
    defaultData,
    onData,
    buttonName = "submit",
    teacherId,
}: Props) {
    const { register, handleSubmit, formState, reset } = useForm<FormData>({
        defaultValues: defaultData,
    });
    return (
        <>
            <form
                onSubmit={handleSubmit(async (data) => {
                    await onData(data);
                    reset();
                })}
                autoComplete="off"
            >
                <Grid2>
                    <MainInput
                        id={"name-input"}
                        title={"UserName"}
                        {...register("userName", {
                            async validate(value) {
                                const validate = validateUsername(value);
                                if (validate) return validate;
                                const res = await getDocs(
                                    query(
                                        createCollection("Students"),
                                        where("userName", "==", value),
                                        where("teacherId", "==", teacherId),
                                        limit(1)
                                    )
                                );
                                if (res.empty) return true;
                                return "The username is already exist";
                            },
                            required: true,
                        })}
                        err={formState.errors.userName}
                    />
                    <MainInput
                        id={"name-input"}
                        title={"Name"}
                        {...register("displayname", { required: true })}
                        err={formState.errors.displayname}
                    />
                    <MainInput
                        id={"phone-input"}
                        title={"Phone"}
                        {...register("phone")}
                        err={formState.errors.phone}
                    />
                    <MainInput
                        id={"email-input"}
                        title={"Email"}
                        type="email"
                        {...register("email", {
                            async validate(value) {
                                if (!value) return true;
                                const validate = validEmail(value);
                                if (validate) return validate;
                                const res = await getDocs(
                                    query(
                                        createCollection("Students"),
                                        where("email", "==", value),
                                        where("teacherId", "==", teacherId),
                                        limit(1)
                                    )
                                );
                                if (res.empty) return true;
                                return "The email is already used";
                            },
                        })}
                        err={formState.errors.email}
                    />
                </Grid2>
                <div className="tw-mt-4 tw-flex tw-justify-end">
                    <PrimaryButton
                        type="submit"
                        disabled={formState.isSubmitting}
                    >
                        {buttonName}
                    </PrimaryButton>
                </div>
            </form>
        </>
    );
}
