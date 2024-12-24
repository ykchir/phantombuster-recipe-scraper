import { Page } from 'puppeteer';
import { Logger } from './Logger';

export async function solveCaptcha(page: Page): Promise<boolean> {
  try {
    const captchaFrame = await page.$('iframe[src*="captcha"]');
    if (!captchaFrame) {
      Logger.info('No captcha detected.');
      return true;
    }
    Logger.info('Captcha detected. Solve manually or implement auto-solving.');
    return false;
  } catch (error: unknown) {
    Logger.error('Failed to solve captcha:', error as Error);
    return false;
  }
}
