import ora from "ora";
import yahooFinance from "yahoo-finance2"
import { Option } from "../../@types/option";
import { readConfig } from "../../config";
import { convertToCurrency } from "../../utils/convertToCurrency";

export const PeekOption: Option = {
  register(program) {
    program.option(
      "-p, --peek",
      "peek into your stonks, quick check on your tendies"
    )
  },
  async handle(options) {
    if (options.peek) {
      await peekIntoData()
    }
  }
}

const peekIntoData = async () => {
  const spinner = ora("Loading config…").start()
  const { stocks } = readConfig()

  const symbols = stocks.map((stock: any) => stock.symbol)

  spinner.info(`Loading ${symbols.length} stocks`)

  const response = await Promise.all(symbols.map((symbol: string) => yahooFinance.quote(symbol)))

  spinner.succeed('Yas got it')

  console.table(
    response.map((result: any, index) => {
      const stock = stocks[index]

      return {
        Name: stock.symbol,
        Price: convertToCurrency(result.regularMarketPrice),
        Sum: convertToCurrency(result.regularMarketPrice * stock.shares)
      }
    })
  )
}