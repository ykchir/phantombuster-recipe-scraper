import { parse } from 'json2csv';
import fs from 'fs/promises';
import { CsvFileExporter } from '../../../infrastructure/CsvFileExporter';

jest.mock('fs/promises');
jest.mock('json2csv', () => ({
  parse: jest.fn(),
}));

describe('CsvFileExporter', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should export data as CSV', async () => {
    const data = [{ name: 'Test', rating: 4.5 }];
    const mockCSV = 'name,rating\nTest,4.5';
    (parse as jest.Mock).mockReturnValue(mockCSV);

    const exporter = new CsvFileExporter();
    await exporter.export(data, 'test.csv');

    expect(fs.writeFile).toHaveBeenCalledWith('test.csv', mockCSV);
  });

  it('should throw an error if file write fails', async () => {
    const data = [{ name: 'Test', rating: 4.5 }];
    (parse as jest.Mock).mockReturnValue('mockCSV');
    (fs.writeFile as jest.Mock).mockRejectedValueOnce(
      new Error('File write error'),
    );

    const exporter = new CsvFileExporter();
    await expect(exporter.export(data, 'test.csv')).rejects.toThrow(
      'Failed to write CSV file: File write error',
    );
  });
});
