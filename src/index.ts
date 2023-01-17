import puppeteer from "puppeteer"

async function main() {
    
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto('https://www.ufc.com.br/')

    const html = page.$eval('html', tag => tag.innerHTML)

    return html

}

main().then(console.log)