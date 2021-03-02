const puppeteer = require("puppeteer")
const cheerio = require("cheerio")
const ora = require("ora")

const ddUrls: Map<String, String> = new Map([
  [
    "MARKETBEAT",
    "https://www.marketbeat.com/stocks/NASDAQ/{symbol}/price-target/",
  ],
  ["BARCHART", "https://www.barchart.com/stocks/quotes/{symbol}/opinion"],
  ["TIPRANKS", "https://www.tipranks.com/stocks/{symbol}/forecast"],
])

const getUrl = (symbol: string, page: string) => {
  return ddUrls.get(page).replace("{symbol}", symbol)
}

const getMarketbeatData = async (symbol: string) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(getUrl(symbol, "MARKETBEAT"), {
    waitUntil: "networkidle2",
  })

  const content = await page.content()

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

  await browser.close()
  return {rating, price: price}
}

// const getBarchartData = async (symbol: string) => {
//   const opinionPage = await fetchHtml(getUrl(symbol, "BARCHART"))
//   const selectorOpinion = cheerio.load(opinionPage)
//   const opinion = selectorOpinion("div[class='opinion-status']")
//     .find("span")
//     .text()
//     .trim()

//   return {rating: opinion}
// }

// const getTipranksData = async (symbol: string) => {
//   const page = await fetchHtml(getUrl(symbol, "TIPRANKS"))
//   const selector = cheerio.load(page)
//   const rating = selector(
//     "p[class='client-components-stock-research-analysts-analyst-consensus-style__actualConsensus']"
//   )
//     .text()
//     .trim()

//   const price = selector(
//     "div[class='client-components-stock-research-analysts-price-target-style__actualMoney']"
//   )
//     .text()
//     .trim()
//   return {rating, price}
// }

const stonkDd = async (symbol: string) => {
  console.log(`${symbol} GOOD! WE LIKE THIS STOCK!`)
  const spinner = ora("Getting directions to moon…").start()
  const mb = await getMarketbeatData(symbol)
  // const bc = await getBarchartData(symbol)
  // const tr = await getTipranksData(symbol)
  // console.log({marketbeat: mb, barchart: bc, tipranks: tr})
  spinner.succeed("Ready for lift-off")
  console.log({marketbeat: mb})
}

export default stonkDd
