import type { AstroIntegration } from "astro";
import remarkMarkgraf from "./remark-markgraf.mjs";

export { remarkMarkgraf };

export default function markgrafIntegration(): AstroIntegration {
  return {
    name: "markgraf-starlight",
    hooks: {
      "astro:config:setup": ({ updateConfig }) => {
        updateConfig({
          markdown: {
            remarkPlugins: [remarkMarkgraf],
          },
        });
      },
    },
  };
}
