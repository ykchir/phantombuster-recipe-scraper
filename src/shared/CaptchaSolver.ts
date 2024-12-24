import { Page } from "puppeteer";

export async function solveCaptcha(page: Page): Promise<boolean> {
  try {
    const captchaFrame = await page.$('iframe[src*="captcha"]');
    if (!captchaFrame) {
      console.log("No captcha detected.");
      return true;
    }
    console.log("Captcha detected. Solve manually or implement auto-solving.");
    return false;
  } catch (error) {
    console.error("Failed to solve captcha:", error);
    return false;
  }
}
