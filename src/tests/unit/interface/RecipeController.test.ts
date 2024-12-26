import { RecipeController } from '../../../interface/RecipeController';
import { Recipe } from '../../../domain/Recipe';
import fs from 'fs/promises';
import { parse } from 'json2csv';
import { JsonFileExporter } from '../../../infrastructure/JsonFileExporter';
import { CsvFileExporter } from '../../../infrastructure/CsvFileExporter';

jest.mock('fs/promises');
jest.mock('json2csv', () => ({
  parse: jest.fn(),
}));

describe('RecipeController', () => {
  let controller: RecipeController;

  beforeEach(() => {
    controller = new RecipeController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleSearch', () => {
    it('should return filtered recipes by minRating', async () => {
      const mockRecipes: Recipe[] = [
        new Recipe('Recipe 1', 4.5, 100, 'http://example.com/1'),
        new Recipe('Recipe 2', 3.0, 50, 'http://example.com/2'),
      ];
      jest
        .spyOn(controller['recipeService'], 'searchRecipes')
        .mockResolvedValue(mockRecipes);

      const results = await controller.handleSearch('chicken', 1, 4.0);

      expect(results).toHaveLength(1);
      expect(results[0]?.name).toBe('Recipe 1');
    });

    it('should return all recipes if minRating is 0', async () => {
      const mockRecipes: Recipe[] = [
        new Recipe('Recipe 1', 4.5, 100, 'http://example.com/1'),
        new Recipe('Recipe 2', 3.0, 50, 'http://example.com/2'),
      ];
      jest
        .spyOn(controller['recipeService'], 'searchRecipes')
        .mockResolvedValue(mockRecipes);

      const results = await controller.handleSearch('chicken', 1, 0);

      expect(results).toHaveLength(2);
    });

    it('should throw an error if query is empty', async () => {
      await expect(controller.handleSearch('', 1)).rejects.toThrow(
        'Query cannot be empty',
      );
    });

    it('should throw an error if pages is negative', async () => {
      await expect(controller.handleSearch('chicken', -1)).rejects.toThrow(
        'Pages must be a positive number',
      );
    });
  });

  describe('exportResults', () => {
    it('should export results as JSON', async () => {
      const mockRecipes: Recipe[] = [
        new Recipe('Recipe 1', 4.5, 100, 'http://example.com/1'),
      ];

      await controller.exportResults(mockRecipes, 'json');

      expect(fs.writeFile).toHaveBeenCalledWith(
        'results.json',
        JSON.stringify(mockRecipes, null, 2),
      );
    });

    it('should export results as CSV', async () => {
      const mockRecipes: Recipe[] = [
        new Recipe('Recipe 1', 4.5, 100, 'http://example.com/1'),
      ];
      const mockCSV =
        'name,rating,reviews,url\nRecipe 1,4.5,100,http://example.com/1';
      (parse as jest.Mock).mockReturnValue(mockCSV);

      await controller.exportResults(mockRecipes, 'csv');

      expect(fs.writeFile).toHaveBeenCalledWith('results.csv', mockCSV);
    });

    it('should log the export operation', async () => {
      const mockRecipes: Recipe[] = [
        new Recipe('Recipe 1', 4.5, 100, 'http://example.com/1'),
      ];
      const loggerSpy = jest.spyOn(console, 'log');

      await controller.exportResults(mockRecipes, 'json');

      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('Results exported to results.json'),
      );
    });

    it('should throw an error for unsupported formats', async () => {
      const mockRecipes: Recipe[] = [
        new Recipe('Recipe 1', 4.5, 100, 'http://example.com/1'),
      ];

      await expect(
        controller.exportResults(
          mockRecipes,
          'xml' as unknown as 'json' | 'csv',
        ),
      ).rejects.toThrow('Unsupported export format: xml');

      try {
        await controller.exportResults(
          mockRecipes,
          'xml' as unknown as 'json' | 'csv',
        );
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Unsupported export format: xml');
      }
    });

    it('should handle unsupported formats explicitly', async () => {
      const mockRecipes: Recipe[] = [];
      await expect(
        controller.exportResults(
          mockRecipes,
          'yaml' as unknown as 'json' | 'csv',
        ),
      ).rejects.toThrow('Unsupported export format: yaml');
    });

    it('should use JsonFileExporter for JSON format', async () => {
      const mockRecipes: Recipe[] = [
        new Recipe('Recipe 1', 4.5, 100, 'http://example.com/1'),
      ];
      const jsonExporterSpy = jest.spyOn(JsonFileExporter.prototype, 'export');
      jest.spyOn(CsvFileExporter.prototype, 'export'); // Ensures CSV is not called

      await controller.exportResults(mockRecipes, 'json');

      expect(jsonExporterSpy).toHaveBeenCalledWith(mockRecipes, 'results.json');
      expect(CsvFileExporter.prototype.export).not.toHaveBeenCalled();
    });

    it('should use CsvFileExporter for CSV format', async () => {
      const mockRecipes: Recipe[] = [
        new Recipe('Recipe 1', 4.5, 100, 'http://example.com/1'),
      ];

      const csvExporterSpy = jest.spyOn(CsvFileExporter.prototype, 'export');
      const jsonExporterSpy = jest.spyOn(JsonFileExporter.prototype, 'export');

      await controller.exportResults(mockRecipes, 'csv');

      expect(csvExporterSpy).toHaveBeenCalledWith(mockRecipes, 'results.csv');
      expect(jsonExporterSpy).not.toHaveBeenCalled();

      csvExporterSpy.mockRestore();
      jsonExporterSpy.mockRestore();
    });
  });
});
