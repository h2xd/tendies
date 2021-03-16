import { Option } from "../../@types/option";

export const PeekOption: Option = {
  register(program) {
    program.option(
      "-p, --peek",
      "peek into your stonks, quick check on your tendies"
    )
  },
  handle(options) {
    if (options.peek) {
      console.log('peek peek')
    }
  }
}