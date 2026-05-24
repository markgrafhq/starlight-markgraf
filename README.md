# @markgrafhq/markgraf-starlight

Astro/Starlight integration for embedding [markgraf](https://github.com/markgrafhq) animations.

## Install

```bash
npm install @markgrafhq/markgraf-starlight @markgrafhq/markgraf-react @astrojs/react react react-dom
```

## Configure

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import starlight from "@astrojs/starlight";
import markgraf from "@markgrafhq/markgraf-starlight";

export default defineConfig({
  integrations: [react(), starlight({ title: "Docs" }), markgraf()],
});
```

Import the player CSS in a global stylesheet:

```css
@import "@markgrafhq/markgraf-react/dist/markgraf-react.css";
```

## Use

Fenced code blocks with the `markgraf` language render as live players:

````markdown
```markgraf
seed 1
frame v1 {
  +node client "Client"
  +node api    "API"
  +edge client api
  client -> api "GET /user/42"
}
```
````

Or use the component directly in MDX/Astro:

```astro
---
import Markgraf from "@markgrafhq/markgraf-starlight/Markgraf.astro";
---

<Markgraf src={`seed 1\nframe v1 { +node a "A" }`} />
```
