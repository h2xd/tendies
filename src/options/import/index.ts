import { Option } from "../../@types/option";

export const ImportOption: Option = {
  register(program) {
    program.option(
      "-i, --import",
      "import your tendies file, or get a default file with --dummy"
    )
  },
  handle(options) {
    if (options.import) {
      console.log(options)
    }
  }
}