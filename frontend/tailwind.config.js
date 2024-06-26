/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{js,ts,jsx,tsx,html}'],
    theme: {
        extend: {
            colors: {
                'space': '#242b3d',
                'space-light': '#2e3a53',
                'space-lighter': '#4a556f',
                'space-lighter-hover': '#4f5a74',
                'space-lightest': '#6d7f9e',

            },
            fontFamily: {
                'sans': ['Poppins', 'sans-serif'],
                'loading': ['Flow Circular']
            },
        },
    },
    plugins: [],
}

