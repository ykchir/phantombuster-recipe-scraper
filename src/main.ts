import Buster from 'phantombuster';
import { RecipeController } from './interface/RecipeController';
import { Logger } from './shared/Logger';

(async () => {
  const buster = new Buster();

  // const args = buster.argument as { query?: string; pages?: number };
  const args = { query: 'chicken', pages: 1 };
  const query = args.query || 'chicken';
  const pages = args.pages || 1;

  const controller = new RecipeController();

  try {
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
