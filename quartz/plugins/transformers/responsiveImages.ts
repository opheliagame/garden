import { QuartzTransformerPlugin } from "../types"
import { visit } from "unist-util-visit"
import { Root as HtmlRoot } from "hast"
import isAbsoluteUrl from "is-absolute-url"
import path from "path"

export const ResponsiveImages: QuartzTransformerPlugin = () => {
  return {
    name: "ResponsiveImages",
    htmlPlugins() {
      return [
        () => async (tree: HtmlRoot) => {
          visit(tree, "element", (node) => {
            if (node.tagName !== "img" || !node.properties) return
            const srcProp = node.properties.src
            if (!srcProp || typeof srcProp !== "string") return
            if (!srcProp || isAbsoluteUrl(srcProp)) return

            node.properties.srcset = [
              `${srcProp.replace(path.extname(srcProp), "-sm.webp")} 480w`,
              `${srcProp.replace(path.extname(srcProp), "-md.webp")} 1024w`,
              `${srcProp.replace(path.extname(srcProp), "-lg.webp")} 1920w`,
            ].join(", ")
            node.properties.sizes = "(max-width: 600px) 480px, (max-width: 1200px) 1024px, 1920px"
          })
        },
      ]
    },
  }
}
