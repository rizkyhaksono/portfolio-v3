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
				// Notion's translucent hover and selected fills, from the text colour so they work on page, sidebar and menus.
				tint: {
					DEFAULT: 'hsl(var(--foreground) / 0.06)',
					strong: 'hsl(var(--foreground) / 0.1)'
				},
				// Langit Malang: the home cover and the text selection only.
				sky: {
					DEFAULT: 'hsl(var(--sky) / <alpha-value>)',
					wash: 'hsl(var(--sky-wash) / <alpha-value>)'
				}
			},
			// One sans (Onest) on a Notion scale: 14px UI (sidebar, tables, properties, controls), 16/24 page text,
			// 40px bold page titles, 30/24/20 headings at 600.
			fontSize: {
				xs: ['0.75rem', { lineHeight: '1rem' }],
				caption: ['0.75rem', { lineHeight: '1rem' }],
				small: ['0.875rem', { lineHeight: '1.25rem' }],
				body: ['1rem', { lineHeight: '1.5rem' }],
				prose: ['1rem', { lineHeight: '1.625rem' }],
				lead: ['1rem', { lineHeight: '1.5rem' }],
				h4: ['1rem', { lineHeight: '1.5rem', fontWeight: '600' }],
				h3: ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
				h2: ['1.5rem', { lineHeight: '2rem', fontWeight: '600', letterSpacing: '-0.01em' }],
				h1: ['1.875rem', { lineHeight: '2.375rem', fontWeight: '600', letterSpacing: '-0.015em' }],
				title: ['2rem', { lineHeight: '2.5rem', fontWeight: '700', letterSpacing: '-0.02em' }],
				display: ['2.5rem', { lineHeight: '3rem', fontWeight: '700', letterSpacing: '-0.02em' }],
				numeral: ['2rem', { lineHeight: '2.5rem', fontWeight: '600', letterSpacing: '-0.015em' }]
			},
			// Notion radii: 6px controls and menu rows (md), 10px cards, images and floating layers (lg), 4px tags (rounded).
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
