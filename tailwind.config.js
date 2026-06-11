/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
      "./App.{js,jsx,ts,tsx}",           // <-- Includes your root App.tsx
      "./components/**/*.{js,jsx,ts,tsx}",
      "./hooks/**/*.{js,jsx,ts,tsx}",
      "./app/**/*.{js,jsx,ts,tsx}"       // If you use Expo Router
    ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}