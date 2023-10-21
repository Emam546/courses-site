import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import React from "react";
export interface Props {
    OnOpen?: () => any;
}
export default function Header({ OnOpen }: Props) {
    const router = useRouter();
    return (
        <header className="app-header">
            <nav className="navbar navbar-expand-lg navbar-light">
                <ul className="navbar-nav">
                    <li className="nav-item d-block d-xl-none">
                        <a
                            className="nav-link  nav-icon-hover"
                            id="headerCollapse"
                            onClick={(e) => {
                                e.preventDefault();
                                OnOpen && OnOpen();
                            }}
                            href=""
                        >
                            <i className="ti ti-menu-2" />
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            className="nav-link nav-icon-hover"
                            onClick={(e) => {
                                e.preventDefault();
                            }}
                            href=""
                        >
                            <i className="ti ti-bell-ringing" />
                            <div className="notification bg-primary rounded-circle" />
                        </a>
                    </li>
                </ul>
                <div
                    className="navbar-collapse justify-content-end px-0"
                    id="navbarNav"
                >
                    <ul className="navbar-nav flex-row ms-auto align-items-center justify-content-end">
                        <li className="nav-item dropdown">
                            <span
                                className="nav-link nav-icon-hover tw-cursor-pointer"
                                id="drop2"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <img
                                    src="/images/profile/user-1.jpg"
                                    alt="user-image"
                                    width={35}
                                    height={35}
                                    className="rounded-circle"
                                />
                            </span>
                            <div
                                className="dropdown-menu dropdown-menu-end dropdown-menu-animate-up"
                                aria-labelledby="drop2"
                            >
                                <div className="message-body">
                                    <a
                                        href="#"
                                        className="d-flex align-items-center gap-2 dropdown-item"
                                    >
                                        <i className="ti ti-user fs-6" />
                                        <p className="mb-0 fs-3">My Profile</p>
                                    </a>
                                    <a
                                        href="#"
                                        className="d-flex align-items-center gap-2 dropdown-item"
                                    >
                                        <i className="ti ti-mail fs-6" />
                                        <p className="mb-0 fs-3">My Account</p>
                                    </a>
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
