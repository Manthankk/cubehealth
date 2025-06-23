/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#2563eb', // blue-600
                secondary: '#22d3ee', // cyan-400
                accent: '#22c55e', // green-500
            },
        },
    },
    plugins: [],
};
