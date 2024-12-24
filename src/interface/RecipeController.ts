import { Recipe } from 'src/domain/Recipe';
import { RecipeService } from '../application/RecipeService';
import { PuppeteerRecipeRepository } from '../infrastructure/PuppeteerRecipeRepository';

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
  ): Promise<Recipe[]> {
    const recipes = await this.recipeService.searchRecipes(query, pages);

    return recipes.filter((recipe) => recipe.rating >= minRating);
  }
}
