.js
+6
-0

@@ -32,30 +32,36 @@ const handleTui = async ({ page }) => {
            const title = el.querySelector('.item-title')?.innerText || '';
            const price = el.querySelector('.item-price')?.innerText || '';
            const board = el.querySelector('.board-basis')?.innerText || '';
            const link = el.querySelector('a[href]')?.href || '';
            if (title && price) {
                items.push({ title, board, price, link });
            }
        });
        return items;
    });

    await Dataset.pushData(results);
};

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
    launchContext: {
        launchOptions: {
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            ignoreHTTPSErrors: true,
        },
    },
});

await crawler.run(startUrls.map(url => ({ url })));

await Actor.exit();
