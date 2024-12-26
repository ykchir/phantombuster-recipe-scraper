import { Recipe } from './Recipe';

export interface RecipeRepository {
  searchRecipes(query: string, pages: number): Promise<Recipe[]>;
}
