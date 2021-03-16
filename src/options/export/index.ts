import { copyFileSync } from "fs";
import { join } from "path"
import { Option } from "../../@types/option";
import { CONFIG_PATH } from "../../config";

export const ExportOption: Option = {
  register(program) {
    program.option(
      "-e, --export <file>",
      "export your tendies file, to share it with your ape gang"
    )
    program.option(
      "--dummy <file>",
      "Get a default JSON configuration - That you can fill up with your wifes boyfriend."
    )
  },
  handle(options) {
    if (options.export) {
      try {
        copyFileSync(CONFIG_PATH, options.export)
        console.log(`${options.export} was created`);
      } catch (error) {
        console.error(error)
      }
    }

    if (options.dummy) {
      try {
        // File destination.txt will be created or overwritten by default.
        copyFileSync(join(__dirname, 'defaultDataset.json'), options.dummy)
        console.log(`${options.dummy} was created`);
      } catch (error) {
        console.error(error)
      }
    }
  }
}