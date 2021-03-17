import commander from "commander"

export type Option = {
  register(program: commander.Command): void
  handle(options: commander.OptionValues): void
}