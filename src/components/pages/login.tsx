import { faEye, faEyeSlash, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
export interface FormValues {
    password: string;
}
export interface Props {
    onLogin: (state: boolean) => any;
}

export default function Login({ onLogin }: Props) {
    const { register, handleSubmit, formState, setError } = useForm<FormValues>(
        {
            criteriaMode: "firstError",
        }
    );
    const [passwordState, setPasswordState] = useState<"text" | "password">(
        "password"
    );
    return (
        <div className="login-screen">
            <form
                className=" screen-1"
                onSubmit={handleSubmit((data) => {
                    const password = process.env.NEXT_PUBLIC_PASSWORD;
                    const state = password == data.password;
                    if (!state)
                        return setError("password", {
                            message: "Wrong Password Please Try again",
                            type: "validate",
                        });
                    onLogin(true);
                })}
            >
                <svg
                    className="logo"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    version="1.1"
                    viewBox="0 0 640 480"
                    xmlSpace="preserve"
                >
                    <g transform="matrix(3.31 0 0 3.31 320.4 240.4)">
                        <circle
                            style={{
                                stroke: "rgb(0,0,0)",
                                strokeWidth: 0,
                                strokeDasharray: "none",
                                strokeLinecap: "butt",
                                strokeDashoffset: 0,
                                strokeLinejoin: "miter",
                                strokeMiterlimit: 4,
                                fill: "rgb(61,71,133)",
                                fillRule: "nonzero",
                                opacity: 1,
                            }}
                            cx={0}
                            cy={0}
                            r={40}
                        />
                    </g>
                    <g transform="matrix(0.98 0 0 0.98 268.7 213.7)">
                        <circle
                            style={{
                                stroke: "rgb(0,0,0)",
                                strokeWidth: 0,
                                strokeDasharray: "none",
                                strokeLinecap: "butt",
                                strokeDashoffset: 0,
                                strokeLinejoin: "miter",
                                strokeMiterlimit: 4,
                                fill: "rgb(255,255,255)",
                                fillRule: "nonzero",
                                opacity: 1,
                            }}
                            cx={0}
                            cy={0}
                            r={40}
                        />
                    </g>
                    <g transform="matrix(1.01 0 0 1.01 362.9 210.9)">
                        <circle
                            style={{
                                stroke: "rgb(0,0,0)",
                                strokeWidth: 0,
                                strokeDasharray: "none",
                                strokeLinecap: "butt",
                                strokeDashoffset: 0,
                                strokeLinejoin: "miter",
                                strokeMiterlimit: 4,
                                fill: "rgb(255,255,255)",
                                fillRule: "nonzero",
                                opacity: 1,
                            }}
                            cx={0}
                            cy={0}
                            r={40}
                        />
                    </g>
                    <g transform="matrix(0.92 0 0 0.92 318.5 286.5)">
                        <circle
                            style={{
                                stroke: "rgb(0,0,0)",
                                strokeWidth: 0,
                                strokeDasharray: "none",
                                strokeLinecap: "butt",
                                strokeDashoffset: 0,
                                strokeLinejoin: "miter",
                                strokeMiterlimit: 4,
                                fill: "rgb(255,255,255)",
                                fillRule: "nonzero",
                                opacity: 1,
                            }}
                            cx={0}
                            cy={0}
                            r={40}
                        />
                    </g>
                    <g transform="matrix(0.16 -0.12 0.49 0.66 290.57 243.57)">
                        <polygon
                            style={{
                                stroke: "rgb(0,0,0)",
                                strokeWidth: 0,
                                strokeDasharray: "none",
                                strokeLinecap: "butt",
                                strokeDashoffset: 0,
                                strokeLinejoin: "miter",
                                strokeMiterlimit: 4,
                                fill: "rgb(255,255,255)",
                                fillRule: "nonzero",
                                opacity: 1,
                            }}
                            points="-50,-50 -50,50 50,50 50,-50 "
                        />
                    </g>
                    <g transform="matrix(0.16 0.1 -0.44 0.69 342.03 248.34)">
                        <polygon
                            style={{
                                stroke: "rgb(0,0,0)",
                                strokeWidth: 0,
                                strokeDasharray: "none",
                                strokeLinecap: "butt",
                                strokeDashoffset: 0,
                                strokeLinejoin: "miter",
                                strokeMiterlimit: 4,
                                fill: "rgb(255,255,255)",
                                fillRule: "nonzero",
                                opacity: 1,
                            }}
                            vectorEffect="non-scaling-stroke"
                            points="-50,-50 -50,50 50,50 50,-50 "
                        />
                    </g>
                </svg>
                {formState.errors.password?.message && (
                    <p className="tw-text-red-300 tw-text-center">
                        {formState.errors.password?.message}
                    </p>
                )}
                <div className="password">
                    <label htmlFor="password">Password</label>
                    <div className="sec-2">
                        <FontAwesomeIcon icon={faLock} />
                        <input
                            id="password"
                            type={passwordState}
                            placeholder="············"
                            required
                            {...register("password", { required: true })}
                        />
                        <button
                            type="button"
                            onClick={() => {
                                setPasswordState(
                                    passwordState == "text"
                                        ? "password"
                                        : "text"
                                );
                            }}
                            className="tw-border-none tw-p-0 tw-m-0 tw-bg-transparent"
                        >
                            {passwordState == "text" && (
                                <FontAwesomeIcon icon={faEye} />
                            )}
                            {passwordState == "password" && (
                                <FontAwesomeIcon icon={faEyeSlash} />
                            )}
                        </button>
                    </div>
                </div>
                <button
                    type="submit"
                    className="login"
                >
                    Login
                </button>
            </form>
        </div>
    );
}