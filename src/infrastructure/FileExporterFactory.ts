import { FileExporter } from '../domain/FileExporter.js';
import { JsonFileExporter } from '../infrastructure/JsonFileExporter.js';
import { CsvFileExporter } from '../infrastructure/CsvFileExporter.js';

export class FileExporterFactory {
  static createExporter(format: 'json' | 'csv'): FileExporter {
    switch (format) {
      case 'json':
        return new JsonFileExporter();
      case 'csv':
        return new CsvFileExporter();
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }
}
