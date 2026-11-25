import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        fk: {
          blue: "#2874f0",
          blueDark: "#1259c3",
          blueLight: "#f0f5ff",
          yellow: "#ff9f00",
          yellowDark: "#e58e00",
          orange: "#fb641b",
          orangeDark: "#e25410",
          green: "#388e3c",
          greenLight: "#e8f5e9",
          grayBg: "#f1f3f6",
          border: "#e0e0e0",
          borderLight: "#f0f0f0",
          text: "#212121",
          muted: "#878787",
          star: "#388e3c",
          superPlus: "#ffe11b",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        fk: "0 1px 2px 0 rgba(0,0,0,0.1)",
        fkCard: "0 2px 4px 0 rgba(0,0,0,0.08)",
        fkHover: "0 4px 16px 0 rgba(0,0,0,0.15)",
        fkHeader: "0 1px 1px 0 rgba(0,0,0,0.16)",
      },
      maxWidth: {
        "fk-container": "1360px",
      },
    },
  },
  plugins: [],
};

export default config;
