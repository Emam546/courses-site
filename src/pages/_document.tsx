import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <meta charSet="utf-8" />
                <meta
                    httpEquiv="X-UA-Compatible"
                    content="IE=edge"
                />
                <meta
                    name="description"
                    content="Course Project"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />

                <link
                    rel="stylesheet"
                    type="text/css"
                    href="styles/bootstrap4/bootstrap.min.css"
                />
                <link
                    href="plugins/fontawesome-free-5.0.1/css/fontawesome-all.css"
                    rel="stylesheet"
                    type="text/css"
                />
            </Head>
            <body>
                <Main />
                <NextScript />
                <script src="js/jquery-3.2.1.min.js"></script>
                <script src="styles/bootstrap4/popper.js"></script>
                <script src="styles/bootstrap4/bootstrap.min.js"></script>
                <script src="plugins/greensock/TweenMax.min.js"></script>
                <script src="plugins/greensock/TimelineMax.min.js"></script>
                <script src="plugins/scrollmagic/ScrollMagic.min.js"></script>
                <script src="plugins/greensock/animation.gsap.min.js"></script>
                <script src="plugins/greensock/ScrollToPlugin.min.js"></script>
                <script src="plugins/scrollTo/jquery.scrollTo.min.js"></script>
                <script src="plugins/easing/easing.js"></script>
            </body>
        </Html>
    );
}
