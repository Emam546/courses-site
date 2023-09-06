/* eslint-disable @next/next/no-img-element */
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import SimpleBar from "simplebar-react";

interface HeaderNavProps {
    title: string;
}
export function HeaderNav({ title }: HeaderNavProps) {
    return (
        <li className="nav-small-cap">
            <i className="ti ti-dots nav-small-cap-icon fs-4" />
            <span className="hide-menu">{title}</span>
        </li>
    );
}
interface LinkElemProps {
    href: string;
    title: string;
}

export function LinkElem({ href, title }: LinkElemProps) {
    const router = useRouter();

    const state = router.asPath.split("/")[1] == href.split("/")[1];
    return (
        <li className={classNames("sidebar-item", { selected: state })}>
            <Link
                className={classNames("sidebar-link", {
                    active: state,
                })}
                href={href}
                aria-expanded={state}
            >
                <span>
                    <i className="ti ti-layout-dashboard" />
                </span>
                <span className="hide-menu">{title}</span>
            </Link>
        </li>
    );
}
export interface Props {
    onClose?: (this: HTMLDivElement) => any;
}
export default function SideBar({ onClose: onToggle }: Props) {
    return (
        <aside className="left-sidebar">
            {/* Sidebar scroll*/}
            <div>
                <div className="brand-logo d-flex align-items-center justify-content-between">
                    <Link
                        href="/"
                        className="text-nowrap logo-img"
                    >
                        <img
                            src="/images/logos/dark-logo.svg"
                            width={180}
                            alt="logo"
                        />
                    </Link>
                    <div
                        className="close-btn d-xl-none d-block  cursor-pointer"
                        id="sidebarCollapse"
                        onClick={(e) => {
                            onToggle && onToggle.call(e.currentTarget);
                        }}
                    >
                        <i className="ti ti-x fs-8" />
                    </div>
                </div>
                {/* Sidebar navigation*/}
                <SimpleBar className="scroll-sidebar">
                    <nav className="sidebar-nav">
                        <ul id="sidebarnav">
                            <HeaderNav title="Home" />
                            <LinkElem
                                href="/levels"
                                title="Organize Data"
                            />
                            <LinkElem
                                href="/users"
                                title="Manage Users"
                            />
                        </ul>
                    </nav>
                </SimpleBar>
                {/* End Sidebar navigation */}
            </div>
            {/* End Sidebar scroll*/}
        </aside>
    );
}
