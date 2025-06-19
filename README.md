# FetchSERP Node SDK

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

All available methods map 1-to-1 to the public REST endpoints described in the API documentation:

| Method | Underlying endpoint |
| ------ | ------------------- |
| `getBacklinks` | `GET /api/v1/backlinks` |
| `getDomainEmails` | `GET /api/v1/domain_emails` |
| `getDomainInfos` | `GET /api/v1/domain_infos` |
| `getKeywordsSearchVolume` | `GET /api/v1/keywords_search_volume` |
| `getKeywordsSuggestions` | `GET /api/v1/keywords_suggestions` |
| `getLongTailKeywords` | `GET /api/v1/long_tail_keywords_generator` |
| `getMozDomainAnalysis` | `GET /api/v1/moz` |
| `getPageIndexation` | `GET /api/v1/page_indexation` |
| `getDomainRanking` | `GET /api/v1/ranking` |
| `scrapePage` | `GET /api/v1/scrape` |
| `scrapeDomain` | `GET /api/v1/scrape_domain` |
| `scrapePageJs` | `POST /api/v1/scrape_js` |
| `scrapePageJsWithProxy` | `POST /api/v1/scrape_js_with_proxy` |
| `getSerp` | `GET /api/v1/serp` |
| `getSerpHtml` | `GET /api/v1/serp_html` |
| `getSerpJs` | `GET /api/v1/serp_js` |
| `getSerpJsResult` | `GET /api/v1/serp_js/{uuid}` |
| `getSerpText` | `GET /api/v1/serp_text` |
| `getUser` | `GET /api/v1/user` |
| `getWebPageAiAnalysis` | `GET /api/v1/web_page_ai_analysis` |
| `getWebPageSeoAnalysis` | `GET /api/v1/web_page_seo_analysis` |

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

