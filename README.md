# FetchSERP Node SDK

[GitHub Repository](https://github.com/fetchSERP/fetchserp-node)

Tiny, dependency-free Node.js client for the [FetchSERP](https://fetchserp.com) API.

## Installation

This package has **no runtime dependencies** apart from the native `fetch` implementation available in Node 18+.

```bash
npm install fetchserp-sdk
```

## Authentication

Every request sent with this SDK needs to be authenticated with a FetchSERP API key.  
Create (or copy) your key from your dashboard at <https://www.fetchserp.com>, then supply it when instantiating the client:

```js
import FetchSerpClient from 'fetchserp-sdk';

const client = new FetchSerpClient({ apiKey: 'YOUR_SECRET_API_KEY' });
```

💡 **Good to know:** Every new FetchSERP account comes with **250 free API credits**, so you can start experimenting right away without entering payment details.

## Quick start

```js
import FetchSerpClient from 'fetchserp-sdk';

const client = new FetchSerpClient({ apiKey: process.env.FETCHSERP_API_KEY });

const backlinks = await client.getBacklinks({ domain: 'example.com' });
console.log(backlinks);
```

### Additional endpoint examples

```js
// 1. Standard SERP search (plain HTML-less results)
const serp = await client.getSerp({
  query: 'serp api',
  country: 'us',        // optional, defaults to "us"
  search_engine: 'google', // optional, defaults to "google"
  pages_number: 2
});
console.log(serp.data.results);

// 2. Domain ranking lookup
const ranking = await client.getDomainRanking({
  keyword: 'fetchserp',
  domain: 'fetchserp.com',
  country: 'us'
});
console.log(ranking.data.results);
```

## Complete API Endpoints Reference

The SDK provides access to **24 powerful endpoints** for comprehensive SEO data analysis:

### 🔍 Search Engine Results (SERP)

**`getSerp({ query, search_engine, country, pages_number })`**  
Get clean SERP results from Google, Bing, Yahoo, or DuckDuckGo. Perfect for tracking rankings and competitor analysis.

**`getSerpHtml({ query, search_engine, country, pages_number })`**  
Same as above but includes full HTML content of each result page. Ideal for content analysis and scraping.

**`getSerpText({ query, search_engine, country, pages_number })`**  
Returns SERP results with extracted text content from each page. Great for content research and analysis.

**`getSerpJs({ query, country, pages_number })`** + **`getSerpJsResult({ uuid })`**  
Two-step process to get Google SERP with **AI Overview** using JavaScript rendering. Solves CAPTCHAs automatically.

**`getSerpAiMode({ query })`**  
Get both AI Overview and AI Mode response in a single call. Less reliable than the 2-step process but returns results in under 30 seconds.

### 📊 Keyword Research & Analysis

**`getKeywordsSearchVolume({ keywords, country })`**  
Get search volume, competition, and bidding data for any keywords. Essential for keyword planning.

**`getKeywordsSuggestions({ url, keywords, country })`**  
Discover related keywords based on a URL or seed keywords. Uncover new content opportunities.

**`getLongTailKeywords({ keyword, search_intent, count })`**  
Generate up to 500 long-tail variations for any keyword. Choose from informational, commercial, transactional, or navigational intent.

### 🌐 Domain Intelligence

**`getBacklinks({ domain, search_engine, country, pages_number })`**  
Find backlinks pointing to any domain. Includes anchor text, context, and link attributes for SEO analysis.

**`getDomainRanking({ keyword, domain, search_engine, country, pages_number })`**  
Check where a specific domain ranks for target keywords across search engines.

**`getDomainInfos({ domain })`**  
Comprehensive domain analysis: DNS records, WHOIS data, SSL certificates, and technology stack detection.

**`getDomainEmails({ domain, search_engine, country, pages_number })`**  
Extract email addresses associated with any domain for outreach and contact discovery.

**`getMozDomainAnalysis({ domain })`**  
Get Moz Domain Authority, linking domains, ranking keywords, and competitive insights.

**`getPageIndexation({ domain, keyword })`**  
Check if a domain is indexed in search engines for specific keywords.

### 🤖 Web Scraping & Content Extraction

**`scrapePage({ url })`**  
Extract HTML content from any webpage without JavaScript execution. Fast and reliable for static content.

**`scrapeDomain({ domain, max_pages })`**  
Scrape up to 200 pages from any domain. Perfect for site audits and content analysis.

**`scrapePageJs({ url, js_script, payload })`**  
Scrape dynamic content with custom JavaScript execution. Handle SPAs and interactive elements.

**`scrapePageJsWithProxy({ url, country, js_script, payload })`**  
Same as above but routes through country-specific proxies to bypass geo-restrictions.

### 🔬 AI-Powered Analysis

**`getWebPageAiAnalysis({ url, prompt })`**  
Analyze any webpage using AI with custom prompts. Extract insights, summarize content, or analyze competitors.

**`getWebPageSeoAnalysis({ url })`**  
Comprehensive SEO audit: technical issues, meta tags, headings, content analysis, and optimization recommendations.

**`getPlaywrightMcp({ prompt })`**  
Remote control a browser using GPT-4.1 via Playwright MCP server. Automate complex browser interactions with natural language commands.

### 👤 Account Management

**`getUser()`**  
Check your account information and remaining API credits.

## Error handling

All non-2xx responses throw a JavaScript `Error` that includes `status` and `response` properties for easier debugging.

```js
try {
  await client.scrapePage({ url: 'https://not-a-page.xyz' });
} catch (err) {
  console.error(err.status);     // → 422
  console.error(err.response);   // → { error: "Validation failed" }
}
```

## TypeScript support

Although this SDK is written in vanilla JS, it is shipped with generous JSDoc annotations so modern editors can provide inline documentation and type-hints out of the box.

## License

GPL-3.0 

## Testing the SDK locally

1. Make sure you're running Node ≥ 18 so that the native `fetch` API is available.
2. Export your API key in the shell (or use a `.env` file):

```bash
export FETCHSERP_API_KEY="your_secret_key"
```

3. Create a small script, for example `example.js`:

```js
import FetchSerpClient from './index.js';

const client = new FetchSerpClient({ apiKey: process.env.FETCHSERP_API_KEY });

const resp = await client.getUser();
console.log(resp);
```

4. Run it with Node:

```bash
node example.js
```

If your key is valid you'll see your account information and remaining credits.

## Deploying to production

Because this package is a single, dependency-free ES module you can:

• `npm install fetchserp-sdk --save` inside any Node 18+ application and commit the lock-file.  
• Use it in serverless environments (AWS Lambda, Vercel, Netlify, Cloudflare Workers ≥ D1) without extra bundling steps.  
• Bundle it with tools like esbuild / webpack; tree-shaking works out of the box.

Remember to inject your `FETCHSERP_API_KEY` securely using environment variables or a secrets manager in your chosen hosting platform.

## Publishing your fork to npm

If you enhance this SDK or maintain your own fork you might want to publish it under a different scope on npm. A quick checklist:

1. Create or sign-in to an npm account: <https://www.npmjs.com/signup>
2. Add (or update) the package name in `package.json`—it must be unique on npm.  
   For scoped packages, use the format `"@your-scope/fetchserp-sdk"`.
3. Bump the `version` field following semantic-versioning rules.
4. Log in from the terminal (stored in `~/.npmrc`):

   ```bash
   npm login --scope=@your-scope
   ```

5. Run the publish command from the project root:

   ```bash
   npm publish --access public
   ```

   Use `--access public` for scoped packages; non-scoped packages are public by default.

6. Verify that your package appears on <https://www.npmjs.com/package/@your-scope/fetchserp-sdk> and install it elsewhere with:

   ```bash
   npm install @your-scope/fetchserp-sdk
   ```

Tips:
• Include a meaningful `README.md`, `license`, and `keywords` so developers can discover your package.  
• Use `npm unpublish --force` only for critical mistakes; npm discourages breaking changes after publication.  
• Consider adding a `files` array or `.npmignore` to exclude dev files (tests, examples, *.md) from the published tarball.