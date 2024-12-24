export const Logger = {
  info: (message: string) => console.log(`[INFO] ${message}`),
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${message}`);
    if (error) console.error(error.stack);
  },
};