import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      screens: {
        xs: "420px",
      },
      colors: {
        base: {
          950: "#05060f",
          900: "#0a0e27",
          850: "#0d1230",
          800: "#111737",
          700: "#1a2148",
        },
        brand: {
          50: "#eef1ff",
          100: "#dbe1ff",
          200: "#c2caff",
          300: "#9aa6ff",
          400: "#6d7dff",
          500: "#4356fd",
          600: "#3142e0",
          700: "#2532b3",
        },
        accent: {
          cyan: "#5ee6d8",
          deep: "#2bbfb2",
        },
        // Texto tintado desde el azul del fondo en vez de gris neutro:
        // mantiene el aire de la marca y cumple contraste AA sobre base-900.
        ink: {
          DEFAULT: "#f4f6ff",
          muted: "#a8b2d8",
          subtle: "#7f8ab5",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-sans)", "system-ui", "sans-serif"],
        // Sólo para el remate del H1 del hero: es de caja única y sin ¿ / ¡.
        // --font-hero ya trae Space Grotesk como respaldo (ver app/layout.tsx).
        hero: ["var(--font-hero)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.75rem",
      },
      boxShadow: {
        // Toda sombra lleva desplazamiento + difuminado: profundidad real,
        // no un halo de color centrado.
        card: "0 16px 36px -24px rgba(2,5,25,0.9), 0 2px 6px -3px rgba(2,5,25,0.55)",
        lift: "0 30px 64px -30px rgba(2,5,25,0.95), 0 6px 16px -8px rgba(2,5,25,0.6)",
        brand: "0 12px 32px -14px rgba(67,86,253,0.65)",
        accent: "0 10px 26px -10px rgba(94,230,216,0.5)",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        halo: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.55" },
          "50%": { transform: "scale(1.18)", opacity: "0" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "gradient-x": "gradient-x 6s ease infinite",
        float: "float 6s ease-in-out infinite",
        marquee: "marquee 32s linear infinite",
        halo: "halo 2.8s cubic-bezier(0.16, 1, 0.3, 1) infinite",
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(circle at 20% 20%, rgba(67,86,253,0.25), transparent 40%), radial-gradient(circle at 80% 0%, rgba(94,230,216,0.15), transparent 35%), linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
