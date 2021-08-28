<p align="center">
  <img src="https://raw.githubusercontent.com/zenclabs/viteshot/main/docs/static/img/logo.png" alt="logo" width="200" />
</p>
<br/>
<p align="center">
  <a href="https://www.npmjs.com/package/viteshot">
    <img src="https://badge.fury.io/js/viteshot.svg" alt="npm" />
  </a>
  <a href="https://www.npmjs.com/package/viteshot">
    <img src="https://img.shields.io/npm/l/viteshot.svg" alt="license" />
  </a>
</p>
<br />

# Viteshot 📸

Viteshot is a fast and simple component screenshot tool based on [Vite](https://vitejs.dev).

It supports Preact, React, Solid, Svelte and Vue 3.

## Installation

```sh

# Install Viteshot.
npm install --save-dev viteshot # NPM
yarn add -D viteshot # Yarn
pnpm add -D viteshot # PNPM

# Set up Viteshot configuration in your repository.
viteshot init
```

## Documentation

Please refer to the [documentation](https://viteshot.com) for the full documentation.

## Examples

All you need is to export UI components from files with the `.screenshot.jsx/tsx/vue/svelte` extension.

See examples:

- [Preact](https://github.com/zenclabs/viteshot/blob/main/examples/preact/src/App.screenshot.tsx)
- [React](https://github.com/zenclabs/viteshot/blob/main/examples/react-tsx/src/App.screenshot.tsx)
- [Solid](https://github.com/zenclabs/viteshot/blob/main/examples/solid/src/App.screenshot.tsx)
- [Svelte](https://github.com/zenclabs/viteshot/blob/main/examples/svelte/src/lib/Counter.screenshot.svelte)
- [Vue](https://github.com/zenclabs/viteshot/blob/main/examples/vue/src/components/HelloWorld.screenshot.vue)

Then, generate screenshots with:

```sh
# Take screenshots.
viteshot
> Capturing: src/__screenshots__/darwin/pixel2/App-App.png
> Capturing: src/__screenshots__/darwin/laptop/App-App.png
> Capturing: src/__screenshots__/darwin/pixel2/App-Clicked.png
> Capturing: src/__screenshots__/darwin/laptop/App-Clicked.png
> Capturing: src/__screenshots__/darwin/pixel2/App-Greet.png
> Capturing: src/__screenshots__/darwin/laptop/App-Greet.png
> Capturing: src/__screenshots__/darwin/laptop/App-HelloWorld.png
> Capturing: src/__screenshots__/darwin/pixel2/App-HelloWorld.png
> All done.
```

## License

MIT
