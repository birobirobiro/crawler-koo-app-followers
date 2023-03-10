const express = require('express');
const ms = require('ms');
const app = express();
const puppeteer = require('puppeteer');

function removeFollowers(str) {
  return str.replace(/\s*followers\s*/, '');
}

let browser;

app.get('/', async (req, res) => {
  try {
    if (!browser) {
      browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);

    await page.goto('https://www.kooapp.com/profile/birobirobiro', {
      waitUntil: 'load',
      setTimeout: ms('0s'),
    });


    await page.waitForTimeout('1ms');

    await page.waitForSelector('span[class^="Follow_follow__count__t1dQ2"');
    const followersCount = await page.$eval('span[class^="Follow_follow__count__t1dQ2"', (el) => el.innerText);

    res.send({
      "followers": followersCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: err.message,
    });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

