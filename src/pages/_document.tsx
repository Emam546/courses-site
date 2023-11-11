import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <meta charSet="UTF-8" />
                <meta
                    name="description"
                    content="WebUni Education Template"
                />
                <meta
                    name="keywords"
                    content="webuni, education, creative, html"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                {/* Favicon */}
                <link
                    href="/img/favicon.ico"
                    rel="shortcut icon"
                />
                {/* Google Fonts */}
                <link
                    href="https://fonts.googleapis.com/css?family=Raleway:400,400i,500,500i,600,600i,700,700i,800,800i"
                    rel="stylesheet"
                />
            </Head>
            <body>
                <Main />
                <NextScript />
                <script
                    src="/js/jquery-3.2.1.min.js"
                    defer
                />
                <script
                    src="/js/circle-progress.min.js"
                    defer
                />
                <script
                    src="/js/owl.carousel.min.js"
                    defer
                />
                <script
                    src="/js/main.js"
                    defer
                />
            </body>
        </Html>
    );
}
