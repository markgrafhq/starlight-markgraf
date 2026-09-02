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
@import "@markgrafhq/starlight-markgraf/css";
```

## Use

Fenced code blocks with the `markgraf` language render as live players:

````markdown
```markgraf
seed 1
scene v1 {
  + client: Client
  + api: API
  + client -> api
  client ~> api: GET /user/42
}
```
````

Or use the component directly in MDX/Astro:

```astro
---
import Markgraf from "@markgrafhq/starlight-markgraf/Markgraf.astro";
---

<Markgraf src={`seed 1\nscene v1 { + a: A }`} />
```

Players include the floating play, scrub, time, and speed controls by default.
The Astro component accepts `controls={false}` when a page should hide them.

Custom controls belong in a React island so the control function stays in the
browser rather than crossing Astro's serialization boundary:

```tsx
import { StarlightMarkgrafPlayer } from "@markgrafhq/starlight-markgraf";

export const Diagram = ({ src }: { src: string }) => (
  <StarlightMarkgrafPlayer
    src={src}
    controls={(api) => <MyDiagramControls api={api} />}
  />
);
```
