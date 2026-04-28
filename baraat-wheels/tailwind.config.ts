// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {

  darkMode: "class",

  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],

  // theme: {
  //   extend: {
  //     colors: {
  //       'gold': '#FFD700',
  //       'maroon': '#8B0000',
  //       'saffron': '#FF9933',
  //       'royal-blue': '#4169E1',
  //     },
  //     animation: {
  //       'gradient': 'gradient 3s ease infinite',
  //       'float': 'float 6s ease-in-out infinite',
  //       'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
  //       'bounce-slow': 'bounce 3s infinite',
  //     },
  //     keyframes: {
  //       gradient: {
  //         '0%, 100%': {
  //           'background-size': '200% 200%',
  //           'background-position': 'left center'
  //         },
  //         '50%': {
  //           'background-size': '200% 200%',
  //           'background-position': 'right center'
  //         }
  //       },
  //       float: {
  //         '0%, 100%': { transform: 'translateY(0)' },
  //         '50%': { transform: 'translateY(-20px)' }
  //       },
  //       'pulse-glow': {
  //         '0%, 100%': { opacity: 1 },
  //         '50%': { opacity: 0.5 }
  //       }
  //     },
  //     backgroundImage: {
  //       'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  //       'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
  //     }
  //   },
  // },
  // plugins: [],
  
  theme: {
    extend: {
      colors: {
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
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },

  plugins: [],
  
};

export default config;