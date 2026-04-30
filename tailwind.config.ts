import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Design-system tokens matching --var names in HTML prototypes
        bg0: '#09090B',
        bg1: '#0F1014',
        bg2: '#141720',
        bg3: '#1A1E2A',
        bg4: '#20243A',
        bdr: '#1E2235',
        bdr2: '#252B3B',
        gold: {
          DEFAULT: '#D4A843',
          muted: '#8C7235',
        },
        t1: '#E8EAF0',
        t2: '#7B8096',
        t3: '#3D4255',
        bull: {
          DEFAULT: '#22C55E',
          dark: '#15803D',
          bg: '#0D2018',
        },
        bear: {
          DEFAULT: '#EF4444',
          dark: '#991B1B',
          bg: '#200D0D',
        },
        amb: {
          DEFAULT: '#F59E0B',
          bg: '#201800',
        },
        blue: {
          DEFAULT: '#3B82F6',
          bg: '#0D1A30',
        },
        purple: '#A78BFA',
        // shadcn compat kept for shadcn components
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: 'hsl(var(--destructive))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        mono: ['"IBM Plex Mono"', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        pulse2: 'pulse2 2s ease infinite',
        fi: 'fi .25s ease forwards',
      },
      keyframes: {
        pulse2: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '.35' },
        },
        fi: {
          from: { opacity: '0', transform: 'translateY(3px)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
