import React from "react";

export default function Footer() {
    return (
        <footer className="footer-section spad pb-0 tw-p-0">
            <div className="footer-bottom tw-m-0">
                <div className="footer-warp">
                    <ul className="footer-menu">
                        <li>
                            <a href="#">Terms &amp; Conditions</a>
                        </li>
                        <li>
                            <a href="#">Register</a>
                        </li>
                        <li>
                            <a href="#">Privacy</a>
                        </li>
                    </ul>
                    <div className="copyright">
                        {/* Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. */}
                        Copyright © All rights reserved | This template is made
                        with{" "}
                        <i
                            className="fa fa-heart-o"
                            aria-hidden="true"
                        />{" "}
                        by{" "}
                        <a
                            href="https://colorlib.com"
                            target="_blank"
                        >
                            Colorlib
                        </a>
                        {/* Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. */}
                    </div>
                </div>
            </div>
        </footer>
    );
}
