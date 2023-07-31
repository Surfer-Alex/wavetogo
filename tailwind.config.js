/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      orbitron: '"Orbitron"',
      "bebas-neue": '"Bebas Neue"',
      "permanent-marker": '"Permanent Marker"',
    },
    extend: {
      width: {
        "16%": "16%",
        "32%": "32%",
        "35%": "35%",
        "45%": "45%",
        "48%": "48%",
        negativeGap: "calc((100% - 24px)/2)",
      },

      height: {
        negativeHeader: "calc(100vh - 80px)",
        negativeHeaderFooter: "calc(100vh - 160px)",
        negativeSearchBar: "calc(100% - 80px)",
      },
      animation: {
        text: "text 5s ease infinite",
      },
      keyframes: {
        text: {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
      },
    },
  },
  plugins: [],
};
