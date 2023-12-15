import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import React from "react";
import { TeacherImage } from "./pages/teachers/form";
import { useAppSelector } from "@/store";
import Link from "next/link";
export interface Props {
    OnOpen?: () => any;
}
export default function Header({ OnOpen }: Props) {
    const router = useRouter();
    const user = useAppSelector((state) => state.auth.user!);
    return (
        <header className="app-header">
            <nav className="navbar navbar-expand-lg navbar-light">
                <ul className="navbar-nav">
                    <li className="nav-item d-block d-xl-none">
                        <button
                            className="nav-link  nav-icon-hover tw-bg-transparent tw-border-none"
                            id="headerCollapse"
                            onClick={(e) => {
                                OnOpen && OnOpen();
                            }}
                        >
                            <i className="ti ti-menu-2" />
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            type="button"
                            className="nav-link nav-icon-hover tw-bg-transparent tw-border-none"
                            onClick={(e) => {
                                e.preventDefault();
                            }}
                        >
                            <i className="ti ti-bell-ringing" />
                            <div className="notification bg-primary rounded-circle" />
                        </button>
                    </li>
                </ul>
                <div
                    className="navbar-collapse justify-content-end px-0"
                    id="navbarNav"
                >
                    <ul className="navbar-nav flex-row ms-auto align-items-center justify-content-end">
                        <li className="nav-item dropdown">
                            <span
                                className="nav-link  nav-icon-hover tw-cursor-pointer"
                                id="drop2"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <TeacherImage
                                    className="tw-w-8"
                                    src={user.photoUrl}
                                    alt="user-image"
                                />
                            </span>
                            <div
                                className="dropdown-menu dropdown-menu-end dropdown-menu-animate-up"
                                aria-labelledby="drop2"
                            >
                                <div className="message-body">
                                    <Link
                                        href={"/teachers/info"}
                                        className="d-flex align-items-center gap-2 dropdown-item"
                                    >
                                        <i className="ti ti-user fs-6" />
                                        <p className="mb-0 fs-3">My Profile</p>
                                    </Link>
                                    <div className="mx-3 mt-2">
                                        <button
                                            onClick={async () => {
                                                await signOut(auth);
                                                router.push("/");
                                            }}
                                            className="btn btn-outline-primary tw-block tw-w-full"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}
