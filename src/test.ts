import puppeteer from 'puppeteer';
import { Logger } from './shared/Logger.js';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto(
    'https://linkfluencer.io/en/blog/why-creators-need-linkfluencer-smartlinks',
  );
  Logger.info(await page.title());
  await browser.close();
})();
