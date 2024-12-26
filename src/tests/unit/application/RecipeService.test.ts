import { RecipeService } from '../../../application/RecipeService.js';
import { RecipeRepository } from '../../../domain/RecipeRepository.js';
import { Recipe } from '../../../domain/Recipe.js';

describe('RecipeService', () => {
  it('should throw an error if the query is empty', async () => {
    const mockRepository: RecipeRepository = { searchRecipes: jest.fn() };

    const service = new RecipeService(mockRepository);

    await expect(service.searchRecipes('', 1)).rejects.toThrow(
      'Query cannot be empty',
    );
  });

  it('should return recipes from the repository', async () => {
    const mockRepository: RecipeRepository = {
      searchRecipes: jest.fn().mockResolvedValue([
        new Recipe('Recipe 1', 5, 10, 'http://example.com/1'), // Utilise un nombre pour `rating`
      ]),
    };

    const service = new RecipeService(mockRepository);

    const recipes = await service.searchRecipes('chicken', 1);

    expect(recipes).toHaveLength(1);
    expect(recipes[0]).toBeDefined();
    expect(recipes[0]?.name).toBe('Recipe 1');
    expect(recipes[0]?.rating).toBe(5); // Vérifie un nombre
  });
});
