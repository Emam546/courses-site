import { useAppSelector } from "@/store";
import { useRouter } from "next/router";
import UserComponent from "./user";

export default function Header() {
    const user = useAppSelector((state) => state.auth.user);
    const router = useRouter();
    return (
        <header className="header-section">
            <div className="container">
                <div className="tw-flex tw-flex-wrap md:tw-gap-20">
                    <div>
                        <div className="site-logo">
                            <img
                                src="/img/logo.png"
                                alt="logo"
                            />
                        </div>
                    </div>
                    <div className="tw-flex-1 tw-flex tw-justify-end tw-items-center tw-gap-x-4">
                        {/* <nav className="main-menu tw-flex-1">
                            <ul className="tw-flex tw-items-center">
                                <li>
                                    <Link
                                        href="/"
                                        className="tw-block tw-p-0"
                                    >
                                        Home
                                    </Link>
                                </li>
                            </ul>
                        </nav> */}
                        {user == undefined && (
                            <button
                                type="button"
                                onClick={() => {
                                    return router.push("/login");
                                }}
                                className="site-btn"
                            >
                                Login
                            </button>
                        )}

                        <UserComponent />
                        {/* <div className="nav-switch">
                            <FontAwesomeIcon icon={faBars} />
                        </div> */}
                    </div>
                </div>
            </div>
        </header>
    );
}
