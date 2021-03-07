const puppeteer = require("puppeteer")
const cheerio = require("cheerio")
const ora = require("ora")
import yahooFinance from "yahoo-finance2"

type DDWebsite =
  | "MARKETBEAT"
  | "BARCHART_OPINION"
  | "BARCHART_EE"
  | "TIPRANKS"
  | "TIPRANKS_ANALYSIS"
  | "YAHOO_FINANCE"

const ddUrls: Map<DDWebsite, String> = new Map([
  [
    "MARKETBEAT",
    "https://www.marketbeat.com/stocks/NYSE/{symbol}/price-target/",
  ],
  [
    "BARCHART_OPINION",
    "https://www.barchart.com/stocks/quotes/{symbol}/opinion",
  ],
  [
    "BARCHART_EE",
    "https://www.barchart.com/stocks/quotes/{symbol}/earnings-estimates",
  ],
  ["TIPRANKS", "https://www.tipranks.com/stocks/{symbol}/forecast"],
  [
    "TIPRANKS_ANALYSIS",
    "https://www.tipranks.com/stocks/{symbol}/stock-analysis",
  ],
  [
    "YAHOO_FINANCE",
    "https://finance.yahoo.com/quote/{symbol}/analysis?p={symbol}",
  ],
])

const convertToCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

const convertToReadableDate = (date: Date | number) => {
  return new Intl.DateTimeFormat("en-US").format(date)
}

const getUrl = (symbol: string, page: DDWebsite) => {
  return ddUrls.get(page).replace("{symbol}", symbol)
}

const getWebsiteContent = async (symbol: string, website: DDWebsite) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(getUrl(symbol, website), {
    waitUntil: "networkidle2",
  })
  const content = await page.content()
  await browser.close()
  return content
}

const getMarketbeatData = async (symbol: string) => {
  const content = await getWebsiteContent(symbol, "MARKETBEAT")

  const selector = cheerio.load(content)

  const rating = selector(".scroll-table")
    .find("tbody > tr:first-of-type > td:nth-child(2)")
    .first()
    .text()
    .trim()

  const price = selector(".scroll-table")
    .find("tbody > tr:nth-of-type(4) > td:nth-child(2)")
    .first()
    .text()
    .trim()

  return {rating, priceTarget: price}
}

const getBarchartData = async (symbol: string) => {
  const content = await getWebsiteContent(symbol, "BARCHART_OPINION")
  const selectorOpinion = cheerio.load(content)
  const rating = selectorOpinion("div[class='opinion-status']")
    .find("span")
    .text()
    .trim()

  const contentPrice = await getWebsiteContent(symbol, "BARCHART_EE")
  const selectorPrice = cheerio.load(contentPrice)
  const price = selectorPrice("div[class='chart-wrapper']")
    .find("span div span")
    .first()
    .text()
    .trim()

  return {rating, priceTarget: convertToCurrency(price)}
}

const getTipranksData = async (symbol: string) => {
  const content = await getWebsiteContent(symbol, "TIPRANKS")

  const selector = cheerio.load(content)
  const rating = selector(
    "p[class='client-components-stock-research-analysts-analyst-consensus-style__actualConsensus']"
  )
    .text()
    .trim()

  const price = selector(
    "div[class='client-components-stock-research-analysts-price-target-style__actualMoney']"
  )
    .text()
    .trim()

  const analysisContent = await getWebsiteContent(symbol, "TIPRANKS_ANALYSIS")
  const selectorAnalysis = cheerio.load(analysisContent)
  const analysis = selectorAnalysis(
    "div[class='client-components-ValueChange-shape__Octagon']"
  )
    .find("text tspan")
    .text()
    .trim()
  return {rating, priceTarget: price, analysis: `${analysis}/10`}
}

const getYahooFinanceData = async (symbol: string) => {
  const result = await yahooFinance.quote(symbol)
  return {
    Name: result.displayName,
    "1 year low": convertToCurrency(result.fiftyTwoWeekRange.low),
    "1 year high": convertToCurrency(result.fiftyTwoWeekRange.high),
    "Regular market price": convertToCurrency(result.regularMarketPrice),
    "Dividend payout": convertToReadableDate(result.dividendDate),
    "Trailing annual dividend rate": convertToCurrency(
      result.trailingAnnualDividendRate
    ),
    Earnings: convertToReadableDate(result.earningsTimestamp),
  }
}

const stonkDd = async (symbol: string) => {
  console.log(`${symbol} GOOD! WE LIKE THIS STOCK!`)
  const spinner = ora("Getting directions to moon…").start()
  const mb = await getMarketbeatData(symbol)
  const bc = await getBarchartData(symbol)
  const tr = await getTipranksData(symbol)
  const yf = await getYahooFinanceData(symbol)
  console.log("\n")
  console.log("YAHOO FINANCE BASIC DATA")
  console.table(yf)
  console.log("\n")
  console.log("ANALYSIS WEBSITES")
  console.table({Marketbeat: mb, Barchart: bc, Tipranks: tr})
  spinner.succeed("Ready for lift-off")
}

export default stonkDd
