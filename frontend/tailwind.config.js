module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#00406E",    // الأزرق الأساسي من اللوجو
        secondary: "#C5922E",  // الذهبي
        bgLight: "#F7F6F2",    // الخلفية Off-white
      },
      fontFamily: {
        arabic: ['Cairo', 'sans-serif'],
      }
    },
  },
  plugins: [],
}