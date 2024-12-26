import { Recipe } from './Recipe.js';

export interface RecipeRepository {
  searchRecipes(query: string, pages: number): Promise<Recipe[]>;
}
