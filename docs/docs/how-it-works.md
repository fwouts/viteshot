---
sidebar_position: 7
---

# How ViteShot Works

In order to take screenshots as fast as possible, ViteShot generates a virtual app that imports every screenshot file in your codebase and spins it up with [Vite](https://vitejs.dev).

It then loads the page and iterates through all screenshot scenarios in a loop, taking a screenshot for each.

This means that all screenshots are taken in a single page load, ensuring that no resources are wasted on additional code parsing and execution, page reloads and so on.
