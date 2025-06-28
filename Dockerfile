
FROM apify/actor-node-puppeteer-chrome

COPY . ./

RUN npm install

CMD ["npm", "start"]
