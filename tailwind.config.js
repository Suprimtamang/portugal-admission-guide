import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Poppins', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                crm: {
                    primary: '#0D99FF',
                    heading: '#2C2C2C',
                    muted: '#888888',
                    canvas: '#F5F5F5',
                    border: '#E6E6E6',
                    success: '#3AC977',
                    danger: '#FF5E5E',
                    warning: '#FF9F00',
                },
            },
            boxShadow: {
                crm: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.04)',
            },
        },
    },

    plugins: [forms],
};
