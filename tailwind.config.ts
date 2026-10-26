import type { Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme"

const config = {
	darkMode: ["class"],
	content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}", "./content/**/*.{md,mdx}"],
	prefix: "",
	theme: {
		fontFamily: {
			sans: [
				'var(--font-sans)',
				...fontFamily.sans
			],
			// Same face as sans: hierarchy comes from the size tokens' weight and tracking.
			display: [
				'var(--font-sans)',
				...fontFamily.sans
			],
			mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace']
		},
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				ink: 'hsl(var(--ink) / <alpha-value>)',
				'ink-soft': 'hsl(var(--ink-soft) / <alpha-value>)',
				paper: 'hsl(var(--paper) / <alpha-value>)',
				tint: 'hsl(var(--tint) / <alpha-value>)',
				rule: 'hsl(var(--rule) / <alpha-value>)',
				'rule-strong': 'hsl(var(--rule-strong) / <alpha-value>)'
			},
			// Fluid 375 -> 1280px. Weight and tracking carry the hierarchy; balance lives on the elements.
			fontSize: {
				xs: ['0.75rem', { lineHeight: '1.4' }],
				caption: ['0.75rem', { lineHeight: '1.4' }],
				small: ['0.8125rem', { lineHeight: '1.45' }],
				body: ['clamp(0.9375rem, 0.9116rem + 0.1105vw, 1rem)', { lineHeight: '1.55' }],
				prose: ['clamp(1rem, 0.9741rem + 0.1105vw, 1.0625rem)', { lineHeight: '1.6' }],
				lead: ['clamp(1.0625rem, 1.0107rem + 0.221vw, 1.1875rem)', { lineHeight: '1.45' }],
				h4: ['1rem', { lineHeight: '1.35', fontWeight: '600' }],
				h3: ['clamp(1.125rem, 1.0732rem + 0.221vw, 1.25rem)', { lineHeight: '1.3', fontWeight: '600', letterSpacing: '-0.01em' }],
				h2: ['clamp(1.375rem, 1.1678rem + 0.884vw, 1.875rem)', { lineHeight: '1.15', fontWeight: '700', letterSpacing: '-0.02em' }],
				h1: ['clamp(1.875rem, 1.5124rem + 1.547vw, 2.75rem)', { lineHeight: '1.08', fontWeight: '700', letterSpacing: '-0.025em' }],
				display: ['clamp(2.75rem, 1.1961rem + 6.6298vw, 6.5rem)', { lineHeight: '0.9', fontWeight: '600', letterSpacing: '-0.04em' }],
				numeral: ['clamp(2rem, 1.5856rem + 1.768vw, 3rem)', { lineHeight: '1', fontWeight: '600', letterSpacing: '-0.02em' }]
			},
			// Radius 0 everywhere; `full` only for radio dots.
			borderRadius: {
				none: '0px',
				DEFAULT: '0px',
				sm: '0px',
				md: '0px',
				lg: '0px',
				xl: '0px',
				'2xl': '0px',
				'3xl': '0px',
				full: '9999px'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
