import puppeteer, { Page } from 'puppeteer';
import { Recipe } from '../domain/Recipe';
import { RecipeRepository } from '../domain/RecipeRepository';
import { solveCaptcha } from '../shared/CaptchaSolver';
import { Logger } from '../shared/Logger';

export class PuppeteerRecipeRepository implements RecipeRepository {
  async searchRecipes(query: string, pages: number): Promise<Recipe[]> {
    const browser = await puppeteer.launch({ headless: 'new' });
    const recipes: Recipe[] = [];
    try {
      const results = await Promise.all(
        Array.from({ length: pages }).map(async (_, i) => {
          const page = await browser.newPage();
          const pageRecipes = await this.scrapePage(page, query, i);
          await page.close();
          return pageRecipes;
        }),
      );
      recipes.push(...results.flat());
    } finally {
      await browser.close();
    }
    return recipes;
  }

  private async scrapePage(
    page: Page,
    query: string,
    pageIndex: number,
  ): Promise<{ name: string; url: string; reviews: number; rating: number }[]> {
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
  }
}
