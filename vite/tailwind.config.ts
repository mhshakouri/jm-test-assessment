import type { Config } from 'tailwindcss'

export default {
    content: [
        './index.html',
        './src/**/*.{vue,js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            screens: {
              mobile: 'var(--breakpoint-mobile)',
              desktop: 'var(--breakpoint-desktop)',
            },
            colors: {
              'brand-blue-lighter': 'var(--color-brand-blue-lighter)',
              'brand-blue': 'var(--color-brand-blue)',
              'brand-blue-darker': 'var(--color-brand-blue-darker)',
              'brand-gray-lighter': 'var(--color-brand-gray-lighter)',
              'brand-gray': 'var(--color-brand-gray)',
              'brand-white': 'var(--color-brand-white)',
            },
            // Typography
            fontFamily: {
                sans: ['Nunito Sans', 'sans-serif'],
            },
            fontSize: {
                'homepage': '14px', // Homepage Items
                'detail': '16px', // Detail Page
            },
            fontWeight: {
                'light': '300',
                'semibold': '600',
                'extrabold': '800',
            },
            
        },
    }
} as Config