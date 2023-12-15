import Link from "next/link";
import { FieldError, useForm } from "react-hook-form";
import { ErrorInputShower } from "../common/inputs/main";
import { useRouter } from "next/router";
import { createTeacherCall } from "@/firebase/functions";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "@/firebase";
import {
    getErrorMessage,
    isFireBaseError,
    setRememberMeState,
} from "@/utils/firebase";
import { isErrormessage } from "@/utils/func";
import { ObjectEntries } from "@/utils";
export type FormValues = {
    displayName: string;
    password: string;
    email: string;
    confirmPassword: string;
    rememberMe: boolean;
};

export default function SingUp() {
    const { register, handleSubmit, formState, setError } =
        useForm<FormValues>();
    const router = useRouter();
    return (
        <div
            className="page-wrapper"
            id="main-wrapper"
            data-layout="vertical"
            data-navbarbg="skin6"
            data-sidebartype="full"
            data-sidebar-position="fixed"
            data-header-position="fixed"
        >
            <div className="position-relative overflow-hidden radial-gradient min-vh-100 d-flex align-items-center justify-content-center tw-py-6">
                <div className="d-flex align-items-center justify-content-center w-100">
                    <div className="row justify-content-center w-100">
                        <div className="col-md-8 col-lg-6 col-xxl-3">
                            <div className="card mb-0">
                                <div className="card-body">
                                    <div className="text-nowrap logo-img text-center d-block py-3 w-100">
                                        <img
                                            src="/images/logos/dark-logo.svg"
                                            width={180}
                                            alt="logo"
                                        />
                                    </div>
                                    <p className="text-center">
                                        Create An Account
                                    </p>
                                    <form
                                        onSubmit={handleSubmit(async (data) => {
                                            try {
                                                await setRememberMeState(
                                                    auth,
                                                    data.rememberMe
                                                );
                                                const res =
                                                    await createTeacherCall({
                                                        displayName:
                                                            data.displayName,
                                                        email: data.email,
                                                        password: data.password,
                                                    });
                                                if (!res.data.success) {
                                                    const msg = res.data.msg;
                                                    const errors = res.data.err;
                                                    if (errors) {
                                                        if (
                                                            isFireBaseError(
                                                                errors
                                                            )
                                                        ) {
                                                            const message =
                                                                getErrorMessage(
                                                                    errors.code
                                                                );

                                                            if (!message)
                                                                return setError(
                                                                    "root",
                                                                    {
                                                                        message:
                                                                            errors.message,
                                                                    }
                                                                );
                                                            return setError(
                                                                message.type as keyof FormValues,
                                                                {
                                                                    message:
                                                                        message.message,
                                                                }
                                                            );
                                                        }
                                                        if (
                                                            errors &&
                                                            isErrormessage(
                                                                errors
                                                            )
                                                        ) {
                                                            ObjectEntries(
                                                                errors
                                                            ).forEach(
                                                                ([
                                                                    key,
                                                                    val,
                                                                ]) => {
                                                                    if (
                                                                        key ==
                                                                        "."
                                                                    )
                                                                        return setError(
                                                                            "root",
                                                                            {
                                                                                message:
                                                                                    val[0]
                                                                                        .message,
                                                                            }
                                                                        );
                                                                    setError(
                                                                        key as keyof FormValues,
                                                                        {
                                                                            message:
                                                                                val[0]
                                                                                    .message,
                                                                        }
                                                                    );
                                                                }
                                                            );
                                                        }
                                                    }
                                                    setError("root", {
                                                        message: msg,
                                                    });
                                                    return;
                                                }
                                                await signInWithCustomToken(
                                                    auth,
                                                    res.data.data.token
                                                );
                                                router.push("/verify");
                                            } catch (err) {
                                                console.error(err);

                                                setError("root", {
                                                    message: (err as any)
                                                        .message,
                                                });
                                            }
                                        })}
                                    >
                                        <ErrorInputShower
                                            className="tw-text-center"
                                            err={
                                                formState.errors
                                                    .root as FieldError
                                            }
                                        />
                                        <div className="mb-3">
                                            <label
                                                htmlFor="name-input"
                                                className="form-label"
                                            >
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="name-input"
                                                aria-describedby="textHelp"
                                                {...register("displayName", {
                                                    required:
                                                        "The Field is required",
                                                })}
                                            />
                                            <ErrorInputShower
                                                err={
                                                    formState.errors.displayName
                                                }
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label
                                                htmlFor="email-input"
                                                className="form-label"
                                            >
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="email-input"
                                                aria-describedby="emailHelp"
                                                {...register("email", {
                                                    required:
                                                        "The Field is required",
                                                })}
                                            />
                                            <ErrorInputShower
                                                err={formState.errors.email}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label
                                                htmlFor="password-input"
                                                className="form-label"
                                            >
                                                Password
                                            </label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="password-input"
                                                {...register("password", {
                                                    required:
                                                        "The Field is required",
                                                    minLength: {
                                                        message:
                                                            "The Password must be at least six characters",
                                                        value: 6,
                                                    },
                                                })}
                                            />
                                            <ErrorInputShower
                                                err={formState.errors.password}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label
                                                htmlFor="confirmPassword-input"
                                                className="form-label"
                                            >
                                                Confirm Password
                                            </label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="confirmPassword-input"
                                                {...register(
                                                    "confirmPassword",
                                                    {
                                                        required:
                                                            "The Field is required",
                                                        validate(val, data) {
                                                            if (
                                                                val !=
                                                                data.password
                                                            )
                                                                return "Incorrect password";
                                                            return true;
                                                        },
                                                    }
                                                )}
                                            />
                                            <ErrorInputShower
                                                err={
                                                    formState.errors
                                                        .confirmPassword
                                                }
                                            />
                                        </div>
                                        <div className="form-check mb-4">
                                            <input
                                                className="form-check-input primary"
                                                type="checkbox"
                                                id="flexCheckChecked"
                                                {...register("rememberMe")}
                                            />
                                            <label
                                                className="form-check-label text-dark"
                                                htmlFor="flexCheckChecked"
                                            >
                                                Remember this Device
                                            </label>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={formState.isSubmitting}
                                            className="btn btn-primary w-100 py-8 fs-4 mb-4 rounded-2"
                                        >
                                            Sign Up
                                        </button>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <p className="fs-4 mb-0 fw-bold">
                                                Already have an Account?
                                            </p>
                                            <Link
                                                className="text-primary fw-bold ms-2"
                                                href="/login"
                                            >
                                                Sign In
                                            </Link>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
