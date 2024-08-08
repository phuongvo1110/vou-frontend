/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        success: "#22c55e",
        warning: "#fb923c",
        danger: "#ef4444",
      },
    },
  },
  plugins: [],
};
