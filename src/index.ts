import {Command} from "commander"
import {writeFileSync} from "fs"
import config from "../package.json"
import stonkDd from "./stonk-dd"

const program = new Command()

program.version(config.version)

program.option("-w, --watch", "watch and update your current stonk symbols")
program.option(
  "-p, --peek",
  "peek into your stonks, quick check on your tendies"
)
program.option(
  "-i, --import",
  "import your tendies file, or get a default file with --dummy"
)
program.option(
  "-e, --export",
  "export your tendies file, to share it with your ape gang"
)
program.option(
  "-dd, --duediligence <symbol>",
  "check wether you like this stock"
)
program.option(
  "--dummy <file>",
  "get a default dataset, that you can fill up later, with your wifes boyfriend"
)

program.parse(process.argv)

const options = program.opts()

if (options.watch) console.log(options)
console.log("watch update: update terminal here")

if (options.duediligence) {
  stonkDd(options.duediligence)
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
