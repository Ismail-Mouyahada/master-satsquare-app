import flowbite from "flowbite-react/tailwind";
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Note the addition of the `app` directory.
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
 
    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    flowbite.content(),
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3037ce",
        secondary: "#001473",
      },
    },
  },
  safelist: ["grid-cols-4", "grid-cols-3", "grid-cols-2", {
    pattern: /bg-(red|blue|yellow|green)/}],
  plugins: [flowbite.plugin()],
}