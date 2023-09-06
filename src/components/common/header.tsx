import React, { useState } from "react";
import classNames from "classnames";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { AuthActions } from "@/store/auth";
export default function Header() {
    const [menuState, setMenuState] = useState(false);
    const dispatch = useDispatch();
    return (
        <>
            <header
                className="header d-flex flex-row"
                ref={(header) => {
                    document.addEventListener("resize", () => {
                        if (!header) return;
                        if (window.innerWidth < 992) {
                            if (window.scrollY > 100) {
                                header.classList.add("scrolled");
                            } else {
                                header.classList.remove("scrolled");
                            }
                        } else {
                            if (window.scrollY > 100) {
                                header.classList.add("scrolled");
                            } else {
                                header.classList.remove("scrolled");
                            }
                        }

                        if (window.innerWidth > 991 && menuState) {
                            setMenuState(false);
                        }
                    });
                }}
            >
                <div className="header_content d-flex flex-row align-items-center">
                    {/* Logo */}
                    <div className="logo_container">
                        <div className="logo tw-flex">
                            <img
                                src="images/logo.png"
                                alt="logo"
                            />
                            <span>course</span>
                        </div>
                    </div>
                    {/* Main Navigation */}
                    <nav className="main_nav_container">
                        <div className="main_nav tw-flex tw-items-center tw-justify-end tw-m-0 tw-gap-x-4">
                            <ul className="tw-flex tw-w-full tw-h-full tw-items-center tw-justify-end tw-gap-x-5 tw-mb-0">
                                <li className="main_nav_item tw-text-4xl tw-font-semibold">
                                    <Link
                                        href="/"
                                        className="hover:tw-no-underline"
                                    >
                                        home
                                    </Link>
                                </li>
                            </ul>
                            <button
                                type="button"
                                onClick={() => {
                                    localStorage.removeItem("userId");
                                    dispatch(AuthActions.setUser(undefined));
                                }}
                                className="button button_color_1 text-center trans_200 tw-border-none focus:tw-outline-none tw-cursor-pointer tw-m-0"
                            >
                                <span>Sing Out</span>
                            </button>
                        </div>
                    </nav>
                </div>
                <div className="header_side tw-hidden md:tw-flex flex-row justify-content-center align-items-center">
                    <img
                        src="images/phone-call.svg"
                        alt="icon"
                    />
                    <span>+43 4566 7788 2457</span>
                </div>
                {/* Hamburger */}
                <button
                    type="button"
                    onClick={() => setMenuState(true)}
                    className="hamburger_container focus:tw-outline-none tw-bg-transparent tw-border-none"
                >
                    <i className="fas fa-bars trans_200" />
                </button>
            </header>
            {/* Menu */}
            <div
                className={classNames("menu_container menu_mm", {
                    active: menuState,
                })}
            >
                {/* Menu Close Button */}
                <button
                    type="button"
                    onClick={() => setMenuState(false)}
                    className="menu_close_container focus:tw-outline-none tw-bg-transparent tw-border-none"
                >
                    <div className="menu_close" />
                </button>
                {/* Menu Items */}
                <div className="menu_inner menu_mm">
                    <div className="menu menu_mm">
                        <ul className="menu_list menu_mm">
                            <li className="menu_item menu_mm">
                                <Link
                                    className="hover:tw-no-underline"
                                    href="/"
                                >
                                    Home
                                </Link>
                            </li>
                        </ul>
                        <button
                            type="button"
                            onClick={() => {
                                localStorage.removeItem("userId");
                                dispatch(AuthActions.setUser(undefined));
                            }}
                            className="button button_color_1 text-center trans_200 tw-border-none focus:tw-outline-none tw-cursor-pointer"
                        >
                            <span>Sing Out</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
