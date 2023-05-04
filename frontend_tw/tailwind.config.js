/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      overscrollBehavior: {
        contain: "contain",
      },
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],

  daisyui: {
    styled: true,
    themes: [
      {
        mytheme: {
          primary: "#22c55e",

          secondary: "#713f12",

          accent: "#0ea5e9",

          neutral: "#1D232F",

          "base-100": "#111827",

          info: "#d9f99d",

          success: "#15803d",

          warning: "#fde047",

          error: "#dc2626",
        },
      },
    ],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "dark",
  },
};
