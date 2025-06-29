import { Actor } from 'apify';
import { PuppeteerCrawler, Dataset, log } from 'crawlee';
import { buildLoveUrls, handleLoveHolidays } from './src/loveholidays.js';

const DEFAULT_AIRPORTS = ['CWL', 'BRS'];
const DEFAULT_DURATIONS = [7, 14];
const input = (await Actor.getInput()) || {};
const site = input.site || 'tui';

const buildTuiUrls = (airports, durations) => {
    const base = 'https://www.tui.co.uk/destinations/packages';
    return airports.flatMap(ap =>
        durations.map(d => `${base}?airports%5B%5D=${ap}&duration=${d}&when=01-07-2025`)
    );
};

const startUrls =
    site === 'loveholidays'
        ? buildLoveUrls(DEFAULT_AIRPORTS, DEFAULT_DURATIONS)
        : buildTuiUrls(DEFAULT_AIRPORTS, DEFAULT_DURATIONS);

const handleTui = async ({ page }) => {
    const results = await page.evaluate(() => {
        const items = [];
        document.querySelectorAll('.resultsItem').forEach(el => {
            const title = el.querySelector('.item-title')?.innerText || '';
            const price = el.querySelector('.item-price')?.innerText || '';
            items.push({ title, price });
        });
        return items;
    });
    await Dataset.pushData(results);
};

await Actor.init();

const crawler = new PuppeteerCrawler({
    async requestHandler(ctx) {
        log.info(`Processing ${ctx.request.url}`);
        if (site === 'loveholidays') {
            await handleLoveHolidays(ctx);
        } else {
            await handleTui(ctx);
        }
    },
    maxRequestsPerCrawl: startUrls.length,
    headless: true,
});

await crawler.run(startUrls.map(url => ({ url })));

await Actor.exit();
