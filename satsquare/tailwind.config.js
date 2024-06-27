/** @type {import('tailwindcss').Config} */
const flowbite = require("flowbite-react/tailwind");
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Including the `app` directory
    './pages/**/*.{js,ts,jsx,tsx,mdx}', // Including the `pages` directory
    './components/**/*.{js,ts,jsx,tsx,mdx}', // Including the `components` directory
    './src/**/*.{js,ts,jsx,tsx,mdx}', // Including the `src` directory
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}', // Including Flowbite React components
    flowbite.content(),
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3037ce",
        main: "#5178e6",
        action: "#F8D99B",
        secondary: "#001473",
      },
    },
  },
  safelist: [
    "grid-cols-4",
    "grid-cols-3",
    "grid-cols-2",
    {
      pattern: /bg-(red|blue|yellow|green)/,
    }
  ],
  plugins: [
    flowbite.plugin(),
  ],
}
