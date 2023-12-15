/** @type {import('tailwindcss').Config} */

const config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: "#eff6ff",
                    100: "#dbeafe",
                    200: "#bfdbfe",
                    300: "#93c5fd",
                    400: "#60a5fa",
                    500: "#3b82f6",
                    600: "#2563eb",
                    700: "#1d4ed8",
                    800: "#1e40af",
                    900: "#1e3a8a",
                    950: "#172554",
                },

                "media-brand": "rgb(var(--media-brand) / <alpha-value>)",
                "media-focus": "rgb(var(--media-focus) / <alpha-value>)",
            },
        },
        fontFamily: {
            body: [
                "Inter",
                "ui-sans-serif",
                "system-ui",
                "-apple-system",
                "system-ui",
                "Segoe UI",
                "Roboto",
                "Helvetica Neue",
                "Arial",
                "Noto Sans",
                "sans-serif",
                "Apple Color Emoji",
                "Segoe UI Emoji",
                "Segoe UI Symbol",
                "Noto Color Emoji",
            ],
            sans: [
                "Inter",
                "ui-sans-serif",
                "system-ui",
                "-apple-system",
                "system-ui",
                "Segoe UI",
                "Roboto",
                "Helvetica Neue",
                "Arial",
                "Noto Sans",
                "sans-serif",
                "Apple Color Emoji",
                "Segoe UI Emoji",
                "Segoe UI Symbol",
                "Noto Color Emoji",
            ],
        },
    },

    plugins: [
        require("tailwindcss-animate"),
        require("@vidstack/react/tailwind.cjs")({
            prefix: "media",
        }),
        customVariants,
    ],
    prefix: "tw-",
};
function customVariants({ addVariant, matchVariant }) {
    // Strict version of `.group` to help with nesting.
    matchVariant("parent-data", (value) => `.parent[data-${value}] > &`);

    addVariant("hocus", ["&:hover", "&:focus-visible"]);
    addVariant("group-hocus", [".group:hover &", ".group:focus-visible &"]);
}

export default config;
