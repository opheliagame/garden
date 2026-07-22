import { loadQuartzConfig } from "./quartz/plugins/loader/config-loader"
import { registerCondition } from "./quartz/plugins/loader/conditions"

registerCondition("is-index", (props) => props.fileData.slug === "index")

const config = await loadQuartzConfig()
export default config
