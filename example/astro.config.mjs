import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import starlight from "@astrojs/starlight";
import markgraf from "@markgrafhq/starlight-markgraf";

export default defineConfig({
  site: "https://markgrafhq.github.io",
  base: "/starlight-markgraf/",
  integrations: [
    react(),
    starlight({
      title: "markgraf example",
      customCss: ["./src/custom.css"],
    }),
    markgraf(),
  ],
});
