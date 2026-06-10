import type { Config } from 'tailwindcss';

/**
 * OurFrame design system — "Cinematic Minimalism", strict dark mode.
 * Tokens mirror the CSS variables declared in src/styles/globals.css so that
 * runtime theming stays in sync with Tailwind utility classes.
 */
const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Channel-based CSS variables (declared in globals.css) so Tailwind can
        // apply alpha modifiers AND swap palettes via the data-theme attribute.
        background: 'rgb(var(--color-background) / <alpha-value>)',
        canvas: 'rgb(var(--color-canvas) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)',
          container: 'rgb(var(--color-surface-container) / <alpha-value>)',
          high: 'rgb(var(--color-surface-high) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          accent: 'rgb(var(--color-primary-accent) / <alpha-value>)',
        },
        'on-surface': 'rgb(var(--color-on-surface) / <alpha-value>)',
        metadata: 'rgb(var(--color-metadata) / <alpha-value>)',
        outline: {
          DEFAULT: 'rgb(var(--color-outline) / <alpha-value>)',
          variant: 'rgb(var(--color-outline-variant) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['56px', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '800' }],
        'headline-lg': ['32px', { lineHeight: '1.1', letterSpacing: '-0.01em', fontWeight: '700' }],
        'headline-mobile': ['24px', { lineHeight: '1.15', letterSpacing: '-0.01em', fontWeight: '700' }],
        'title-md': ['18px', { lineHeight: '1.3', fontWeight: '600' }],
        'body-md': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'label-sm': ['12px', { lineHeight: '1.2', letterSpacing: '0.05em', fontWeight: '500' }],
      },
      maxWidth: {
        container: '1440px',
      },
      borderRadius: {
        card: '4px',
        avatar: '8px',
      },
      spacing: {
        'row-gap': '40px',
        'section-gap': '64px',
        'edge': '4%',
      },
      boxShadow: {
        glow: '0 0 0 2px rgba(229,9,20,0.35), 0 12px 40px rgba(0,0,0,0.6)',
        'card-hover': '0 8px 30px rgba(0,0,0,0.7)',
      },
      transitionTimingFunction: {
        cinematic: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      backgroundImage: {
        'hero-vignette':
          'linear-gradient(to top, #131313 0%, rgba(19,19,19,0.7) 25%, rgba(19,19,19,0.1) 60%, transparent 100%)',
        'hero-vignette-left':
          'linear-gradient(to right, rgba(19,19,19,0.95) 0%, rgba(19,19,19,0.5) 40%, transparent 75%)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-cinematic both',
        'fade-up': 'fade-up 0.6s ease-cinematic both',
      },
    },
  },
  plugins: [],
};

export default config;
