import { Recipe } from '../domain/Recipe';
import { RecipeService } from '../application/RecipeService';
import { PuppeteerRecipeRepository } from '../infrastructure/PuppeteerRecipeRepository';
import { Logger } from '../shared/Logger';
import { FileExporterFactory } from '../infrastructure/FileExporterFactory';

export class RecipeController {
  private readonly recipeService: RecipeService;

  constructor() {
    const recipeRepository = new PuppeteerRecipeRepository();
    this.recipeService = new RecipeService(recipeRepository);
  }

  async handleSearch(
    query: string,
    pages: number,
    minRating = 0,
    format: 'json' | 'csv' = 'json',
  ): Promise<Recipe[]> {
    if (pages <= 0) {
      throw new Error('Pages must be a positive number');
    }

    const recipes = await this.recipeService.searchRecipes(query, pages);
    const filteredRecipes = recipes.filter(
      (recipe) => recipe.rating >= minRating,
    );
    await this.exportResults(filteredRecipes, format);

    return filteredRecipes;
  }

  async exportResults(
    results: Recipe[],
    format: 'json' | 'csv',
  ): Promise<void> {
    const fileName = `results.${format}`;

    try {
      const exporter = FileExporterFactory.createExporter(format);
      await exporter.export(results, fileName);
      Logger.info(`Results exported to ${fileName}`);
    } catch (error) {
      Logger.error('Failed to export results:', error as Error);
      throw error;
    }
  }
}
