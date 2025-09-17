import { FilePath, joinSegments, slugifyFilePath } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import path from "path"
import fs from "fs"
import { glob } from "../../util/glob"
import DepGraph from "../../depgraph"
import { Argv } from "../../util/ctx"
import { QuartzConfig } from "../../cfg"
import sharp from "sharp"

interface ImageVariant {
  width: number
  suffix: string
  format?: keyof sharp.FormatEnum
}

const defaultImageVariants: ImageVariant[] = [
  { width: 480, suffix: "-sm", format: "webp" },
  { width: 1024, suffix: "-md", format: "webp" },
  { width: 1920, suffix: "-lg", format: "webp" },
]

const filesToCopy = async (argv: Argv, cfg: QuartzConfig) => {
  // glob all non MD files in content folder and copy it over
  return await glob("**", argv.directory, ["**/*.md", ...cfg.configuration.ignorePatterns])
}

const generateImageVariants = async (argv: Argv, fp: FilePath) => {
  const src = joinSegments(argv.directory, fp) as FilePath

  const name = slugifyFilePath(fp)
  const ext = path.extname(name)
  const baseName = name.slice(0, name.length - ext.length)
  const dir = path.dirname(name) as FilePath

  const destDir = joinSegments(argv.output, dir) as FilePath
  await fs.promises.mkdir(destDir, { recursive: true })

  const variants = defaultImageVariants.map(async (variant) => {
    const outPath = joinSegments(argv.output, `${baseName}${variant.suffix}.webp`) as FilePath
    console.log(outPath)
    await sharp(src).resize({ width: variant.width }).toFormat("webp").toFile(outPath)
    return outPath
  })

  return await Promise.all(variants)
}

export const Assets: QuartzEmitterPlugin = () => {
  return {
    name: "Assets",
    getQuartzComponents() {
      return []
    },
    async getDependencyGraph(ctx, _content, _resources) {
      const { argv, cfg } = ctx
      const graph = new DepGraph<FilePath>()

      const fps = await filesToCopy(argv, cfg)

      for (const fp of fps) {
        const ext = path.extname(fp)
        const src = joinSegments(argv.directory, fp) as FilePath
        const name = (slugifyFilePath(fp as FilePath, true) + ext) as FilePath

        const dest = joinSegments(argv.output, name) as FilePath

        graph.addEdge(src, dest)
      }

      return graph
    },
    async emit({ argv, cfg }, _content, _resources): Promise<FilePath[]> {
      const assetsPath = argv.output
      const fps = await filesToCopy(argv, cfg)
      const res: FilePath[] = []
      for (const fp of fps) {
        const ext = path.extname(fp)
        const src = joinSegments(argv.directory, fp) as FilePath
        const name = (slugifyFilePath(fp as FilePath, true) + ext) as FilePath

        const dest = joinSegments(assetsPath, name) as FilePath
        const dir = path.dirname(dest) as FilePath
        await fs.promises.mkdir(dir, { recursive: true }) // ensure dir exists
        if ([".jpg", ".jpeg", ".png"].includes(path.extname(fp))) {
          generateImageVariants(argv, fp)
        }
        await fs.promises.copyFile(src, dest)
        res.push(dest)
      }

      return res
    },
  }
}
