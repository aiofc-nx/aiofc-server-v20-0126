import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Aiofc Nest Server",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Technologies", link: "/technologies/pnpm" },
    ],

    sidebar: [
      {
        text: "提交与日志",
        items: [{ text: "Log：01", link: "/commits/log-01" }],
      },
      {
        text: "Log：02",
        items: [{ text: "Log：02", link: "/commits/log-02" }],
      },

      {
        text: "Technologies",
        items: [
          { text: "pnpm", link: "/technologies/pnpm" },
          { text: "git-hooks", link: "/technologies/git/git-hooks" },
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
          { text: "VitePress", link: "/technologies/vitepress" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
