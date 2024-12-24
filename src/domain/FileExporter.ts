export interface FileExporter {
  export(data: object[], fileName: string): Promise<void>;
}
