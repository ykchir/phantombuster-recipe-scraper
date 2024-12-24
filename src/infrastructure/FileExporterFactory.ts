import { FileExporter } from '../domain/FileExporter';
import { JsonFileExporter } from '../infrastructure/JsonFileExporter';
import { CsvFileExporter } from '../infrastructure/CsvFileExporter';

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
