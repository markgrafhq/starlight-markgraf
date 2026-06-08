# @markgrafhq/starlight-markgraf

Astro/Starlight integration for embedding [markgraf](https://github.com/markgrafhq) animations.

## Install

```bash
npm install @markgrafhq/starlight-markgraf @markgrafhq/markgraf-react @astrojs/react react react-dom
```

## Configure

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import starlight from "@astrojs/starlight";
import markgraf from "@markgrafhq/starlight-markgraf";

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
keyframe v1 {
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
import Markgraf from "@markgrafhq/starlight-markgraf/Markgraf.astro";
---

<Markgraf src={`seed 1\nkeyframe v1 { +node a "A" }`} />
```
