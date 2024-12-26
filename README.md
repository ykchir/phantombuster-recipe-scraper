# PhantomBuster Recipe Scraper

## Description

PhantomBuster Recipe Scraper is a Node.js application written in TypeScript, designed to scrape recipes from **AllRecipes** efficiently and with a high level of configurability. The project includes advanced features like multi-page scraping, CAPTCHA handling, and result filtering.

## Features

- **Multi-page scraping**: Retrieve recipes across multiple pages with parallelization for optimal performance.
- **Argument validation**: Use of [Zod](https://zod.dev/) to ensure input integrity.
- **Advanced filtering**: Filter recipes based on a minimum rating criteria.
- **CAPTCHA handling**: Automatic CAPTCHA detection with an extensible interface for automated solving.
- **Modular logging system**: Configurable logging levels (INFO, WARN, ERROR).
- **Comprehensive testing**: Full suite of unit, integration, and end-to-end tests with 100% coverage.

## Prerequisites

- Node.js (>=16.x)
- npm or yarn
- [PhantomBuster](https://phantombuster.com/) API (optional for mocks)
- Internet access for scraping.

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/ykchir/phantombuster-recipe-scraper.git
   cd phantombuster-recipe-scraper
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the TypeScript project:
   ```bash
   npm run build
   ```

## Usage

### Running the scraper

Run the scraper with the following command:

```bash
npm start -- --query="chicken" --pages=2 --minRating=4
```

### Configurable Options

- `query` (string): Search term (default: `"chicken"`).
- `pages`(number): Number of pages to scrape (default: 1).
- `minRating` (number): Minimum rating for filtering results (default: 0).
- `format` (string): The output file format, either `json` or `csv`(default: 'json').

### Example arguments

```bash
npm start -- --query="pasta" --pages=3 --minRating=4.5 --format="csv"
```

This will scrape recipes for "pasta" across 3 pages with a minimum rating of 4.5 and exports results into a csv file.

## Testing

### Running all tests

Run the tests with coverage:

```bash
npm run test
```

### Test types

- Unit tests: Validate individual components (`Logger`, `CaptchaSolver`).
- Integration tests: Test the interaction between modules (e.g., PuppeteerRecipeRepository).
- End-to-end tests: Simulate a complete user flow with real scraping.

### Test timeout

Integration tests include custom timeouts to handle long-running operations (e.g., multi-page scraping). Adjust global timeouts in `jest.config.js` if needed.

## Project Structure

```plaintext
├── dist                # Compiled JavaScript code
├── src
│   ├── __mocks__       # PhantomBuster mocks
│   ├── application     # Business services
│   ├── domain          # Entities and interfaces
│   ├── infrastructure  # Puppeteer scraper and File exporter factory
│   ├── interface       # Project entry points
│   ├── shared          # Reusable utilities (Logger, CaptchaSolver)
│   ├── tests           # Organized test suite
│   │   ├── e2e         # End-to-end tests
│   │   ├── integration # Integration tests
│   │   ├── unit        # Unit tests
│   ├── types           # Custom types and extensions
│   └── main.ts         # Main project entry
```

## Key Technical Highlights

### 1. CAPTCHA Handling

The project includes CAPTCHA detection via `CaptchaSolver`. If a CAPTCHA is detected, it logs a message and throws an error for manual handling or integration with an automated solving service.

### 2. Parallelization

The implementation uses `Promise.all` to scrape multiple pages in parallel, optimizing performance:

```typescript
const results = await Promise.all(
  Array.from({ length: pages }).map(async (_, i) => {
    const pageRecipes = await this.scrapePage(page, query, i);
    return pageRecipes;
  }),
);
```

### 3. Argument Validation

Input data validation is handled using `Zod`:

```typescript
const schema = z.object({
  query: z.string().nonempty('Query is required').default('default-query'),
  pages: z.number().int().min(1).default(1),
  minRating: z.number().min(0).default(0),
  format: z.string().default('json'),
});

const args = schema.parse({ query, pages, minRating, format });
```

### 4. Advanced Tests

The test suite includes:

- Comprehensive mocks for PhantomBuster.
- Resource management and custom timeouts for integration tests.

### 5. Future Improvements

- Proxy management: Add support for proxies to avoid being blocked by websites.
- Environment variables: Use a `.env` file for sensitive configurations (e.g., API keys).

## Documentation

### API of Results

The scraper returns a list of Recipe objects with the following fields:

- `name`: The recipe name.
- `rating`: The recipe rating (0 to 5).
- `reviews`: The number of reviews.
- `url`: The URL to the recipe.

### TypeScript Configuration

The `tsconfig.json` file enables strict mode with the following options:

-`noImplicitAny` -`strictNullChecks` -`strictFunctionTypes`
-Global definitions for `setTimeout` and `clearTimeout`.

## License

This project is licensed under the MIT License.

## Author

Developed by [ykchir](mailto:ykchir@example.com).
