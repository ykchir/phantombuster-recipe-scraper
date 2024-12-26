import { FileExporterFactory } from '../../../infrastructure/FileExporterFactory.js';
import { JsonFileExporter } from '../../../infrastructure/JsonFileExporter.js';
import { CsvFileExporter } from '../../../infrastructure/CsvFileExporter.js';

describe('FileExporterFactory', () => {
  it('should return a JsonFileExporter for json format', () => {
    const exporter = FileExporterFactory.createExporter('json');
    expect(exporter).toBeInstanceOf(JsonFileExporter);
  });

  it('should return a CsvFileExporter for csv format', () => {
    const exporter = FileExporterFactory.createExporter('csv');
    expect(exporter).toBeInstanceOf(CsvFileExporter);
  });

  it('should throw an error for unsupported formats', () => {
    expect(() => FileExporterFactory.createExporter('xml' as any)).toThrow(
      'Unsupported export format: xml',
    );
  });
});
