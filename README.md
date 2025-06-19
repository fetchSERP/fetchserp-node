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

The SDK provides access to **22 powerful endpoints** for comprehensive SEO data analysis:

### 🔍 Search Engine Results (SERP)

**`getSerp({ query, search_engine, country, pages_number })`**  
Get clean SERP results from Google, Bing, Yahoo, or DuckDuckGo. Perfect for tracking rankings and competitor analysis.

**`getSerpHtml({ query, search_engine, country, pages_number })`**  
Same as above but includes full HTML content of each result page. Ideal for content analysis and scraping.

**`getSerpText({ query, search_engine, country, pages_number })`**  
Returns SERP results with extracted text content from each page. Great for content research and analysis.

**`getSerpJs({ query, country, pages_number })`** + **`getSerpJsResult({ uuid })`**  
Two-step process to get Google SERP with **AI Overview** using JavaScript rendering. Solves CAPTCHAs automatically.

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

