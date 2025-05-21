/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      sm: "375px",
      md: "1440px",
    },
    extend: {
      colors: {
        // Primary
        cyan: "hsl(180, 66%, 49%)",
        "dark-violet": "hsl(257, 27%, 26%)",

        // Secondary
        red: "hsl(0, 87%, 67%)",

        // Neutral
        gray: "hsl(0, 0%, 75%)",
        "light-gray": "hsl(239deg 29% 95%)",
        "grayish-violet": "hsl(257, 7%, 63%)",
        "very-dark-blue": "hsl(255, 11%, 22%)",
        "very-dark-violet": "hsl(260, 8%, 14%)",
      },
      fontFamily: {
        sans: [
          "Poppins",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
      fontSize: {
        base: "18px",
      },
      fontWeight: {
        medium: "500",
        bold: "700",
      },
      backgroundImage: {
        "working-illustration": "url('/src/assets/images/illustration-working.svg')",
        "shorten-mobile": "url('/src/assets/images/bg-shorten-mobile.svg')",
        "shorten-desktop": "url('/src/assets/images/bg-shorten-desktop.svg')",
        "boost-mobile": "url('/src/assets/images/bg-boost-mobile.svg')",
        "boost-desktop": "url('/src/assets/images/bg-boost-desktop.svg')",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
