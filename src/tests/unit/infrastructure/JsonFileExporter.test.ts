import { JsonFileExporter } from '../../../infrastructure/JsonFileExporter';
import fs from 'fs/promises';

jest.mock('fs/promises');

describe('JsonFileExporter', () => {
  it('should export data as JSON', async () => {
    const data = [{ name: 'Test', rating: 4.5 }];
    const exporter = new JsonFileExporter();

    await exporter.export(data, 'test.json');

    expect(fs.writeFile).toHaveBeenCalledWith(
      'test.json',
      JSON.stringify(data, null, 2),
    );
  });

  it('should throw an error if file write fails', async () => {
    const data = [{ name: 'Test', rating: 4.5 }];
    (fs.writeFile as jest.Mock).mockRejectedValueOnce(
      new Error('File write error'),
    );

    const exporter = new JsonFileExporter();
    await expect(exporter.export(data, 'test.json')).rejects.toThrow(
      'Failed to write JSON file: File write error',
    );
  });
});
