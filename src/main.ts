import minimist from 'minimist';
import Buster from 'phantombuster';
import { RecipeController } from './interface/RecipeController.js';
import { ArgumentSchema, Arguments } from './shared/Validation.js';
import { Logger } from './shared/Logger.js';

(async () => {
  const buster = new Buster();

  const cliArgs = minimist(process.argv.slice(2));

  const busterArgs = buster.argument as Record<string, unknown>;

  const argsRaw = {
    query: cliArgs.query || busterArgs.query,
    pages: cliArgs.pages || busterArgs.pages,
    minRating: cliArgs.minRating || busterArgs.minRating,
    format: cliArgs.format || busterArgs.format,
  };

  const args = ArgumentSchema.parse(argsRaw) as Arguments;

  try {
    const { query, pages, minRating, format } = args;

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
