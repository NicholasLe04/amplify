/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{js,ts,jsx,tsx,html}'],
    theme: {
        extend: {
            colors: {
                'space': '#242b3d',
                'space-light': '#2e3a53',
            },
            fontFamily: {
                'sans': ['Poppins', 'sans-serif'],
                'loading': ['Flow Circular']
            },
        },
    },
    plugins: [],
}

