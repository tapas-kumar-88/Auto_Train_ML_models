/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#2563EB",
                secondary: "#7C3AED",
                accent: "#22C55E",
                background: "#0F172A",
                card: "#1E293B",
                border: "#334155",
                text: "#F8FAFC",
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
