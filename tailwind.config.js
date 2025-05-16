/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        horizonBlue: "#2563eb", // Changed from #0d1f61 to a lighter blue
      }
    },
  },
  plugins: [],
}