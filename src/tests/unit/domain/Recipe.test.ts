import { Recipe } from '../../../domain/Recipe.js';
import { describe, it, expect } from '@jest/globals';

describe('Recipe', () => {
  it('should create a valid Recipe object', () => {
    const recipe = new Recipe('Test Recipe', 4.5, 10, 'http://example.com'); // Utilise un nombre pour `rating`

    expect(recipe.name).toBe('Test Recipe');
    expect(recipe.rating).toBe(4.5); // Vérifie un nombre
    expect(recipe.reviews).toBe(10);
    expect(recipe.url).toBe('http://example.com');
  });
});
