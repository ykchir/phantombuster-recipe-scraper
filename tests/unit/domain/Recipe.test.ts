import { Recipe } from '../../../src/domain/Recipe';

describe('Recipe', () => {
  it('should create a valid Recipe object', () => {
    const recipe = new Recipe('Test Recipe', '4.5', 10, 'http://example.com');

    expect(recipe.name).toBe('Test Recipe');
    expect(recipe.rating).toBe('4.5');
    expect(recipe.reviews).toBe(10);
    expect(recipe.url).toBe('http://example.com');
  });
});
