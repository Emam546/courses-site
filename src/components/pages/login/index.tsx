import { FieldError, useForm } from "react-hook-form";
import {
    ErrorInputShower,
    NormalInput,
} from "@/components/common/registeration";
import Link from "next/link";
import { isErrormessage } from "@/utils/firebase";
import classNames from "classnames";
import { changeTitle } from "@/hooks";
import { SingInStudentCall } from "@/firebase/func/auth";
import { useRouter } from "next/router";
import { ObjectEntries, hasOwnProperty } from "@/utils";
import { StateType } from "@/store/auth";
import { ErrorStates, isErrorMessage } from "@/utils/wrapRequest";
export interface Props {
    onLogin?: (user: NonNullable<StateType["user"]>) => any;
}
interface FormValues {
    email: string;
    userName: string;
    password: string;
    rememberMe: boolean;
}
const emailPattern =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function LogIn({ onLogin }: Props) {
    const { register, formState, handleSubmit, setError } =
        useForm<FormValues>();
    async function submit(data: FormValues) {
        try {
            // await setRememberMeState(auth, data.rememberMe);
            if (emailPattern.test(data.email)) {
                const res = await SingInStudentCall({
                    email: data.email,
                    password: data.password,
                    teacherId: process.env.NEXT_PUBLIC_TEACHER_ID as string,
                });
                onLogin?.(res.user);
            } else {
                const res = await SingInStudentCall({
                    userName: data.email,
                    password: data.password,
                    teacherId: process.env.NEXT_PUBLIC_TEACHER_ID as string,
                });
                onLogin?.(res.user);
            }
        } catch (err: unknown) {
            if (hasOwnProperty(err, "errors") && isErrormessage(err.errors)) {
                ObjectEntries(err.errors).forEach(([key, val]) => {
                    setError(key as keyof FormValues, {
                        message: val[0].message,
                    });
                });
                return;
            }
            if (isErrorMessage(err)) {
                switch (err.state) {
                    case ErrorStates.TEACHER_BLOCK:
                        await router.push("/states/blocked");
                        break;

                    default:
                        setError("root", {
                            message: err.message as string,
                        });
                }
            }
        }
    }
    const router = useRouter();
    changeTitle("Login");
    return (
        <section className=" tw-bg-gray-50">
            <div className="tw-min-h-screen tw-flex tw-flex-col tw-items-center tw-justify-center tw-px-6 tw-py-8 tw-mx-auto md:tw-h-screen lg:tw-py-0">
                <div className="tw-w-full tw-bg-white tw-rounded-lg tw-shadow  md:tw-mt-0 sm:tw-max-w-md xl:tw-p-0 ">
                    <div className="tw-p-6 tw-space-y-4 md:tw-space-y-6 sm:tw-p-8">
                        <h1 className="tw-text-xl tw-font-bold tw-leading-tight tw-tracking-tight tw-text-gray-900 md:tw-text-2xl ">
                            Sign in to your account
                        </h1>
                        <ErrorInputShower
                            className="tw-text-lg py-3"
                            err={formState.errors.root as FieldError}
                        />
                        <form
                            className="tw-space-y-4 md:tw-space-y-6"
                            action="#"
                            onSubmit={handleSubmit(submit)}
                        >
                            <NormalInput
                                labelText={"User Name or Email"}
                                type="text"
                                id="email"
                                err={
                                    formState.errors.email ||
                                    formState.errors.userName
                                }
                                {...register("email", {
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
                                            className="tw-text-gray-500 "
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
                                Login
                            </button>
                            <p className="tw-text-sm tw-font-light tw-text-gray-500 ">
                                Don’t have an account yet?{" "}
                                <Link
                                    href="/sign-up"
                                    className="tw-font-medium tw-text-primary-600 hover:tw-underline "
                                >
                                    Sign up
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
