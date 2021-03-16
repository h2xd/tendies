import { readFileSync, stat } from "fs"
import { Option } from "../../@types/option";
import { writeConfig } from "../../config";

export const ImportOption: Option = {
  register(program) {
    program.option(
      "--import <file>",
      "import your tendies file"
    )
  },
  handle(options) {
    if (options.import) {
      stat(options.import, (err) => {
        if (err === null) {
          const config = readFileSync(options.import, { encoding: "utf8" })
          writeConfig(config)
          return
        }

        if (err.code === 'ENOENT') {
          console.error('file does not exist')
          return
        }

        console.log('Some other error: ', err.code);
      });
    }
  }
}