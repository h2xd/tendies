import { Command } from "commander"
import config from "../package.json"
import { Option } from "./@types/option";
import { ImportOption, ExportOption, PeekOption, WatchOption, DDOption } from './options'

const programOptions: Option[] = [
  ImportOption,
  ExportOption,
  PeekOption,
  WatchOption,
  DDOption
]

const program = new Command()

program.version(config.version)

programOptions.forEach((option) => {
  option.register(program)
})

program.parse(process.argv)

const options = program.opts()

programOptions.forEach((option) => {
  option.handle(options)
})
