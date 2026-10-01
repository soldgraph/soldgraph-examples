# Soldgraph API examples

Copy-paste examples for the [Soldgraph](https://soldgraph.com?utm_source=github&utm_medium=referral&utm_campaign=soldgraph-examples) resale data API: eBay, Poshmark and Mercari **sold listings** as JSON, plus active listings from Depop, Whatnot and OfferUp and TCGplayer card prices.

Use it to replace eBay's retired `findCompletedItems`. You don't need an eBay developer account.

```python
from soldgraph import search  # python/soldgraph.py

result = search("/ebay/sold", {"q": "nintendo switch oled"})
for row in result["data"]:
    print(row["sold_date"], row["displayed_price"], row["title"])
```

[Get a free key](https://soldgraph.com/signup?utm_source=github&utm_medium=referral&utm_campaign=soldgraph-examples): 100 requests a month, no card.

## Examples

| Folder | What it shows |
| --- | --- |
| [`python/`](python/) | Client, eBay sold prices with a median, eBay vs Poshmark vs Mercari |
| [`node/`](node/) | Client (Node 18+, no dependencies), sold prices, paging through results |
| [`curl/`](curl/) | Search and poll from the shell with `jq` |
| [`google-sheets/`](google-sheets/) | `=SOLDGRAPH_SOLD("item")` custom function |
| [`findcompleteditems-migration/`](findcompleteditems-migration/) | Move off eBay's Finding API, with a field mapping |
| [`mcp/`](mcp/) | Connect Claude, Cursor or VS Code to the hosted MCP server |

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

Soldgraph is not affiliated with eBay, Poshmark, Mercari, Depop, Whatnot, OfferUp or TCGplayer.

MIT licensed.
