const rp = require('request-promise');
const cheerio = require('cheerio');

const parser = async (url, i) => {
  const html = await rp(url);
  const $ = cheerio.load(html);

  return {
    rank: i,
    desc: $('.desc', html).text(),
    homepage: $('.homepage', html).text(),
  };
};

module.exports = { parser };
