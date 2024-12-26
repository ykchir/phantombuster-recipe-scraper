import { FileExporterFactory } from '../../../infrastructure/FileExporterFactory';
import { JsonFileExporter } from '../../../infrastructure/JsonFileExporter';
import { CsvFileExporter } from '../../../infrastructure/CsvFileExporter';

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
    const unsupportedFormat = 'xml' as 'json' | 'csv';
    expect(() => FileExporterFactory.createExporter(unsupportedFormat)).toThrow(
      `Unsupported export format: ${unsupportedFormat}`,
    );
  });
});
