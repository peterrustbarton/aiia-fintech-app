import type { Config } from 'tailwindcss';

const config: Config = {
    darkMode: ['class'],
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                // Dark Blue 2 gradients
                'dark-gradient': 'linear-gradient(135deg, #0a0a0f, #111827, #0f172a)',
                'panel-gradient': 'linear-gradient(145deg, rgba(17, 24, 39, 0.8), rgba(30, 41, 59, 0.6))',
                'button-gradient': 'linear-gradient(45deg, #38bdf8, #06b6d4)',
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            colors: {
                // Keep existing shadcn colors
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                chart: {
                    '1': 'hsl(var(--chart-1))',
                    '2': 'hsl(var(--chart-2))',
                    '3': 'hsl(var(--chart-3))',
                    '4': 'hsl(var(--chart-4))',
                    '5': 'hsl(var(--chart-5))',
                },
                // Dark Blue 2 theme colors
                'theme-bg': {
                    'primary': '#0a0a0f',
                    'secondary': '#111827',
                    'tertiary': '#0f172a',
                },
                'theme-panel': {
                    'bg': 'rgba(17, 24, 39, 0.8)',
                    'border': 'rgba(56, 189, 248, 0.15)',
                    'hover': 'rgba(56, 189, 248, 0.1)',
                },
                'theme-accent': {
                    'primary': '#38bdf8',
                    'secondary': '#06b6d4',
                    'glow': 'rgba(56, 189, 248, 0.4)',
                },
                'financial': {
                    'positive': '#10b981',
                    'negative': '#ef4444',
                    'neutral': '#f59e0b',
                    'positive-bg': 'rgba(16, 185, 129, 0.1)',
                    'negative-bg': 'rgba(239, 68, 68, 0.1)',
                    'neutral-bg': 'rgba(245, 158, 11, 0.1)',
                },
                'text': {
                    'primary': '#e2e8f0',
                    'secondary': '#cbd5e1',
                    'muted': '#94a3b8',
                },
            },
            boxShadow: {
                'glow': '0 0 20px rgba(56, 189, 248, 0.3)',
                'glow-lg': '0 12px 32px rgba(56, 189, 248, 0.15)',
                'panel': '0 8px 20px rgba(0, 0, 0, 0.3)',
                'panel-hover': '0 12px 32px rgba(56, 189, 248, 0.15)',
            },
            keyframes: {
                'accordion-down': {
                    from: {
                        height: '0',
                    },
                    to: {
                        height: 'var(--radix-accordion-content-height)',
                    },
                },
                'accordion-up': {
                    from: {
                        height: 'var(--radix-accordion-content-height)',
                    },
                    to: {
                        height: '0',
                    },
                },
                // Dark Blue 2 animations
                'slide-down': {
                    from: { transform: 'translateY(-100%)', opacity: '0' },
                    to: { transform: 'translateY(0)', opacity: '1' },
                },
                'fade-in': {
                    from: { opacity: '0', transform: 'translateY(20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                'pulse-glow': {
                    '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 20px rgba(56, 189, 248, 0.3)' },
                    '50%': { transform: 'scale(1.05)', boxShadow: '0 0 30px rgba(56, 189, 248, 0.5)' },
                },
                'shimmer': {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                },
                'spin': {
                    from: { transform: 'rotate(0deg)' },
                    to: { transform: 'rotate(360deg)' },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                // Dark Blue 2 animations
                'slide-down': 'slide-down 0.8s ease',
                'fade-in': 'fade-in 1.2s ease',
                'pulse-glow': 'pulse-glow 2s infinite',
                'shimmer': 'shimmer 2s infinite',
                'spin': 'spin 1s linear infinite',
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
};
export default config;