/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}", // Tremor module
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  darkMode: ["class"],
  theme: {
    transparent: "transparent",
    current: "currentColor",
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      height: {
        main: "calc(100vh - 147px)",
      },
      colors: {
        // tremor colors (responsive to CSS variables)
        tremor: {
          brand: {
            faint: "hsl(var(--tremor-brand-faint))",
            muted: "hsl(var(--tremor-brand-muted))",
            subtle: "hsl(var(--tremor-brand-muted))",
            DEFAULT: "hsl(var(--tremor-brand-faint))",
            emphasis: "hsl(var(--tremor-brand-faint))",
            inverted: "hsl(var(--tremor-brand-inverted))",
          },
          background: {
            muted: "hsl(var(--tremor-background-muted))",
            subtle: "hsl(var(--tremor-background-subtle))",
            DEFAULT: "hsl(var(--tremor-background))",
            emphasis: "hsl(var(--tremor-content-strong))",
          },
          border: {
            DEFAULT: "hsl(var(--tremor-border))",
          },
          ring: {
            DEFAULT: "hsl(var(--tremor-border))",
          },
          content: {
            subtle: "hsl(var(--tremor-content-subtle))",
            DEFAULT: "hsl(var(--tremor-content))",
            emphasis: "hsl(var(--tremor-content-emphasis))",
            strong: "hsl(var(--tremor-content-strong))",
            inverted: "hsl(var(--tremor-brand-inverted))",
          },
        },
        // dark mode tremor colors (same as above but for legacy support)
        "dark-tremor": {
          brand: {
            faint: "hsl(var(--tremor-brand-faint))",
            muted: "hsl(var(--tremor-brand-muted))",
            subtle: "hsl(var(--tremor-brand-muted))",
            DEFAULT: "hsl(var(--tremor-brand-faint))",
            emphasis: "hsl(var(--tremor-brand-faint))",
            inverted: "hsl(var(--tremor-brand-inverted))",
          },
          background: {
            muted: "hsl(var(--tremor-background-muted))",
            subtle: "hsl(var(--tremor-background-subtle))",
            DEFAULT: "hsl(var(--tremor-background))",
            emphasis: "hsl(var(--tremor-content-strong))",
          },
          border: {
            DEFAULT: "hsl(var(--tremor-border))",
          },
          ring: {
            DEFAULT: "hsl(var(--tremor-border))",
          },
          content: {
            subtle: "hsl(var(--tremor-content-subtle))",
            DEFAULT: "hsl(var(--tremor-content))",
            emphasis: "hsl(var(--tremor-content-emphasis))",
            strong: "hsl(var(--tremor-content-strong))",
            inverted: "hsl(var(--tremor-brand-inverted))",
          },
        },
        // shadcn
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      boxShadow: {
        // light
        navigation:
          "0 -20px 25px -5px rgba(0, 0, 0, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        about: "0px 2px 8px 0px rgba(99, 99, 99, 0.2)",
        "tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "tremor-card":
          "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "tremor-dropdown":
          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        // dark
        "dark-tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "dark-tremor-card":
          "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "dark-tremor-dropdown":
          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      },
      borderRadius: {
        "tremor-small": "var(--radius)",
        "tremor-default": "calc(var(--radius) - 2px)",
        "tremor-full": "calc(var(--radius) - 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontSize: {
        "tremor-label": ["0.75rem"],
        "tremor-default": ["0.875rem", { lineHeight: "1.25rem" }],
        "tremor-title": ["1.125rem", { lineHeight: "1.75rem" }],
        "tremor-metric": ["1.875rem", { lineHeight: "2.25rem" }],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  safelist: [
    {
      pattern:
        /^(bg-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(border-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(ring-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(stroke-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(fill-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
  ],
  plugins: [require("tailwindcss-animate"), require("@headlessui/tailwindcss")],
};
