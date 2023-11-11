import { useAppDispatch, useAppSelector } from "@/store";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { assertIsNode } from "@/utils";
import classNames from "classnames";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { AuthActions } from "@/store/auth";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
export default function UserComponent() {
    const user = useAppSelector((state) => state.auth.user);
    const [expand, setExpand] = useState(false);
    const dispatch = useAppDispatch();
    const container = useRef<HTMLDivElement>(null);
    const router = useRouter();
    useEffect(() => {
        if (!container.current) return;
        function Listener(ev: MouseEvent) {
            if (!container.current) return;
            assertIsNode(ev.target);
            const state = container.current.contains(ev.target);
            if (!state) setExpand(false);
        }
        window.addEventListener("click", Listener);
        return () => {
            window.removeEventListener("click", Listener);
        };
    }, [container]);
    if (!user) return null;

    return (
        <>
            <div
                ref={container}
                className="tw-cursor-pointer tw-relative"
            >
                <button
                    className={classNames(
                        "tw-w-10 tw-aspect-square tw-overflow-hidden tw-rounded-[50%] tw-bg-neutral-100 tw-flex tw-items-center tw-justify-center",
                        "hover:tw-border tw-border tw-border-blue-600 tw-border-solid",
                        {
                            "hover:tw-border": expand,
                        }
                    )}
                    type="button"
                    onClick={(ev) => {
                        setExpand(!expand);
                    }}
                    aria-label="upload photo"
                >
                    <>
                        <FontAwesomeIcon
                            size={"1x"}
                            icon={faUser}
                        />
                    </>
                </button>
                <div
                    className={classNames(
                        "tw-absolute tw-min-h-0 tw-bg-white tw-z-[20] tw-shadow-xl tw-rounded-lg tw-transition-[max-height,max-width] tw-overflow-hidden tw-duration-500 tw-top-[calc(100%+1rem)] tw-right-0",
                        {
                            "tw-max-h-[100rem] tw-max-w-[1000px] tw-opacity-100":
                                expand,
                            "tw-max-h-0 tw-max-w-[6rem] tw-opacity-0": !expand,
                        }
                    )}
                >
                    <ul className={classNames("tw-w-52 tw-p-4 tw-px-5")}>
                        <li className="tw-py-2">
                            <Link href="/account">Account Settings</Link>
                        </li>
                        <li className="tw-py-2">
                            <button
                                onClick={async (e) => {
                                    e.preventDefault();
                                    await signOut(auth);
                                    dispatch(AuthActions.setUser(undefined));
                                    await router.push("/login");
                                }}
                            >
                                Log Out
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}
