import type { Config } from "tailwindcss"

const config = {
	darkMode: ["class"],
	content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}", "./content/**/*.{md,mdx}"],
	prefix: "",
	theme: {
		fontFamily: {
			sans: ['var(--font-sans)', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
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
				border: 'hsl(var(--border) / <alpha-value>)',
				input: 'hsl(var(--input) / <alpha-value>)',
				ring: 'hsl(var(--ring) / <alpha-value>)',
				background: 'hsl(var(--background) / <alpha-value>)',
				foreground: 'hsl(var(--foreground) / <alpha-value>)',
				primary: {
					DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
					foreground: 'hsl(var(--primary-foreground) / <alpha-value>)'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
					foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
					foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
					foreground: 'hsl(var(--muted-foreground) / <alpha-value>)'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
					foreground: 'hsl(var(--accent-foreground) / <alpha-value>)'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
					foreground: 'hsl(var(--popover-foreground) / <alpha-value>)'
				},
				card: {
					DEFAULT: 'hsl(var(--card) / <alpha-value>)',
					foreground: 'hsl(var(--card-foreground) / <alpha-value>)'
				},
				// Langit Malang accent: the sky band and the Marker only.
				sky: {
					DEFAULT: 'hsl(var(--sky) / <alpha-value>)',
					wash: 'hsl(var(--sky-wash) / <alpha-value>)'
				}
			},
			// One sans (Onest), quiet sizes: 15/24 body, 24px page titles; hierarchy is colour first, weight second.
			fontSize: {
				xs: ['0.75rem', { lineHeight: '1rem' }],
				caption: ['0.75rem', { lineHeight: '1.125rem' }],
				small: ['0.8125rem', { lineHeight: '1.25rem' }],
				body: ['0.9375rem', { lineHeight: '1.5rem' }],
				prose: ['1rem', { lineHeight: '1.75rem' }],
				lead: ['1rem', { lineHeight: '1.625rem' }],
				h4: ['0.9375rem', { lineHeight: '1.5rem', fontWeight: '500' }],
				h3: ['0.9375rem', { lineHeight: '1.5rem', fontWeight: '500' }],
				h2: ['0.9375rem', { lineHeight: '1.5rem', fontWeight: '500' }],
				h1: ['1.5rem', { lineHeight: '2rem', fontWeight: '500', letterSpacing: '-0.015em' }],
				display: ['1.5rem', { lineHeight: '2rem', fontWeight: '500', letterSpacing: '-0.015em' }],
				numeral: ['1.75rem', { lineHeight: '2rem', fontWeight: '500', letterSpacing: '-0.015em' }]
			},
			// Radius grows with surface size: fields and buttons md/lg, tiles 2xl, dots and switches full.
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 0.25rem)',
				sm: 'calc(var(--radius) - 0.5rem)'
			},
			// Named so the class is not ambiguous with tailwindcss-animate's animation duration (which drops `duration-[var(...)]`).
			transitionDuration: {
				press: "var(--dur-press)",
				ui: "var(--dur-ui)",
				sheet: "var(--dur-sheet)",
			},
			transitionTimingFunction: {
				out: 'var(--ease-out)'
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
