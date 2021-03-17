import { Option } from "../../@types/option";
import { writeFileSync } from "fs";

export const ExportOption: Option = {
  register(program) {
    program.option(
      "-e, --export",
      "export your tendies file, to share it with your ape gang"
    )
    program.option(
      "--dummy <file>",
      "get a default dataset, that you can fill up later, with your wifes boyfriend"
    )
  },
  handle(options) {
    if (options.import) {
      console.log(options)
    }

    if (options.dummy) {
      console.log(options)
      try {
        writeFileSync(
          options.dummy,
          JSON.stringify({
            stocks: [
              {
                symbol: "AAPL",
                averagePrice: 431,
                shares: 1,
              },
            ],
          }),
          {encoding: "utf8", flag: "w"}
        )
      } catch (error) {
        console.error(error)
      }
    }
  }
}