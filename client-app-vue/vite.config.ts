import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Unocss from "unocss/vite";
import { presetWind } from "unocss";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), Unocss(presetWind())],
});
