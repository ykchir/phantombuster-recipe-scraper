import Buster from "phantombuster";
import { RecipeController } from "./interface/RecipeController";

(async () => {
  const buster = new Buster();

  // const args = buster.argument as { query?: string; pages?: number };
  const args = { query: "chicken", pages: 1 };
  const query = args.query || "chicken";
  const pages = args.pages || 1;

  const controller = new RecipeController();

  try {
    const results = await controller.handleSearch(query, pages);
    await buster.setResultObject(results);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error during execution:", error.message);
      await buster.setResultObject({ error: error.message });
    } else {
      console.error("Unexpected error:", error);
      await buster.setResultObject({ error: "Unexpected error occurred" });
    }
  }
})();
