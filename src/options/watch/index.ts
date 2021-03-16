import { Option } from "../../@types/option";

export const WatchOption: Option = {
  register(program) {
    program.option("-w, --watch", "watch and update your current stonk symbols")
  },
  handle(options) {
    if (options.watch) {
      console.log("watch update: update terminal here")
    }
  }
}