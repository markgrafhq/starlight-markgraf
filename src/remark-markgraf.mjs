import { visit } from "unist-util-visit";

const importNode = {
  type: "mdxjsEsm",
  value: 'import Markgraf from "@markgrafhq/markgraf-starlight/Markgraf.astro";',
  data: {
    estree: {
      type: "Program",
      sourceType: "module",
      body: [
        {
          type: "ImportDeclaration",
          specifiers: [
            {
              type: "ImportDefaultSpecifier",
              local: { type: "Identifier", name: "Markgraf" },
            },
          ],
          source: {
            type: "Literal",
            value: "@markgrafhq/markgraf-starlight/Markgraf.astro",
            raw: '"@markgrafhq/markgraf-starlight/Markgraf.astro"',
          },
        },
      ],
    },
  },
};

export default function remarkMarkgraf() {
  return (tree) => {
    let needsImport = false;

    visit(tree, "code", (node, index, parent) => {
      if (node.lang !== "markgraf" || !parent || index == null) return;

      needsImport = true;

      parent.children[index] = {
        type: "mdxJsxFlowElement",
        name: "Markgraf",
        attributes: [
          { type: "mdxJsxAttribute", name: "src", value: node.value },
        ],
        children: [],
      };
    });

    if (needsImport) tree.children.unshift(importNode);
  };
}
