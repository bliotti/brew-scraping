const rp = require('request-promise');
const cheerio = require('cheerio');
const { Sema, RateLimit } = require('async-sema');

const limit = RateLimit(7);

const url = 'https://formulae.brew.sh/analytics/install/90d';
const { parser } = require('./parse');
const fs = require('fs');

const banane = async () => {
  const html = await rp(url);
  const $ = cheerio.load(html);
  const list = Array.from($('td > a', html)).map((x, i) => {
    return { href: x.attribs.href, rank: i };
  });

  for (const { href, rank } of list) {
    await limit();
    await parser('https://formulae.brew.sh' + href, rank).then((x) => {
      fs.appendFileSync('./test3.json', JSON.stringify(x) + ',', (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log('yes', rank);
      });
    });
  }
};

banane();
