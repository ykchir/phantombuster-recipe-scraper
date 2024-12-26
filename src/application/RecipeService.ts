import { Recipe } from '../domain/Recipe';
import { RecipeRepository } from '../domain/RecipeRepository';

export class RecipeService {
  constructor(private readonly recipeRepository: RecipeRepository) {}

  async searchRecipes(query: string, pages: number): Promise<Recipe[]> {
    if (!query) {
      throw new Error('Query cannot be empty');
    }

    return this.recipeRepository.searchRecipes(query, pages);
  }
}
