# eBay sold listings API examples

Copy-paste examples for the [Soldgraph eBay sold listings API](https://soldgraph.com/ebay-sold-listings-api?utm_source=github&utm_medium=referral&utm_campaign=soldgraph-examples) and the rest of its resale data API: eBay, Poshmark and Mercari **sold listings** as JSON, plus active listings from Depop, Whatnot, OfferUp and Facebook Marketplace and Vinted, and TCGplayer card prices.

Use it to replace eBay's retired `findCompletedItems`. You don't need an eBay developer account.

```python
from soldgraph import search  # python/soldgraph.py

result = search("/ebay/sold", {"q": "nintendo switch oled"})
for row in result["data"]:
    print(row["sold_date"], row["displayed_price"], row["title"])
```

[Get a free key](https://soldgraph.com/signup?utm_source=github&utm_medium=referral&utm_campaign=soldgraph-examples): 100 free requests, no credit card required.

## Examples

| Folder | What it shows |
| --- | --- |
| [`python/`](python/) | Client, eBay sold prices with a median, eBay vs Poshmark vs Mercari, Facebook Marketplace near a ZIP code |
| [`node/`](node/) | Client (Node 18+, no dependencies), sold prices, paging through results, Facebook Marketplace near a ZIP code |
| [`curl/`](curl/) | Search and poll from the shell with `jq` |
| [`google-sheets/`](google-sheets/) | `=SOLDGRAPH_SOLD("item")` custom function |
| [`findcompleteditems-migration/`](findcompleteditems-migration/) | Move off eBay's Finding API, with a field mapping |
| [`mcp/`](mcp/) | Connect Claude, Cursor or VS Code to the hosted MCP server |

## eBay sold listings API: request and response

```bash
curl -G https://api.soldgraph.com/v1/ebay/sold \
  -H "Authorization: Bearer $SOLDGRAPH_KEY" \
  --data-urlencode "q=sony wh-1000xm5" \
  --data-urlencode "count=120" \
  --data-urlencode "sort=recently_sold"
```

The first call usually returns `202` and a `poll_url`. When the job finishes, you get one page of sold listings and a price summary. This is a shortened example from the [API reference](https://soldgraph.com/docs/api/sold?utm_source=github&utm_medium=referral&utm_campaign=soldgraph-examples):

```json
{
  "status": "complete",
  "result": {
    "provider": "ebay",
    "country": "us",
    "query": "sony wh-1000xm5",
    "next_page": null,
    "summary": {
      "priced_count": 1,
      "currency": "USD",
      "median": 189,
      "median_excluding_best_offer": 189
    },
    "data": [
      {
        "title": "Example eBay listing",
        "link": "https://www.ebay.com/itm/123456789012",
        "displayed_price": { "amount": 189, "currency": "USD" },
        "best_offer_accepted": false,
        "sold_date": "2026-09-21",
        "condition": "Pre-Owned"
      }
    ]
  }
}
```

Each call returns one page of recent sold listings, not a full sales history. On a Best Offer sale, eBay shows only the asking price, so `best_offer_accepted` flags that row.

## Run one

```bash
export SOLDGRAPH_KEY=sg_...

# Python
cd python && pip install -r requirements.txt && python ebay_sold.py "nintendo switch oled"

# Node
node node/ebay-sold.mjs "nintendo switch oled"

# curl
./curl/ebay-sold.sh "nintendo switch oled"
```

## How the API works

A search either returns its result right away or a job to poll. The clients in `python/` and `node/` handle that, plus retries and idempotency. If you're writing your own, read [`AGENTS.md`](AGENTS.md) first.

## Links

- [Docs](https://soldgraph.com/docs?utm_source=github&utm_medium=referral&utm_campaign=soldgraph-examples) · [Quickstart](https://soldgraph.com/docs/quickstart?utm_source=github&utm_medium=referral&utm_campaign=soldgraph-examples) · [OpenAPI](https://soldgraph.com/openapi.json) · [llms.txt](https://soldgraph.com/llms.txt)
- [Marketplaces](https://soldgraph.com/docs/marketplaces?utm_source=github&utm_medium=referral&utm_campaign=soldgraph-examples) · [How prices work](https://soldgraph.com/docs/how-prices-work?utm_source=github&utm_medium=referral&utm_campaign=soldgraph-examples) · [Rate limits](https://soldgraph.com/docs/api/rate-limits?utm_source=github&utm_medium=referral&utm_campaign=soldgraph-examples)

Soldgraph is not affiliated with eBay, Poshmark, Mercari, Depop, Whatnot, OfferUp, Facebook, Vinted or TCGplayer.

MIT licensed.
