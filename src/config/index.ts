import { join } from "path"
import { readFileSync, writeFileSync } from "fs";

export const CONFIG_PATH = join(__dirname, '.tendies.config')

export function readConfig() {
  const configString = readFileSync(CONFIG_PATH).toString()
  return JSON.parse(configString)
}

export function writeConfig(contents: string) {
  writeFileSync(CONFIG_PATH, contents, { flag: "w", encoding: "utf8" })
}