/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",

  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        slideInFromBottom: {
          "0%": { transform: "translateY(80vh)", opacity: "0" }, // Starting from the bottom of the viewport
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "slide-in-bottom": "slideInFromBottom 2s ease-out",
      },
    },
  },
  
  plugins: [],
};
