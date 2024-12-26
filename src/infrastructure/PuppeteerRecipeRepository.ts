import puppeteer, { Page } from 'puppeteer';
import { performance } from 'perf_hooks';
import { Recipe } from '../domain/Recipe.js';
import { RecipeRepository } from '../domain/RecipeRepository.js';
import { solveCaptcha } from '../shared/CaptchaSolver.js';
import { Logger } from '../shared/Logger.js';
import { delay } from '../shared/Utils.js';

export class PuppeteerRecipeRepository implements RecipeRepository {
  async searchRecipes(query: string, pages: number): Promise<Recipe[]> {
    const startTime = performance.now();
    const browser = await puppeteer.launch({ headless: 'new' });
    const recipes: Recipe[] = [];
    try {
      for (let i = 0; i < pages; i++) {
        const page = await browser.newPage();
        const pageRecipes = await this.scrapePage(page, query, i);

        const endTime = performance.now();
        const memoryUsage = process.memoryUsage();

        Logger.info(`Execution Time: ${(endTime - startTime).toFixed(2)} ms`);
        Logger.info(
          `Memory Usage: RSS ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
        );

        recipes.push(...pageRecipes);

        await page.close();
        await delay(1000 + Math.random() * 2000);
      }
    } finally {
      await browser.close();
    }
    return recipes;
  }

  private async retry<T>(
    fn: () => Promise<T>,
    retries = 3,
    delayMs = 1000,
  ): Promise<T> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt < retries) {
          const waitTime = delayMs * 2 ** (attempt - 1);
          Logger.warn(`Retrying in ${waitTime}ms due to error: ${error}`);
          await delay(waitTime);
        }
      }
    }
    throw new Error('Function did not return a result after maximum retries');
  }

  private async scrapePage(
    page: Page,
    query: string,
    pageIndex: number,
  ): Promise<{ name: string; url: string; reviews: number; rating: number }[]> {
    return this.retry(async () => {
      const offset = pageIndex * 24;
      const url = `https://www.allrecipes.com/search?offset=${offset}&q=${encodeURIComponent(query)}`;
      Logger.info(`Scraping URL: ${url}`);
      await page.goto(url, { waitUntil: 'domcontentloaded' });

      const captchaSolved = await solveCaptcha(page);
      if (!captchaSolved) {
        throw new Error('Unable to solve captcha');
      }

      await page.waitForSelector('.mntl-card-list-card--extendable', {
        timeout: 5000,
      });

      return await page.evaluate(() => {
        /* eslint-disable no-undef */
        return Array.from(
          document.querySelectorAll('.mntl-card-list-card--extendable'),
        ).map((card) => {
          const name =
            card.querySelector('.card__title-text')?.textContent?.trim() || '';
          const url = card.getAttribute('href') || '';
          const reviewsText =
            card
              .querySelector('.mm-recipes-card-meta__rating-count-number')
              ?.textContent?.trim() || '0';
          const reviews = parseInt(reviewsText.replace(/\D/g, ''), 10);

          const stars = card.querySelectorAll(
            '.mntl-recipe-star-rating svg.icon-star',
          ).length;
          const halfStars = card.querySelectorAll(
            '.mntl-recipe-star-rating svg.icon-star-half',
          ).length;
          const rating = stars + halfStars * 0.5;

          return { name, url, reviews, rating };
        });
        /* eslint-enable no-undef */
      });
    });
  }
}
