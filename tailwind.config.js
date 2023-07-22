/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      orbitron: '"Orbitron"',
      'bebas-neue': '"Bebas Neue"',
      'permanent-marker': '"Permanent Marker"',
    },
    extend: {
      width: {
        '16%': '16%',
        '32%': '32%',
        '45%': '45%',
        negativeGap: 'calc((100% - 24px)/2)',
      },
      // backgroundImage: (theme) => ({
      //   waves: "url('https://source.unsplash.com/ChOHCv42flI')",
      // }),
      height: {
        negativeHeader: 'calc(100vh - 80px)',
        negativeHeaderFooter: 'calc(100vh - 160px)',
        negativeSearchBar: 'calc(100% - 80px)',
      },
      // backgroundImage: {
      //   'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      //   'gradient-conic':
      //     'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      // },
    },
  },
  plugins: [],
};
