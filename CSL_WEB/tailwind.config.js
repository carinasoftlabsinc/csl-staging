/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        myfont: ["MyFont", "sans-serif"],
        quickSand: ["QuickSand", "sans-serif"],
        qeilab: ["Qeilab", "sans-serif"],
        mont: ["Montserrat", "sans-serif"],
        bebas: ["BebasNeue", "sans-serif"],
        anton: ["Anton", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      animation: {
        "infinite-scroll": "infinite-scroll 10s linear infinite",
        slideIn: "slideIn 0.5s ease-in-out forwards",
      },
      keyframes: {
        "infinite-scroll": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },

        slideIn: {
          "0%": { transform: "translateX(-100%)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
      },
    },
  },

  plugins: [require("tailwind-scrollbar-hide"), require("daisyui")],

  // The site is designed light only. Without this, DaisyUI switches the page background to its dark
  // theme when the visitor's device is in dark mode (visible below short pages such as the 404 page).
  daisyui: {
    themes: ["light"],
  },
};
