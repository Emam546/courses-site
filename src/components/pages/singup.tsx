import { DataBase } from "@/data";
import { createCollection } from "@/firebase";
import {
    QueryDocumentSnapshot,
    addDoc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
    where,
} from "firebase/firestore";
import React from "react";
import { FieldError, useForm } from "react-hook-form";
import { ErrorShower, NormalInput, SelectInput } from "../common/registeration";
import { useQuery } from "@tanstack/react-query";

export interface Props {
    onUser: (user: QueryDocumentSnapshot<DataBase["Users"]>) => any;
}
export interface Form {
    phone: string;
    password: string;
    confirmPassword: string;
    name: string;
    userName: string;
    levelId: string;
}
const egyptianPhoneNumberPattern = /^\+2(010|011|012|015)[0-9]{8}$/;
const UserNamePattern = /^[a-zA-Z_]{6,19}$/;

export default function SingUp({ onUser }: Props) {
    const { register, formState, handleSubmit, setError, setValue } =
        useForm<Form>();
    const { data: levels } = useQuery({
        queryKey: ["Levels"],
        queryFn: async () => {
            return await getDocs(
                query(createCollection("Levels"), orderBy("order"))
            );
        },
    });
    return (
        <section className="dark:tw-bg-gray-900 tw-bg-gray-50">
            <div className="tw-min-h-screen tw-flex tw-flex-col tw-items-center tw-justify-center tw-px-6 tw-py-8 tw-mx-auto md:tw-h-screen lg:tw-py-0">
                <div className="tw-w-full tw-bg-white tw-rounded-lg tw-shadow dark:tw-border md:tw-mt-0 sm:tw-max-w-md xl:tw-p-0 dark:tw-bg-gray-800 dark:tw-border-gray-700">
                    <div className="tw-p-6 tw-space-y-4 md:tw-space-y-6 sm:tw-p-8">
                        <h1 className="tw-text-xl tw-font-bold tw-leading-tight tw-tracking-tight tw-text-gray-900 md:tw-text-2xl dark:tw-text-white">
                            Sign up
                        </h1>
                        <ErrorShower
                            className="tw-text-lg py-3"
                            err={formState.errors.root as any}
                        />
                        <form
                            className="tw-space-y-4 md:tw-space-y-6"
                            action="#"
                            onSubmit={handleSubmit(async (data) => {
                                try {
                                    const newDoc = await addDoc(
                                        createCollection("Users"),
                                        {
                                            name: data.name,
                                            password: data.password,
                                            phone: data.phone,
                                            userName: data.userName,
                                            createdAt: serverTimestamp(),
                                            levelId: data.levelId,
                                            blocked: false,
                                        }
                                    );
                                    const existedDoc = await getDoc(newDoc);
                                    if (!existedDoc.exists())
                                        return setError("root", {
                                            message: "Error happened",
                                        });
                                    await onUser(existedDoc);
                                } catch (err: any) {
                                    setError("root", err.message);
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
                            <NormalInput
                                labelText={"Your phone number"}
                                id="tel"
                                type="tel"
                                err={formState.errors.phone}
                                placeholder="+201091907365"
                                {...register("phone", {
                                    required: true,
                                    validate(val) {
                                        const state =
                                            egyptianPhoneNumberPattern.test(
                                                val
                                            );
                                        if (!state)
                                            return "Invalid Egyptian phone number format. Please check and try again.";
                                        return true;
                                    },
                                })}
                            />
                            <NormalInput
                                labelText={"User Name"}
                                type="text"
                                id="userName"
                                err={formState.errors.userName}
                                placeholder="eg.ahmed-ali-546"
                                {...register("userName", {
                                    required: true,
                                    async validate(val) {
                                        const state = UserNamePattern.test(val);
                                        if (!state)
                                            return "Invalid userName format. Use lowercase letters and underscores (_), 6-19 characters.";
                                        const docs = await getDocs(
                                            query(
                                                createCollection("Users"),
                                                where("userName", "==", val),
                                                limit(1)
                                            )
                                        );
                                        if (!docs.empty)
                                            return "The user name is already exist";
                                        return true;
                                    },
                                })}
                            />
                            <NormalInput
                                labelText="Your name"
                                type="text"
                                id="name"
                                err={formState.errors.name}
                                placeholder="eg.ahmed mohamed ali hasem"
                                {...register("name", {
                                    required: true,
                                    min: 5,
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
                                    min: 8,
                                })}
                            />
                            <NormalInput
                                labelText="Confirm password"
                                type="password"
                                id="confirmPassword"
                                err={formState.errors.confirmPassword}
                                placeholder="**********"
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

                            <button
                                type="submit"
                                disabled={
                                    formState.isSubmitting ||
                                    formState.isValidating
                                }
                                className="tw-w-full tw-text-white tw-bg-primary-600 hover:tw-bg-primary-700 focus:tw-ring-4 focus:tw-outline-none focus:tw-ring-primary-300 tw-font-medium tw-rounded-lg tw-text-sm tw-px-5 tw-py-2.5 tw-text-center dark:tw-bg-primary-600 dark:hover:tw-bg-primary-700 dark:focus:tw-ring-primary-800"
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
