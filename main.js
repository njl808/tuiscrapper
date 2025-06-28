
import { PuppeteerCrawler, Dataset, log } from 'crawlee';

const startUrls = ['https://www.tui.co.uk/destinations/packages?airports%5B%5D=CWL&duration=7&when=01-07-2025'];

const crawler = new PuppeteerCrawler({
    async requestHandler({ page, request }) {
        log.info(`Processing ${request.url}`);
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
    },
    maxRequestsPerCrawl: 1,
    headless: true,
});

await crawler.run(startUrls.map(url => ({ url })));
