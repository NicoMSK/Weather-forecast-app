import { defineConfig } from "vite";
import { resolve } from "node:path";
import createSvgSpritePlugin from "vite-plugin-svg-sprite";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  plugins: [
    createSvgSpritePlugin({
      exportType: "vanilla",
      symbolId: "sprite-[name]",
      // include: "/src/icons/**/*.svg",
      include: [resolve(__dirname, "src/icons/**/*.svg")],
    }),
  ],
});
