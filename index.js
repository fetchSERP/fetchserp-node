// FetchSERP Node SDK
// Minimal dependency (only built-in fetch)
// License: GPL-3.0

const DEFAULT_BASE_URL = 'https://www.fetchserp.com';

/**
 * @typedef {Object} ClientOptions
 * @property {string} apiKey   Your FetchSERP secret key (required)
 * @property {string} [baseUrl]  Override base URL for the API (optional)
 * @property {number} [timeout]  Request timeout in milliseconds (optional)
 */

/**
 * Simple wrapper around FetchSERP HTTP API.
 */
export class FetchSerpClient {
  /**
   * @param {ClientOptions} options
   */
  constructor(options) {
    if (!options || !options.apiKey) {
      throw new Error('Missing required "apiKey" in constructor options');
    }
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl || DEFAULT_BASE_URL;
    this.timeout = options.timeout || 30000; // default 30s
  }

  /* -------------------------------------------------- */
  /* Core helpers                                        */
  /* -------------------------------------------------- */

  /**
   * Perform an HTTP request.
   * @param {string} method      HTTP verb (GET|POST)
   * @param {string} path        Absolute path starting with '/'
   * @param {Object} [query]     Query string parameters
   * @param {Object|undefined} [body] JSON body for POST requests
   * @returns {Promise<any>}     Parsed JSON response body
   */
  async _request(method, path, query = {}, body) {
    const url = new URL(this.baseUrl + path);
    Object.entries(query || {}).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      // Arrays need to be serialized properly
      if (Array.isArray(value)) {
        value.forEach((v) => url.searchParams.append(`${key}[]`, v));
      } else {
        url.searchParams.append(key, String(value));
      }
    });

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.timeout);

    const res = await fetch(url.toString(), {
      method,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    }).finally(() => clearTimeout(id));

    const contentType = res.headers.get('content-type') || '';
    let data;
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    if (!res.ok) {
      const message = data && data.error ? data.error : res.statusText;
      const err = new Error(`Request failed with status ${res.status}: ${message}`);
      err.response = data;
      err.status = res.status;
      throw err;
    }

    return data;
  }

  /* -------------------------------------------------- */
  /* Public methods per API endpoint                    */
  /* -------------------------------------------------- */

  // GET /api/v1/backlinks
  async getBacklinks({ domain, search_engine, country, pages_number } = {}) {
    if (!domain) throw new Error('getBacklinks: "domain" is required');
    return this._request('GET', '/api/v1/backlinks', { domain, search_engine, country, pages_number });
  }

  // GET /api/v1/domain_emails
  async getDomainEmails({ domain, search_engine, country, pages_number } = {}) {
    if (!domain) throw new Error('getDomainEmails: "domain" is required');
    return this._request('GET', '/api/v1/domain_emails', { domain, search_engine, country, pages_number });
  }

  // GET /api/v1/domain_infos
  async getDomainInfos({ domain } = {}) {
    if (!domain) throw new Error('getDomainInfos: "domain" is required');
    return this._request('GET', '/api/v1/domain_infos', { domain });
  }

  // GET /api/v1/keywords_search_volume
  async getKeywordsSearchVolume({ keywords, country } = {}) {
    if (!keywords || keywords.length === 0) throw new Error('getKeywordsSearchVolume: "keywords" array is required');
    return this._request('GET', '/api/v1/keywords_search_volume', { keywords, country });
  }

  // GET /api/v1/keywords_suggestions
  async getKeywordsSuggestions({ url, keywords, country } = {}) {
    if (!url && (!keywords || keywords.length === 0)) {
      throw new Error('getKeywordsSuggestions: "url" or "keywords" is required');
    }
    return this._request('GET', '/api/v1/keywords_suggestions', { url, keywords, country });
  }

  // GET /api/v1/long_tail_keywords_generator
  async getLongTailKeywords({ keyword, search_intent, count } = {}) {
    if (!keyword) throw new Error('getLongTailKeywords: "keyword" is required');
    return this._request('GET', '/api/v1/long_tail_keywords_generator', { keyword, search_intent, count });
  }

  // GET /api/v1/moz
  async getMozDomainAnalysis({ domain } = {}) {
    if (!domain) throw new Error('getMozDomainAnalysis: "domain" is required');
    return this._request('GET', '/api/v1/moz', { domain });
  }

  // GET /api/v1/page_indexation
  async getPageIndexation({ domain, keyword } = {}) {
    if (!domain || !keyword) throw new Error('getPageIndexation: "domain" and "keyword" are required');
    return this._request('GET', '/api/v1/page_indexation', { domain, keyword });
  }

  // GET /api/v1/ranking
  async getDomainRanking({ keyword, domain, search_engine, country, pages_number } = {}) {
    if (!keyword || !domain) throw new Error('getDomainRanking: "keyword" and "domain" are required');
    return this._request('GET', '/api/v1/ranking', { keyword, domain, search_engine, country, pages_number });
  }

  // GET /api/v1/scrape
  async scrapePage({ url } = {}) {
    if (!url) throw new Error('scrapePage: "url" is required');
    return this._request('GET', '/api/v1/scrape', { url });
  }

  // GET /api/v1/scrape_domain
  async scrapeDomain({ domain, max_pages } = {}) {
    if (!domain) throw new Error('scrapeDomain: "domain" is required');
    return this._request('GET', '/api/v1/scrape_domain', { domain, max_pages });
  }

  // POST /api/v1/scrape_js
  async scrapePageJs({ url, js_script, payload } = {}) {
    if (!url) throw new Error('scrapePageJs: "url" is required');
    // The API defines js_script as query param and payload as JSON body
    const body = payload || (js_script ? { js_script } : undefined);
    return this._request('POST', '/api/v1/scrape_js', { url, js_script }, body);
  }

  // POST /api/v1/scrape_js_with_proxy
  async scrapePageJsWithProxy({ url, country, js_script, payload } = {}) {
    if (!url || !country) throw new Error('scrapePageJsWithProxy: "url" and "country" are required');
    const body = payload || (js_script ? { js_script } : undefined);
    return this._request('POST', '/api/v1/scrape_js_with_proxy', { url, country, js_script }, body);
  }

  // GET /api/v1/serp
  async getSerp({ query, search_engine, country, pages_number } = {}) {
    if (!query) throw new Error('getSerp: "query" is required');
    return this._request('GET', '/api/v1/serp', { query, search_engine, country, pages_number });
  }

  // GET /api/v1/serp_html
  async getSerpHtml({ query, search_engine, country, pages_number } = {}) {
    if (!query) throw new Error('getSerpHtml: "query" is required');
    return this._request('GET', '/api/v1/serp_html', { query, search_engine, country, pages_number });
  }

  // GET /api/v1/serp_js (step 1)
  async getSerpJs({ query, country, pages_number } = {}) {
    if (!query) throw new Error('getSerpJs: "query" is required');
    return this._request('GET', '/api/v1/serp_js', { query, country, pages_number });
  }

  // GET /api/v1/serp_js/{uuid} (step 2)
  async getSerpJsResult({ uuid } = {}) {
    if (!uuid) throw new Error('getSerpJsResult: "uuid" is required');
    return this._request('GET', `/api/v1/serp_js/${uuid}`);
  }

  // GET /api/v1/serp_ai_mode
  async getSerpAiMode({ query } = {}) {
    if (!query) throw new Error('getSerpAiMode: "query" is required');
    return this._request('GET', '/api/v1/serp_ai_mode', { query });
  }

  // GET /api/v1/serp_text
  async getSerpText({ query, search_engine, country, pages_number } = {}) {
    if (!query) throw new Error('getSerpText: "query" is required');
    return this._request('GET', '/api/v1/serp_text', { query, search_engine, country, pages_number });
  }

  // GET /api/v1/user
  async getUser() {
    return this._request('GET', '/api/v1/user');
  }

  // GET /api/v1/web_page_ai_analysis
  async getWebPageAiAnalysis({ url, prompt } = {}) {
    if (!url || !prompt) throw new Error('getWebPageAiAnalysis: "url" and "prompt" are required');
    return this._request('GET', '/api/v1/web_page_ai_analysis', { url, prompt });
  }

  // GET /api/v1/web_page_seo_analysis
  async getWebPageSeoAnalysis({ url } = {}) {
    if (!url) throw new Error('getWebPageSeoAnalysis: "url" is required');
    return this._request('GET', '/api/v1/web_page_seo_analysis', { url });
  }

  // GET /api/v1/playwright_mcp
  async getPlaywrightMcp({ prompt } = {}) {
    if (!prompt) throw new Error('getPlaywrightMcp: "prompt" is required');
    return this._request('GET', '/api/v1/playwright_mcp', { prompt });
  }

  // GET /api/v1/generate_wordpress_content
  async generateWordpressContent({ user_prompt, system_prompt, ai_model } = {}) {
    if (!user_prompt) throw new Error('generateWordpressContent: "user_prompt" is required');
    if (!system_prompt) throw new Error('generateWordpressContent: "system_prompt" is required');
    return this._request('GET', '/api/v1/generate_wordpress_content', { user_prompt, system_prompt, ai_model });
  }

  // GET /api/v1/generate_social_content
  async generateSocialContent({ user_prompt, system_prompt, ai_model } = {}) {
    if (!user_prompt) throw new Error('generateSocialContent: "user_prompt" is required');
    if (!system_prompt) throw new Error('generateSocialContent: "system_prompt" is required');
    return this._request('GET', '/api/v1/generate_social_content', { user_prompt, system_prompt, ai_model });
  }

}

export default FetchSerpClient; 