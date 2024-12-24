import { RecipeController } from '../../src/interface/RecipeController';

jest.mock('phantombuster', () => ({
  argument: { query: 'chicken', pages: 1, minRating: 4 },
  setResultObject: jest.fn(),
}));

describe('E2E Test', () => {
  it('should fetch and return recipes through the full flow', async () => {
    const controller = new RecipeController();

    const results = await controller.handleSearch('chicken', 1);

    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty('name');
    expect(results[0]).toHaveProperty('rating');
    expect(results[0]).toHaveProperty('reviews');
    expect(results[0]).toHaveProperty('url');
  });
});
