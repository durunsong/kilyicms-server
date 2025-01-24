
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'  // 手动指定正确的 Chrome 路径
  });
  const page = await browser.newPage();
  await page.goto('https://www.dressin.com/');
})();
