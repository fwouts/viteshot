import playwright from "viteshot/shooters/playwright";

export default {
  framework: "svelte",
  browser: playwright(),
};
