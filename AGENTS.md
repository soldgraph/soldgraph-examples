# Using the Soldgraph API (notes for coding agents)

Soldgraph is a REST API for resale marketplace data: eBay, Poshmark and Mercari sold and active listings; Depop, Whatnot, OfferUp and Facebook Marketplace active listings; TCGplayer product search and recent sales. US only.

- Base URL `https://api.soldgraph.com/v1`. Every route is `GET`.
- Auth: `Authorization: Bearer <key>`. Read the key from `SOLDGRAPH_KEY`. Keep it server-side.
- Full docs for agents: https://soldgraph.com/llms.txt and https://soldgraph.com/llms-full.txt. OpenAPI: https://soldgraph.com/openapi.json.

## Rules that are easy to get wrong

1. **Searches are jobs.** A search returns `200` with `status: "complete"` (cache hit) or `202` with `status: "pending"` and `poll_url`. Poll until `status` is `complete` or `failed`.
2. **Long-poll.** Call `poll_url` with `?wait=20`. The server holds the call for up to 20 seconds. Don't add your own sleep loop.
3. **`poll_url` is a path** like `/v1/jobs/{id}`. Join it to `https://api.soldgraph.com`, not to the `/v1` base URL.
4. **Check `status`, not only the HTTP code.** A job poll returns `200` for `pending`, `complete` and `failed`. A failed job has `error.code` and costs nothing.
5. **Send `Idempotency-Key`** (a UUID) on each search and reuse it on retries of that search, so a retry isn't charged twice.
6. **Rate limits.** 60 calls a minute per account, and a per-plan cap on pending searches. On `429`, wait `Retry-After` seconds.
7. **Rows live in `result.data`.** Prices are `displayed_price: { amount, currency }` and can be null. One call is one page. Follow `result.next_page` (and `result.next_cursor` where present).
8. **Condition values are per marketplace.** eBay uses `new`, `open_box`, `refurbished`, `used`, `for_parts`. Check each marketplace's docs before reusing values.

## Copy these instead of writing a client

- Python: [`python/soldgraph.py`](python/soldgraph.py)
- Node 18+: [`node/soldgraph.mjs`](node/soldgraph.mjs)

Both expose `search(path, params)` and return `result`, handling polling, retries and idempotency.

## Routes

| Path | Data |
| --- | --- |
| `/ebay/sold`, `/ebay/listings` | eBay sold / active |
| `/poshmark/sold`, `/poshmark/listings` | Poshmark sold / active |
| `/mercari/sold`, `/mercari/listings` | Mercari sold / active |
| `/depop/listings` | Depop active |
| `/whatnot/listings` | Whatnot active Buy It Now |
| `/offerup/listings`, `/offerup/item` | OfferUp local active, listing detail |
| `/facebook/listings`, `/facebook/item` | Facebook Marketplace local active (`zip` or `lat`/`lon`), listing detail |
| `/tcgplayer/search`, `/tcgplayer/sales` | TCGplayer products, recent sales sample |

Replacing eBay's retired `findCompletedItems`? See [`findcompleteditems-migration/`](findcompleteditems-migration/).
