import minimist from 'minimist';
import Buster from 'phantombuster';
import { RecipeController } from './interface/RecipeController.js';
import { ArgumentSchema, Arguments } from './shared/Validation.js';
import { Logger } from './shared/Logger.js';

(async () => {
  const buster = new Buster();

  const argsRaw = minimist(process.argv.slice(2));

  const args = ArgumentSchema.parse({
    query: argsRaw.query,
    pages: argsRaw.pages,
    minRating: argsRaw.minRating,
    format: argsRaw.format,
  }) as Arguments;

  try {
    const query = args.query;
    const pages = args.pages;
    const minRating = args.minRating;
    const format = args.format as 'json' | 'csv';

    Logger.info(`Agent ID: ${buster.agentId}`);

    const controller = new RecipeController();
    const results = await controller.handleSearch(
      query,
      pages,
      minRating,
      format,
    );

    await buster.setResultObject(results);
  } catch (error: unknown) {
    if (error instanceof Error) {
      Logger.error('Error during execution:', error);
      await buster.setResultObject({
        error: {
          message: error.message,
          stack: error.stack,
        },
      });
    } else {
      const errorMessage = String(error);
      const wrappedError = new Error(errorMessage);
      Logger.error('Unexpected error:', wrappedError);
      await buster.setResultObject({
        error: {
          message: 'Unexpected error occurred',
          details: errorMessage,
        },
      });
    }
  }
})();
