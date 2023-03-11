/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {}
    },
    plugins: [
        require("daisyui")
    ],
    daisyui: {
        themes: [
            {
                dark: {
                    "primary": "#0284c7",
                    "secondary": "#4338ca",
                    "accent": "#1FB2A5",
                    "neutral": "#191D24",
                    "base-100": "#2A303C",
                    "info": "#3ABFF8",
                    "success": "#4d7c0f",
                    "warning": "#FBBD23",
                    "error": "#ef4444",
                },
            },
        ],
    },
}
