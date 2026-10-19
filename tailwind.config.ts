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
			display: [
				'var(--font-sans)',
				...fontFamily.sans
			],
			mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace']
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
				'rule-strong': 'hsl(var(--rule-strong) / <alpha-value>)',
				mark: 'hsl(var(--mark) / <alpha-value>)',
				'mark-text': 'hsl(var(--mark-text) / <alpha-value>)',
				'on-mark': 'hsl(var(--on-mark) / <alpha-value>)'
			},
			// Fluid 375 -> 1280px. Balance lives on the elements, not here.
			fontSize: {
				xs: ['0.8125rem', { lineHeight: '1.35' }],
				caption: ['0.8125rem', { lineHeight: '1.35' }],
				small: ['0.875rem', { lineHeight: '1.45' }],
				body: ['clamp(1rem, 0.9741rem + 0.1105vw, 1.0625rem)', { lineHeight: '1.6' }],
				prose: ['clamp(1.0625rem, 1.0107rem + 0.221vw, 1.1875rem)', { lineHeight: '1.65' }],
				lead: ['clamp(1.25rem, 1.1982rem + 0.221vw, 1.375rem)', { lineHeight: '1.4' }],
				h4: ['1.125rem', { lineHeight: '1.3', fontWeight: '600' }],
				h3: ['clamp(1.375rem, 1.3232rem + 0.221vw, 1.5rem)', { lineHeight: '1.25', fontWeight: '600' }],
				h2: ['clamp(1.75rem, 1.4392rem + 1.326vw, 2.5rem)', { lineHeight: '1.1', fontWeight: '600' }],
				h1: ['clamp(2.5rem, 1.8785rem + 2.6519vw, 4rem)', { lineHeight: '1.02', fontWeight: '600' }],
				display: ['clamp(3.5rem, 1.0138rem + 10.6077vw, 9.5rem)', { lineHeight: '0.95', fontWeight: '600' }],
				numeral: ['clamp(2.75rem, 2.0249rem + 3.0939vw, 4.5rem)', { lineHeight: '1' }]
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
