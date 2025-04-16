import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4.0 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "opheliagame's digital garden",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "opheliagame.github.io/garden/",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "created",
    theme: {
      fontOrigin: "local",
      cdnCaching: false,
      typography: {
        header: "Basteleur",
        body: "Sligoil",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#ebfff0", // Airy mint background
          lightgray: "#c5ffdb", // Soft lime
          gray: "#74e291", // Vibrant green
          darkgray: "#2d9d5c", // Medium emerald
          dark: "#174029", // Deep forest
          secondary: "#ff1493", // Deep pink
          tertiary: "#d373ff", // Bright magenta-purple
          highlight: "rgba(255, 20, 147, 0.15)", // Transparent deep pink
        },
        darkMode: {
          light: "#0c2614", // Rich dark green
          lightgray: "#1a4027", // Dark emerald
          gray: "#35964b", // Medium green
          darkgray: "#84ffa8", // Bright mint
          dark: "#ddffea", // Pale mint
          secondary: "#ff47b6", // Electric pink
          tertiary: "#b73fff", // Vivid magenta
          highlight: "rgba(255, 71, 182, 0.15)", // Transparent electric pink
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "filesystem"],
      }),
      Plugin.Latex({ renderEngine: "katex" }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
