import { RecipeService } from "../application/RecipeService";
import { PuppeteerRecipeRepository } from "../infrastructure/PuppeteerRecipeRepository";

export class RecipeController {
  private readonly recipeService: RecipeService;

  constructor() {
    const recipeRepository = new PuppeteerRecipeRepository();
    this.recipeService = new RecipeService(recipeRepository);
  }

  async handleSearch(query: string, pages: number) {
    return await this.recipeService.searchRecipes(query, pages);
  }
}

