---
title: Markgraf demo
---

A request flowing from client to API:

```markgraf
seed 1
frame v1 {
  +node client "Client"
  +node api    "API"
  +edge client api
  client -> api "GET /user/42"
}
```
