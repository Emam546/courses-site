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

export interface Props {
    onUser?: (
        user: NonNullable<StateType["user"]>,
        credential: UserCredential
    ) => any;
}
export interface Form {
    phone: string;
    password: string;
    confirmPassword: string;
    name: string;
    userName: string;
    levelId: string;
    email: string;
    rememberMe: boolean;
}
const egyptianPhoneNumberPattern = /^\+2(010|011|012|015)[0-9]{8}$/;
const UserNamePattern = /^[a-zA-Z_]{6,19}$/;
export async function validateUserName(val: string) {
    const state = UserNamePattern.test(val);
    if (!state)
        return "Invalid userName format. Use lowercase letters and underscores (_), 6-19 characters.";

    return true;
}
export default function SingUp({ onUser }: Props) {
    const { register, formState, handleSubmit, setError, setValue, watch } =
        useForm<Form>();
    const { data: levels } = useGetLevels();
    register("phone", { required: "phone number is required" });
    return (
        <section className="dark:tw-bg-gray-900 tw-bg-gray-50">
            <div className="tw-min-h-screen tw-flex tw-flex-col tw-items-center tw-justify-center tw-px-6 tw-py-8 tw-mx-auto">
                <div className="tw-w-full tw-bg-white tw-rounded-lg tw-shadow dark:tw-border md:tw-mt-0 sm:tw-max-w-md xl:tw-p-0 dark:tw-bg-gray-800 dark:tw-border-gray-700">
                    <div className="tw-p-6 tw-space-y-4 md:tw-space-y-6 sm:tw-p-8">
                        <h1 className="tw-text-xl tw-font-bold tw-leading-tight tw-tracking-tight tw-text-gray-900 md:tw-text-2xl dark:tw-text-white">
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
                                    const res = await createStudentCall({
                                        displayName: data.userName,
                                        email: data.email,
                                        levelId: data.levelId,
                                        password: data.password,
                                        phone: data.phone,
                                        teacherId: process.env
                                            .NEXT_PUBLIC_TEACHER_ID as string,
                                    });
                                    const user = await signInWithCustomToken(
                                        auth,
                                        res.firebaseToken
                                    );
                                    await onUser?.(res.user, user);
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
                                err={formState.errors.userName}
                                {...register("userName", {
                                    required: true,
                                    validate: validateUserName,
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
                                            className="tw-w-4 tw-h-4 tw-border tw-border-gray-300 tw-rounded tw-bg-gray-50 focus:tw-ring-3 focus:tw-ring-primary-300 dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:focus:tw-ring-primary-600 dark:tw-ring-offset-gray-800"
                                            {...register("rememberMe")}
                                            defaultChecked={true}
                                        />
                                    </div>
                                    <div className="tw-ml-3 tw-text-sm">
                                        <label
                                            htmlFor="remember"
                                            className="tw-text-gray-500 dark:tw-text-gray-300"
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
                                    "tw-w-full tw-text-white tw-bg-primary-600 hover:tw-bg-primary-700 focus:tw-ring-4 focus:tw-outline-none focus:tw-ring-primary-300 tw-font-medium tw-rounded-lg tw-text-sm tw-px-5 tw-py-2.5 tw-text-center dark:tw-bg-primary-600 dark:hover:tw-bg-primary-700 dark:focus:tw-ring-primary-800",
                                    "disabled:tw-bg-primary-400 hover:tw-bg-primary-400"
                                )}
                            >
                                Sign up
                            </button>
                            <p className="tw-text-sm tw-font-light tw-text-gray-500 dark:tw-text-gray-400">
                                Do you have an account?{" "}
                                <a
                                    href="/sing-up"
                                    className="tw-font-medium tw-text-primary-600 hover:tw-underline dark:tw-text-primary-500"
                                >
                                    Sign in
                                </a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
