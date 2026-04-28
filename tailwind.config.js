/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "main": "#18181B",
        "second": "#27272A",
        "third": "#3F3F46",
        "warm-yellow": "#F2B705",
        "blue-detail": "#3B82F6",
        "white": "#ffffff",
        "off-white": "#F7F7F8"
      },
    },
  },
  plugins: [],
};