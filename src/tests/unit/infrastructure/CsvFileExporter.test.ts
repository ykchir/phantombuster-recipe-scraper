import { CsvFileExporter } from '../../../infrastructure/CsvFileExporter.js';
import fs from 'fs/promises';

jest.mock('fs/promises');

describe('CsvFileExporter', () => {
  it('should export data as CSV', async () => {
    const data = [{ name: 'Test', rating: 4.5 }];
    const mockCSV = 'name,rating\nTest,4.5';
    jest.spyOn(require('json2csv'), 'parse').mockReturnValue(mockCSV);

    const exporter = new CsvFileExporter();
    await exporter.export(data, 'test.csv');

    expect(fs.writeFile).toHaveBeenCalledWith('test.csv', mockCSV);
  });

  it('should throw an error if file write fails', async () => {
    const data = [{ name: 'Test', rating: 4.5 }];
    jest.spyOn(require('json2csv'), 'parse').mockReturnValue('mockCSV');
    (fs.writeFile as jest.Mock).mockRejectedValueOnce(
      new Error('File write error'),
    );

    const exporter = new CsvFileExporter();
    await expect(exporter.export(data, 'test.csv')).rejects.toThrow(
      'Failed to write CSV file: File write error',
    );
  });
});
