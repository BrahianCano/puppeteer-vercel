// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const chromium = require("chrome-aws-lambda")
const SEO_RESOLUTION = { width: 1200, height: 630 }


export default async function handler(req, res) {
    if (req.method === 'POST') {
        const {body} = req;

        const browser = await chromium.puppeteer.launch({
            args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: true,
            ignoreHTTPSErrors: true,
        })

        const page = await browser.newPage()
        page.setViewport(SEO_RESOLUTION)
        await page.goto(body.url,{ waitUntil: "networkidle0" });

        const searchValue = await page.$eval('h1', el => el.textContent);

        await browser.close();

        res.status(200).json({H1: searchValue})

    }
}
