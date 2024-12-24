import { PuppeteerRecipeRepository } from '../../src/infrastructure/PuppeteerRecipeRepository';
import puppeteer, { Browser } from 'puppeteer';

let browser: Browser;

beforeAll(async () => {
  browser = await puppeteer.launch({ headless: 'new' });
});

afterAll(async () => {
  if (browser) {
    await browser.close();
  }
});

describe('PuppeteerRecipeRepository', () => {
  it('PuppeteerRecipeRepository should return recipes from Allrecipes', async () => {
    const repository = new PuppeteerRecipeRepository();
    const recipes = await repository.searchRecipes('chicken', 1);

    expect(recipes.length).toBeGreaterThan(0);
    expect(recipes[0]).toHaveProperty('name');
    expect(recipes[0]).toHaveProperty('rating');
    expect(recipes[0]).toHaveProperty('reviews');
    expect(recipes[0]).toHaveProperty('url');
  });

  it('should scrape multiple pages of recipes', async () => {
    const repository = new PuppeteerRecipeRepository();
    const recipes = await repository.searchRecipes('chicken', 2);

    expect(recipes.length).toBeGreaterThan(0);
    expect(recipes[0]).toHaveProperty('name');
    expect(recipes[0]).toHaveProperty('rating');
    expect(recipes[0]).toHaveProperty('reviews');
    expect(recipes[0]).toHaveProperty('url');
  });

  it('should handle scraping multiple pages', async () => {
    const repository = new PuppeteerRecipeRepository();
    const recipes = await repository.searchRecipes('chicken', 5);

    expect(recipes.length).toBeGreaterThan(0);
    expect(recipes[0]).toHaveProperty('name');
  });
});
