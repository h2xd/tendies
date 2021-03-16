import { writeFileSync, copyFileSync } from "fs";
import { join } from "path"
import { Option } from "../../@types/option";

export const ExportOption: Option = {
  register(program) {
    program.option(
      "-e, --export",
      "export your tendies file, to share it with your ape gang"
    )
    program.option(
      "--dummy <file>",
      "Get a default JSON configuration - That you can fill up with your wifes boyfriend."
    )
  },
  handle(options) {
    if (options.import) {
      console.log(options)
    }

    if (options.dummy) {
      try {
        writeFileSync(
          options.dummy,
          require('./defaultDataset.json'),
          {encoding: "utf8", flag: "w"}
        )

        // File destination.txt will be created or overwritten by default.
        copyFileSync(join(__dirname, 'defaultDataset.json'), options.dummy)
        console.log(`${options.dummy} was created`);
      } catch (error) {
        console.error(error)
      }
    }
  }
}