import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';
import typography from '@tailwindcss/typography';

export default {
  content: ["./src/app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
      lineHeight: {
        normal: "180%",
      },
      letterSpacing: {
        normal: "-0.32px",
      },
      fontFamily: {
        mono: ["Geist Mono", "Courier New", ...defaultTheme.fontFamily.sans],
      },

      colors: {
        black: "var(--base00)",
        white: "var(--base04)",
        gray: "var(--base02)",
        muted: "var(--base02)",
        pink: "var(--base0A)",
        blue: "var(--base0F)",

        base: {
          '00': 'var(--base00)',
          '01': 'var(--base01)',
          '02': 'var(--base02)',
          '03': 'var(--base03)',
          '04': 'var(--base04)',
          '05': 'var(--base05)',
          '06': 'var(--base06)',
          '07': 'var(--base07)',
          '08': 'var(--base08)',
          '09': 'var(--base09)',
          '0A': 'var(--base0A)',
          '0B': 'var(--base0B)',
          '0C': 'var(--base0C)',
          '0D': 'var(--base0D)',
          '0E': 'var(--base0E)',
          '0F': 'var(--base0F)',
        },
      },

      animation: {
        blink: "blink 1.45s infinite step-start",
      },

      keyframes: {
        blink: {
          "0%, 25%, 100%": { opacity: "1" },
          "50%, 75%": { opacity: "0" },
        },
      },

      typography: (theme: (acc: string) => string) => ({
        DEFAULT: {
          css: {
            color: theme('colors.white'),

            a: {
              color: theme('colors.pink'),
            },

            h1: {
              color: theme('colors.white'),
              fontSize: '1em',
              '&::before': {
                content: '"# " / "" !important',
                color: 'var(--base03)',
              },
            },

            h2: {
              color: theme('colors.white'),
              fontSize: '1em',
              '&::before': {
                content: '"## " / "" !important',
                color: 'var(--base03)',
              },
            },

            h3: {
              color: theme('colors.white'),
              fontSize: '1em',
              '&::before': {
                content: '"### " / "" !important',
                color: 'var(--base03)',
              },
            },

            hr: {
              'border-color': 'var(--base02)',
              'width': 'calc(100vw - 1em)',
              'margin': '2em -1.25em',
            },

            blockquote: {
              "border-inline-start-color": 'var(--base03)',
              "font-style": "normal",
              p: {
                color: 'var(--base04)',
              },
            },

            pre: {
              "background-color": 'var(--base00)',
              "border": '1px solid var(--base02)',
              'border-radius': '0',
            },

            code: {
              color: 'var(--base0E)',
              '&::before': {
                content: '"" !important',
              },
              '&::after': {
                content: '"" !important',
              },
            },
          },
        },
      }),
    },
	},
	plugins: [
    typography,
  ],
} satisfies Config;
