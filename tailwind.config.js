/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], // Update paths based on your project structure
    theme: {
      extend: {},
    },
    plugins: [require("daisyui")], // Add DaisyUI plugin
    daisyui: {
      themes: ["light", "dark", "cupcake"], // You can change or add more themes
    },
  };
  