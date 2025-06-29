import { Dataset } from 'crawlee';

export const buildLoveUrls = (airports, durations) => {
    const base = 'https://www.loveholidays.com/holidays';
    return airports.flatMap(ap =>
        durations.map(d => `${base}?departureAirportCode=${ap}&duration=${d}`)
    );
};

export const handleLoveHolidays = async ({ page }) => {
    const results = await page.evaluate(() => {
        const items = [];
        document.querySelectorAll('article').forEach(el => {
            const title = el.querySelector('h3, .title')?.innerText || '';
            const price = el.querySelector('.price')?.innerText || '';
            if (title && price) items.push({ title, price });
        });
        return items;
    });
    await Dataset.pushData(results);
};
