import React from "react";

export default function Footer() {
    return (
        
        <footer className="footer">
            <div className="container">
                {/* Newsletter */}
                <div className="newsletter">
                    <div className="row">
                        <div className="col">
                            <div className="section_title text-center">
                                <h1>Subscribe to newsletter</h1>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col text-center">
                            <div className="newsletter_form_container mx-auto">
                                <form action="post">
                                    <div className="newsletter_form d-flex flex-md-row flex-column flex-xs-column align-items-center justify-content-center">
                                        <input
                                            id="newsletter_email"
                                            className="newsletter_email"
                                            type="email"
                                            placeholder="Email Address"
                                            required
                                            data-error="Valid email is required."
                                        />
                                        <button
                                            id="newsletter_submit"
                                            type="submit"
                                            className="newsletter_submit_btn trans_300"
                                            value="Submit"
                                        >
                                            Subscribe
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Footer Content */}
                <div className="footer_content">
                    <div className="row">
                        {/* Footer Column - About */}
                        <div className="col-lg-3 footer_col">
                            {/* Logo */}
                            <div className="logo_container">
                                <div className="logo">
                                    <img
                                        src="images/logo.png"
                                        alt="logo"
                                    />
                                    <span>course</span>
                                </div>
                            </div>
                            <p className="footer_about_text">
                                In aliquam, augue a gravida rutrum, ante nisl
                                fermentum nulla, vitae tempor nisl ligula vel
                                nunc. Proin quis mi malesuada, finibus tortor
                                fermentum, tempor lacus.
                            </p>
                        </div>
                        {/* Footer Column - Menu */}
                        <div className="col-lg-3 footer_col">
                            <div className="footer_column_title">Menu</div>
                            <div className="footer_column_content">
                                <ul>
                                    <li className="footer_list_item">
                                        <a href="index.html">Home</a>
                                    </li>
                                    <li className="footer_list_item">
                                        <a href="#">About Us</a>
                                    </li>
                                    <li className="footer_list_item">
                                        <a href="#">Courses</a>
                                    </li>
                                    <li className="footer_list_item">
                                        <a href="news.html">News</a>
                                    </li>
                                    <li className="footer_list_item">
                                        <a href="contact.html">Contact</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        {/* Footer Column - Usefull Links */}
                        <div className="col-lg-3 footer_col">
                            <div className="footer_column_title">
                                Usefull Links
                            </div>
                            <div className="footer_column_content">
                                <ul>
                                    <li className="footer_list_item">
                                        <a href="#">Testimonials</a>
                                    </li>
                                    <li className="footer_list_item">
                                        <a href="#">FAQ</a>
                                    </li>
                                    <li className="footer_list_item">
                                        <a href="#">Community</a>
                                    </li>
                                    <li className="footer_list_item">
                                        <a href="#">Campus Pictures</a>
                                    </li>
                                    <li className="footer_list_item">
                                        <a href="#">Tuitions</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        {/* Footer Column - Contact */}
                        <div className="col-lg-3 footer_col">
                            <div className="footer_column_title">Contact</div>
                            <div className="footer_column_content">
                                <ul>
                                    <li className="footer_contact_item">
                                        <div className="footer_contact_icon">
                                            <img
                                                src="images/placeholder.svg"
                                                alt="https://www.flaticon.com/authors/lucy-g"
                                            />
                                        </div>
                                        Blvd Libertad, 34 m05200 Arévalo
                                    </li>
                                    <li className="footer_contact_item">
                                        <div className="footer_contact_icon">
                                            <img
                                                src="images/smartphone.svg"
                                                alt="https://www.flaticon.com/authors/lucy-g"
                                            />
                                        </div>
                                        0034 37483 2445 322
                                    </li>
                                    <li className="footer_contact_item">
                                        <div className="footer_contact_icon">
                                            <img
                                                src="images/envelope.svg"
                                                alt="https://www.flaticon.com/authors/lucy-g"
                                            />
                                        </div>
                                        hello@company.com
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Footer Copyright */}
                <div className="footer_bar d-flex flex-column flex-sm-row align-items-center">
                    <div className="footer_copyright">
                        <span>
                            {/* Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. */}
                            Copyright © All rights reserved | This template is
                            made with{" "}
                            <i
                                className="fa fa-heart"
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
                        </span>
                    </div>
                    <div className="footer_social ml-sm-auto">
                        <ul className="menu_social">
                            <li className="menu_social_item">
                                <a href="#">
                                    <i className="fab fa-pinterest" />
                                </a>
                            </li>
                            <li className="menu_social_item">
                                <a href="#">
                                    <i className="fab fa-linkedin-in" />
                                </a>
                            </li>
                            <li className="menu_social_item">
                                <a href="#">
                                    <i className="fab fa-instagram" />
                                </a>
                            </li>
                            <li className="menu_social_item">
                                <a href="#">
                                    <i className="fab fa-facebook-f" />
                                </a>
                            </li>
                            <li className="menu_social_item">
                                <a href="#">
                                    <i className="fab fa-twitter" />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}
