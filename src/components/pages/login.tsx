import { FieldError, useForm } from "react-hook-form";
import { ErrorInputShower } from "../common/inputs/main";
import { auth } from "@/firebase";
import { UserCredential, signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import {
    getErrorMessage,
    isFireBaseError,
    setRememberMeState,
} from "@/utils/firebase";
export interface FormValues {
    email: string;
    password: string;
    rememberMe: boolean;
}
export interface Props {
    onLogin?: (state: UserCredential) => any;
}

export default function Login({ onLogin }: Props) {
    const { register, handleSubmit, formState, setError } = useForm<FormValues>(
        {
            criteriaMode: "firstError",
        }
    );

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
                                    <p className="text-center">Login</p>
                                    <form
                                        onSubmit={handleSubmit(async (data) => {
                                            try {
                                                await setRememberMeState(
                                                    auth,
                                                    data.rememberMe
                                                );
                                                const user =
                                                    await signInWithEmailAndPassword(
                                                        auth,
                                                        data.email,
                                                        data.password
                                                    );
                                                if (user) onLogin?.(user);
                                            } catch (err) {
                                                if (!isFireBaseError(err))
                                                    return;
                                                const message = getErrorMessage(
                                                    err.code
                                                );

                                                if (!message)
                                                    return setError("root", {
                                                        message:
                                                            err.message as string,
                                                    });
                                                setError(
                                                    message.type as keyof FormValues,
                                                    {
                                                        message:
                                                            message.message,
                                                    }
                                                );
                                            }
                                        })}
                                    >
                                        <ErrorInputShower
                                            err={
                                                formState.errors
                                                    .root as FieldError
                                            }
                                        />
                                        <div className="mb-3">
                                            <label
                                                htmlFor="email-input"
                                                className="form-label"
                                            >
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="email-input"
                                                aria-describedby="emailHelp"
                                                {...register("email", {
                                                    required:
                                                        "The Input is required",
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
                                                        "The Input is required",
                                                })}
                                            />
                                            <ErrorInputShower
                                                err={formState.errors.password}
                                            />
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between mb-4">
                                            <div className="form-check">
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
                                            {/* <a
                                                className="text-primary fw-bold"
                                                href="./index.html"
                                            >
                                                Forgot Password ?
                                            </a> */}
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={formState.isSubmitting}
                                            className="btn btn-primary w-100 py-8 fs-4 mb-4 rounded-2"
                                        >
                                            Sign In
                                        </button>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <p className="fs-4 mb-0 fw-bold">
                                                New to Modernize?
                                            </p>
                                            <Link
                                                className="text-primary fw-bold ms-2"
                                                href="/signup"
                                            >
                                                Create an account
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
