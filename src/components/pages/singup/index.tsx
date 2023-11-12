import { FieldError, useForm } from "react-hook-form";
import {
    ErrorInputShower,
    NormalInput,
    SelectInput,
} from "@/components/common/registeration";

import { useGetLevels } from "@/hooks/firebase";
import { createStudentCall } from "@/firebase/func";
import {
    getErrorMessage,
    isErrormessage,
    isFireBaseError,
    setRememberMeState,
} from "@/utils/firebase";
import { ObjectEntries, hasOwnProperty } from "@/utils";
import classNames from "classnames";
import { StateType } from "@/store/auth";
import { UserCredential, signInWithCustomToken } from "firebase/auth";
import { auth } from "@/firebase";
import PhoneNumber from "./phonefield";
import Link from "next/link";
import { isValidPhoneNumber } from "react-phone-number-input";

export interface Props {
    onUser?: (
        user: Omit<
            NonNullable<StateType["user"]>,
            "id" | "blocked" | "emailVerified"
        >
    ) => any;
}
export interface Form {
    phone: string;
    password: string;
    confirmPassword: string;
    name: string;
    levelId: string;
    email: string;
    rememberMe: boolean;
}
export default function SingUp({ onUser }: Props) {
    const { register, formState, handleSubmit, setError, setValue, watch } =
        useForm<Form>();
    const { data: levels } = useGetLevels();
    register("phone", {
        required: "phone number is required",
        validate: (val) => {
            if (!isValidPhoneNumber(val))
                return "the phone number is not valid";
        },
    });
    return (
        <section className=" tw-bg-gray-50">
            <div className="tw-min-h-screen tw-flex tw-flex-col tw-items-center tw-justify-center tw-px-6 tw-py-8 tw-mx-auto">
                <div className="tw-w-full tw-bg-white tw-rounded-lg tw-shadow md:tw-mt-0 sm:tw-max-w-md xl:tw-p-0 ">
                    <div className="tw-p-6 tw-space-y-4 md:tw-space-y-6 sm:tw-p-8">
                        <h1 className="tw-text-xl tw-font-bold tw-leading-tight tw-tracking-tight tw-text-gray-900 md:tw-text-2xl">
                            Sign up
                        </h1>
                        <ErrorInputShower
                            className="tw-text-lg py-3"
                            err={formState.errors.root as FieldError}
                        />
                        <form
                            className="tw-space-y-4 md:tw-space-y-6"
                            action="#"
                            onSubmit={handleSubmit(async (data) => {
                                try {
                                    await setRememberMeState(
                                        auth,
                                        data.rememberMe
                                    );
                                    await createStudentCall({
                                        displayName: data.name,
                                        email: data.email,
                                        levelId: data.levelId,
                                        password: data.password,
                                        phone: data.phone,
                                        teacherId: process.env
                                            .NEXT_PUBLIC_TEACHER_ID as string,
                                    });
                                    await onUser?.({
                                        displayname: data.name,
                                        email: data.email,
                                        levelId: data.levelId,
                                        phone: data.phone,
                                        teacherId: process.env
                                            .NEXT_PUBLIC_TEACHER_ID as string,
                                    });
                                } catch (err) {
                                    if (
                                        hasOwnProperty(err, "errors") &&
                                        isErrormessage(err.errors)
                                    ) {
                                        ObjectEntries(err.errors).forEach(
                                            ([key, val]) => {
                                                setError(key as keyof Form, {
                                                    message: val[0].message,
                                                });
                                            }
                                        );
                                        return;
                                    }
                                    if (!isFireBaseError(err)) return;
                                    const message = getErrorMessage(err.code);
                                    if (!message)
                                        return setError("root", {
                                            message: err.message as string,
                                        });
                                    setError(message.type as keyof Form, {
                                        message: message.message,
                                    });
                                }
                            })}
                        >
                            <SelectInput
                                labelText={"Your Level"}
                                id="levelid"
                                err={formState.errors.levelId}
                                {...register("levelId", {
                                    required: true,
                                })}
                            >
                                <option value="">Choose Level</option>
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

                            <PhoneNumber
                                labelText={"Your phone number"}
                                err={formState.errors.phone}
                                id="tel"
                                placeholder="Enter your phone number"
                                countryCallingCodeEditable={false}
                                international
                                defaultCountry="EG"
                                onChange={(val) => {
                                    if (val) setValue("phone", val);
                                }}
                            />
                            <NormalInput
                                labelText={"Your Email"}
                                id="email"
                                type="email"
                                err={formState.errors.email}
                                placeholder="example@gmail.com"
                                {...register("email", {
                                    required: true,
                                })}
                            />
                            <NormalInput
                                labelText={"Your Name"}
                                type="text"
                                id="userName"
                                err={formState.errors.name}
                                {...register("name", {
                                    required: true,
                                })}
                            />
                            <NormalInput
                                labelText="Password"
                                type="password"
                                id="password"
                                err={formState.errors.password}
                                {...register("password", {
                                    required: true,
                                    min: 8,
                                })}
                            />
                            <NormalInput
                                labelText="Confirm password"
                                type="password"
                                id="confirmPassword"
                                err={formState.errors.confirmPassword}
                                {...register("confirmPassword", {
                                    required: true,
                                    min: 8,
                                    validate(val, f) {
                                        if (f.password != val)
                                            return "Please recheck your password";
                                        return true;
                                    },
                                })}
                            />
                            <div className="tw-flex tw-items-center tw-justify-between">
                                <div className="tw-flex tw-items-start">
                                    <div className="tw-flex tw-items-center tw-h-5">
                                        <input
                                            id="remember"
                                            aria-describedby="remember"
                                            type="checkbox"
                                            className="tw-w-4 tw-h-4 tw-border tw-border-gray-300 tw-rounded tw-bg-gray-50 focus:tw-ring-3 focus:tw-ring-primary-300"
                                            {...register("rememberMe")}
                                            defaultChecked={true}
                                        />
                                    </div>
                                    <div className="tw-ml-3 tw-text-sm">
                                        <label
                                            htmlFor="remember"
                                            className="tw-text-gray-500"
                                        >
                                            Remember me
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={
                                    formState.isSubmitting ||
                                    formState.isValidating
                                }
                                className={classNames(
                                    "tw-w-full tw-text-white tw-bg-primary-600 hover:tw-bg-primary-700 focus:tw-ring-4 focus:tw-outline-none focus:tw-ring-primary-300 tw-font-medium tw-rounded-lg tw-text-sm tw-px-5 tw-py-2.5 tw-text-center ",
                                    "disabled:tw-bg-primary-400 hover:tw-bg-primary-400"
                                )}
                            >
                                Sign up
                            </button>
                            <p className="tw-text-sm tw-font-light tw-text-gray-500 ">
                                Do you have an account?{" "}
                                <Link
                                    href="/sing-up"
                                    className="tw-font-medium tw-text-primary-600 hover:tw-underline"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
