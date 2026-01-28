/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF8A3D", // orange
          dark: "#7D4427",    // brown
          light: "#FFF8F0",   // cream
        },
      },
    },
  },
  plugins: [],
};
