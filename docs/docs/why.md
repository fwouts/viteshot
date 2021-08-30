---
sidebar_position: 1
---

# Why ViteShot

Web development is a predominantly visual endeavour. Aside from being functional, a website has to look right.

Testing has become a must-have, especially in teams of developers. While unit testing of components is ubiquitous, it only covers the functional aspects. For example, Jest snapshot tests only tell you that the generated HTML structure is correct. They tell you nothing about a component's appearance.

Visual testing fills this gap, but it can be a complex endeavour. You can either spin up your app server and take screen-level screenshots with Cypress, Puppeteer or Playwright, or you can use Storybook in combination with Storycap or Chromatic to generate screenshots of individual components and ensure they don't change unexpectedly. These approaches require significant effort to setup. If you use Storybook, you'll also notice increasing build times as your project gets larger.

This is where ViteShot comes in. Based on [Vite](https://vitejs.dev), a super-fast webpack alternative, it can take hundreds of screenshots of individual components in a few seconds, even in a large codebase. It also requires minimal setup, so you can get on with your work.
