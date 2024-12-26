import { parse } from 'json2csv';
import fs from 'fs/promises';
import { FileExporter } from '../domain/FileExporter.js';
import { Logger } from '../shared/Logger.js';

export class CsvFileExporter implements FileExporter {
  async export(data: object[], fileName: string): Promise<void> {
    try {
      const csv = parse(data);
      await fs.writeFile(fileName, csv);
      Logger.info(`Successfully exported CSV to ${fileName}`);
    } catch (error) {
      Logger.error(`Failed to export CSV to ${fileName}`, error as Error);
      throw new Error(`Failed to write CSV file: ${(error as Error).message}`);
    }
  }
}
