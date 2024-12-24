import Buster from 'phantombuster';
import { RecipeController } from './interface/RecipeController';
import { ArgumentSchema, Arguments } from './shared/Validation';
import { Logger } from './shared/Logger';

(async () => {
  const buster = new Buster();

  const argsRaw = buster.argument as Record<string, unknown>;
  const args = ArgumentSchema.parse(argsRaw) as Arguments;

  try {
    const query = args.query;
    const pages = args.pages;

    const controller = new RecipeController();
    const results = await controller.handleSearch(query, pages);

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
