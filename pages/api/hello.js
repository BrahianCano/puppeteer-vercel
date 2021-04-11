// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const chromium = require("chrome-aws-lambda")
const SEO_RESOLUTION = {width: 1200, height: 630}


export default async function handler(req, res) {
    if (req.method === 'POST') {
        const {body} = req;

        //const cards = ["5507000000444387|03|2023|641", "4000222011347863|12|2022|494"/*, "5507000000440062|03|2023|635", "5507000000440807|03|2023|373", "5507000000441375|03|2023|511", "5507000000442548|03|2023|733", "5507000000441813|03|2023|828", "5507000000441235|03|2023|382", "5507000000448107|03|2023|433", "5507000000445822|03|2023|256"*/];
        const cards = ["4000222011341205|12|2022|494"]
        const creditCards = [];

        for (const i in cards) {

            try {

                const browser = await chromium.puppeteer.launch({
                    args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
                    defaultViewport: chromium.defaultViewport,
                    executablePath: await chromium.executablePath,
                    headless: true,
                    ignoreHTTPSErrors: true,
                })

                const page = await browser.newPage()
                page.setViewport(SEO_RESOLUTION)
                await page.goto(body.url, {waitUntil: "networkidle0"});

                var bin = cards[i].split("|")[0];
                var mounth = cards[i].split("|")[1];
                var year = cards[i].split("|")[2];
                var cvv = cards[i].split("|")[3];

                await page.waitForSelector(
                    'button[class="btn _9yfmt _194FD _2tFXQ _3yOD6 _1Qp1L _2veMA"]');
                await page.click(
                    'button[class="btn _9yfmt _194FD _2tFXQ _3yOD6 _1Qp1L _2veMA"]');
                await page.goto("https://www.express.com/bag");
                await page.waitForSelector("button#continue-to-checkout");
                await page.click("button#continue-to-checkout");
                await page.waitFor(5000);
                try {
                    await page.waitForSelector('button[class="_1UFak _2YpK4 _1f9t- _2yrqS"]');
                    await page.click('button[class="_1UFak _2YpK4 _1f9t- _2yrqS"]');
                } catch (error) {
                    await page.waitFor(5000);
                    await page.waitForSelector("button#continue-to-checkout");
                    await page.click("button#continue-to-checkout");
                    await page.waitForSelector('button[class="_1UFak _2YpK4 _1f9t- _2yrqS"]');
                    await page.click('button[class="_1UFak _2YpK4 _1f9t- _2yrqS"]');
                }
                await page.waitForSelector('input[name="firstname"]');
                await page.type('input[name="firstname"]', "Juan");
                await page.waitForSelector('input[name="lastname"]');
                await page.type('input[name="lastname"]', "Alvares");
                await page.waitForSelector('input[name="email"]');
                await page.type('input[name="email"]', "brya.nvelez.007@gmail.com");
                await page.waitForSelector('input[name="confirmEmail"]');
                await page.type('input[name="confirmEmail"]', "brya.nvelez.007@gmail.com");
                await page.waitForSelector('input[name="phone"]');
                await page.type('input[name="phone"]', "2012457645");
                await page.waitForSelector('button[type="submit"]');
                await page.click('button[type="submit"]');
                await page.waitForSelector('button[type="submit"]');
                await page.click('button[type="submit"]');
                await page.waitForSelector('input[name="shipping.line1"]');
                await page.type('input[name="shipping.line1"]', "1700 Highway 280 Bypass");
                await page.waitForSelector('input[name="shipping.postalCode"]');
                await page.type('input[name="shipping.postalCode"]', "36867");
                await page.waitForSelector('input[name="shipping.city"]');
                await page.type('input[name="shipping.city"]', "Phenix City");
                await page.waitForSelector('button[type="submit"]');
                await page.click('button[type="submit"]');
                await page.waitForSelector('button[type="submit"]');
                await page.click('button[type="submit"]');
                await page.waitForSelector('button[type="submit"]');
                await page.click('button[type="submit"]');
                await page.waitFor(3000);
                await page.waitForSelector('button[class="btn _9yfmt _194FD _2tFXQ _2SogC"]');
                await page.click('button[class="btn _9yfmt _194FD _2tFXQ _2SogC"]');
                await page.waitForSelector("input#creditCardNumberInput");
                await page.type("input#creditCardNumberInput", bin);
                await page.select('select[name="expMonth"]', mounth);
                await page.select('select[name="expYear"]', year);
                await page.waitForSelector('input[name="cvv"]');
                await page.type('input[name="cvv"]', cvv);
                await page.waitForSelector('button[type="submit"]');
                await page.click('button[type="submit"]');
                await page.waitForSelector('#rvn-note-NaN');

                const result = await page.evaluate(`
                (function () {
                    if (!document.querySelector('#rvn-note-NaN')) {
                        return true;
                    } else {
                        return false;
                    }
                })();`);

                if (result) {
                    creditCards.push({[bin]: "SUCCESS PAYMENT"});
                } else {
                    creditCards.push({[bin]: "ERROR PAYMENT"});
                }

                await browser.close();

            } catch (err) {
                console.log(err);
            }

        }

        res.status(200).json({response: creditCards});

    }
}
