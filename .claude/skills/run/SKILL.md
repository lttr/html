---
name: run
description: Start a local static server for artifacts/ to preview pages. Use when asked to run, serve, start, or preview the site.
---

Serve `artifacts/` as is (no build step), in the background:

```bash
vpx serve artifacts -l tcp://127.0.0.1:4717 -n
```

Open http://localhost:4717/ (or `/<slug>/` for a single artifact). If 4717 is taken, `serve` picks another port and prints it.
