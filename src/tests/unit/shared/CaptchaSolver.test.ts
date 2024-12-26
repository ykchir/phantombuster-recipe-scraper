import puppeteer, { Browser } from 'puppeteer';
import { solveCaptcha } from '../../../shared/CaptchaSolver';

let browser: Browser;

beforeAll(async () => {
  browser = await puppeteer.launch({ headless: 'new' });
});

afterAll(async () => {
  if (browser) {
    await browser.close();
  }
});

test('solveCaptcha should return true if no captcha is detected', async () => {
  const page = await browser.newPage();
  await page.setContent('<html><body>No captcha here!</body></html>');
  const result = await solveCaptcha(page);
  expect(result).toBe(true);
  await page.close();
});

test('solveCaptcha should return false if captcha is detected', async () => {
  const page = await browser.newPage();
  await page.setContent(
    '<html><iframe src="https://example.com/captcha"></iframe></html>',
  );
  const result = await solveCaptcha(page);
  expect(result).toBe(false);
  await page.close();
});

test('solveCaptcha should handle errors gracefully', async () => {
  const page = await browser.newPage();
  await page.setContent(
    '<html><iframe src="https://example.com/captcha"></iframe></html>',
  );

  page.$ = jest
    .fn()
    .mockRejectedValueOnce(new Error('Captcha detection failed'));

  const result = await solveCaptcha(page);
  expect(result).toBe(false);
  await page.close();
});
