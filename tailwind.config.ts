import { type Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderWidth: {
        12: "12px",
      },
      margin: {
        0.2: "0.2rem",
        112: "28rem",
        116: "29rem",
        120: "30rem",
        124: "31rem",
        128: "32rem",
        131: "32rem",
        132: "33rem",
        136: "34rem",
        140: "35rem",
        144: "36rem",
      },
      width: {
        "4/12+12px": "35.7% ",
        "1/36": "2.6%",
        "12+5/12": "44.2%",
      },
      height: {
        "100%": "500px",
      },
    },
  },
  plugins: [],
} satisfies Config;
