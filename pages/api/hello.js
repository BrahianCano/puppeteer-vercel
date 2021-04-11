// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const puppeteer = require('puppeteer');


export default async function handler(req, res) {
    if (req.method === 'POST') {
        const {body} = req;

        const chromeOptions = {
            headless: true,
            defaultViewport: null,
            args: [
                "--incognito",
                "--no-sandbox",
                "--single-process",
                "--no-zygote"
            ],
        };

        const browser = await puppeteer.launch(chromeOptions);
        const page = await browser.newPage();
        await page.goto(body.url, {
            timeout: 99999,
                waitUntil: "networkidle2",
        });

        const searchValue = await page.$eval('h1', el => el.textContent);

        await browser.close();

        res.status(200).json({H1: searchValue})

    }
}
