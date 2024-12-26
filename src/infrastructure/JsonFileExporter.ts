import { FileExporter } from '../domain/FileExporter.js';
import fs from 'fs/promises';
import { Logger } from '../shared/Logger.js';

export class JsonFileExporter implements FileExporter {
  async export(data: object[], fileName: string): Promise<void> {
    try {
      const json = JSON.stringify(data, null, 2);
      await fs.writeFile(fileName, json);
      Logger.info(`Successfully exported JSON to ${fileName}`);
    } catch (error) {
      Logger.error(`Failed to export JSON to ${fileName}`, error as Error);
      throw new Error(`Failed to write JSON file: ${(error as Error).message}`);
    }
  }
}
