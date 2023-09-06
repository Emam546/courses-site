import { DataBase } from "@/data";
import { createCollection } from "@/firebase";
import {
    QueryDocumentSnapshot,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import { useForm } from "react-hook-form";
import { ErrorShower, NormalInput } from "../common/registeration";
import Link from "next/link";

export interface Props {
    onUser: (user: QueryDocumentSnapshot<DataBase["Users"]>) => any;
}
export interface Form {
    userName: string;
    password: string;
    remeberMe: boolean;
}

export default function LogIn({ onUser }: Props) {
    const { register, formState, handleSubmit, setError } = useForm<Form>();
    return (
        <section className="dark:tw-bg-gray-900 tw-bg-gray-50">
            <div className="tw-min-h-screen tw-flex tw-flex-col tw-items-center tw-justify-center tw-px-6 tw-py-8 tw-mx-auto md:tw-h-screen lg:tw-py-0">
                <div className="tw-w-full tw-bg-white tw-rounded-lg tw-shadow dark:tw-border md:tw-mt-0 sm:tw-max-w-md xl:tw-p-0 dark:tw-bg-gray-800 dark:tw-border-gray-700">
                    <div className="tw-p-6 tw-space-y-4 md:tw-space-y-6 sm:tw-p-8">
                        <h1 className="tw-text-xl tw-font-bold tw-leading-tight tw-tracking-tight tw-text-gray-900 md:tw-text-2xl dark:tw-text-white">
                            Sign in to your account
                        </h1>
                        <ErrorShower
                            className="tw-text-lg py-3"
                            err={formState.errors.root as any}
                        />
                        <form
                            className="tw-space-y-4 md:tw-space-y-6"
                            action="#"
                            onSubmit={handleSubmit(async (data) => {
                                const docs = await getDocs(
                                    query(
                                        createCollection("Users"),
                                        where("userName", "==", data.userName)
                                    )
                                );
                                if (docs.empty)
                                    return setError("userName", {
                                        message: "userName is not exist",
                                    });

                                const confirmPassword =
                                    docs.docs[0].data().password;

                                if (data.password != confirmPassword)
                                    return setError("password", {
                                        message: "password is not correct",
                                    });
                                if (data.remeberMe)
                                    localStorage.setItem(
                                        "userId",
                                        docs.docs[0].id
                                    );
                                await onUser(docs.docs[0]);
                            })}
                        >
                            <NormalInput
                                labelText={"User Name"}
                                type="text"
                                id="userName"
                                err={formState.errors.userName}
                                placeholder="eg.ahmed-ali-546"
                                {...register("userName", {
                                    required: true,
                                })}
                            />

                            <NormalInput
                                labelText="Password"
                                type="password"
                                id="password"
                                err={formState.errors.password}
                                placeholder="**********"
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
                                            className="tw-w-4 tw-h-4 tw-border tw-border-gray-300 tw-rounded tw-bg-gray-50 focus:tw-ring-3 focus:tw-ring-primary-300 dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:focus:tw-ring-primary-600 dark:tw-ring-offset-gray-800"
                                            {...register("remeberMe")}
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
                                className="tw-w-full tw-text-white tw-bg-primary-600 hover:tw-bg-primary-700 focus:tw-ring-4 focus:tw-outline-none focus:tw-ring-primary-300 tw-font-medium tw-rounded-lg tw-text-sm tw-px-5 tw-py-2.5 tw-text-center dark:tw-bg-primary-600 dark:hover:tw-bg-primary-700 dark:focus:tw-ring-primary-800"
                            >
                                Login
                            </button>
                            <p className="tw-text-sm tw-font-light tw-text-gray-500 dark:tw-text-gray-400">
                                Don’t have an account yet?{" "}
                                <Link
                                    href="/sign-up"
                                    className="tw-font-medium tw-text-primary-600 hover:tw-underline dark:tw-text-primary-500"
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
