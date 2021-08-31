const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: "ViteShot",
  tagline: "Generate screenshots of UI components within seconds",
  url: "https://viteshot.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",
  favicon: "img/logo.png",
  organizationName: "zenclabs",
  projectName: "viteshot",
  scripts: [
    {
      src: "https://viteshot.com/js/script.js",
      async: true,
      defer: true,
      "data-domain": "viteshot.com",
    },
  ],
  themeConfig: {
    image: "img/og-image.png",
    navbar: {
      title: "ViteShot",
      logo: {
        alt: "ViteShot Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "doc",
          docId: "getting-started",
          position: "right",
          label: "Guide",
        },
        {
          type: "doc",
          docId: "config/overview",
          position: "right",
          label: "Config",
        },
        {
          href: "https://github.com/zenclabs/viteshot",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      copyright: `MIT Licensed | Copyright © ${new Date().getFullYear()} Zenc Labs Pty Ltd, Inc. Built with Docusaurus + unDraw.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.ts"),
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
};
